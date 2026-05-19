#!/usr/bin/env python3
"""
Pull Google Search Console SEO metrics for Jous.

Examples:
  python backend/scripts/search_console_report.py \
    --site-url https://jous.app/ \
    --start-date 2026-05-01 \
    --end-date 2026-05-31 \
    --query-contains "conversation cards"

Auth:
  - Set GOOGLE_ACCESS_TOKEN to an OAuth token with the webmasters scope, or
  - Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN, or
  - Set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file that has
    been added to the Search Console property.
"""

import argparse
import datetime as dt
import json
import os
import sys
import time
from typing import Any, Dict, List, Optional
from urllib.parse import quote

SEARCH_ANALYTICS_URL = "https://www.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query"
SITES_URL = "https://www.googleapis.com/webmasters/v3/sites"
TOKEN_URL = "https://oauth2.googleapis.com/token"
WEBMASTERS_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"


def load_env_file(path: str) -> None:
    if not path or not os.path.exists(path):
        return

    with open(path, "r", encoding="utf-8") as fh:
        for raw_line in fh:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def default_previous_month() -> tuple[str, str]:
    today = dt.date.today()
    first_this_month = today.replace(day=1)
    last_previous_month = first_this_month - dt.timedelta(days=1)
    first_previous_month = last_previous_month.replace(day=1)
    return first_previous_month.isoformat(), last_previous_month.isoformat()


def get_access_token(credentials_path: Optional[str]) -> str:
    env_token = os.getenv("GOOGLE_ACCESS_TOKEN")
    if env_token:
        return env_token

    refresh_token = os.getenv("GOOGLE_REFRESH_TOKEN")
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if refresh_token and client_id and client_secret:
        try:
            import requests
        except ImportError as exc:
            raise RuntimeError("Search Console API calls require requests. Install project requirements.") from exc

        response = requests.post(
            TOKEN_URL,
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["access_token"]

    credentials_path = credentials_path or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise RuntimeError(
            "Missing auth. Set GOOGLE_ACCESS_TOKEN, GOOGLE_REFRESH_TOKEN credentials, or GOOGLE_APPLICATION_CREDENTIALS."
        )

    try:
        import jwt
    except ImportError as exc:
        raise RuntimeError(
            "Service-account auth requires PyJWT. Install project requirements or use GOOGLE_ACCESS_TOKEN."
        ) from exc

    with open(credentials_path, "r", encoding="utf-8") as fh:
        credentials = json.load(fh)

    now = int(time.time())
    payload = {
        "iss": credentials["client_email"],
        "scope": WEBMASTERS_SCOPE,
        "aud": TOKEN_URL,
        "iat": now,
        "exp": now + 3600,
    }
    assertion = jwt.encode(payload, credentials["private_key"], algorithm="RS256")
    try:
        import requests
    except ImportError as exc:
        raise RuntimeError("Search Console API calls require requests. Install project requirements.") from exc

    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion": assertion,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def search_analytics_query(
    token: str,
    site_url: str,
    body: Dict[str, Any],
) -> List[Dict[str, Any]]:
    try:
        import requests
    except ImportError as exc:
        raise RuntimeError("Search Console API calls require requests. Install project requirements.") from exc

    endpoint = SEARCH_ANALYTICS_URL.format(site_url=quote(site_url, safe=""))
    response = requests.post(
        endpoint,
        headers={"Authorization": f"Bearer {token}"},
        json=body,
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("rows", [])


def list_sites(token: str) -> List[Dict[str, Any]]:
    try:
        import requests
    except ImportError as exc:
        raise RuntimeError("Search Console API calls require requests. Install project requirements.") from exc

    response = requests.get(
        SITES_URL,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("siteEntry", [])


def metrics_body(
    start_date: str,
    end_date: str,
    dimensions: List[str],
    row_limit: int,
    query_contains: Optional[str] = None,
) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "final",
    }
    if query_contains:
        body["dimensionFilterGroups"] = [
            {
                "filters": [
                    {
                        "dimension": "query",
                        "operator": "contains",
                        "expression": query_contains,
                    }
                ]
            }
        ]
    return body


def render_rows(rows: List[Dict[str, Any]], dimensions: List[str]) -> List[Dict[str, Any]]:
    rendered = []
    for row in rows:
        item = {dimension: row.get("keys", [""] * len(dimensions))[index] for index, dimension in enumerate(dimensions)}
        item.update(
            {
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0),
                "position": row.get("position", 0),
            }
        )
        rendered.append(item)
    return rendered


def low_performing_pages(
    rows: List[Dict[str, Any]],
    min_impressions: int,
    max_ctr: float,
    min_position: float,
) -> List[Dict[str, Any]]:
    flagged = []
    for row in rows:
        impressions = row.get("impressions", 0)
        ctr = row.get("ctr", 0)
        position = row.get("position", 0)
        if impressions >= min_impressions and (ctr <= max_ctr or position >= min_position):
            flagged.append(row)
    return flagged


def print_report(
    query_rows: List[Dict[str, Any]],
    page_rows: List[Dict[str, Any]],
    flagged_pages: List[Dict[str, Any]],
    args: argparse.Namespace,
) -> None:
    print(f"# Search Console report: {args.start_date} to {args.end_date}")
    print()
    print(f"Site: `{args.site_url}`")
    print(f"Query filter: `{args.query_contains}`")
    print()

    print("## Conversation Cards Queries")
    if not query_rows:
        print("No query rows returned.")
    for row in query_rows:
        print(
            "- {query} | page: {page} | clicks: {clicks} | impressions: {impressions} | "
            "CTR: {ctr:.2%} | position: {position:.1f}".format(**row)
        )

    print()
    print("## Pages With Impressions But Low CTR / Ranking")
    if not flagged_pages:
        print("No pages matched the low-performance thresholds.")
    for row in flagged_pages:
        print(
            "- {page} | clicks: {clicks} | impressions: {impressions} | "
            "CTR: {ctr:.2%} | position: {position:.1f}".format(**row)
        )

    print()
    print("## Thresholds")
    print(f"- Minimum impressions: {args.min_impressions}")
    print(f"- Low CTR threshold: {args.max_ctr:.2%}")
    print(f"- Weak average position threshold: {args.min_position:.1f}")


def parse_args() -> argparse.Namespace:
    env_parser = argparse.ArgumentParser(add_help=False)
    env_parser.add_argument("--env-file", default=".env", help="Optional env file to load before auth.")
    env_args, _ = env_parser.parse_known_args()
    load_env_file(env_args.env_file)

    default_start, default_end = default_previous_month()
    parser = argparse.ArgumentParser(
        description="Report Search Console SEO metrics for Jous.",
        parents=[env_parser],
    )
    parser.add_argument(
        "--site-url",
        default=os.getenv("SEARCH_CONSOLE_SITE_URL", "https://jous.app/"),
        help="Search Console property URL.",
    )
    parser.add_argument("--start-date", default=default_start, help="Start date in YYYY-MM-DD format.")
    parser.add_argument("--end-date", default=default_end, help="End date in YYYY-MM-DD format.")
    parser.add_argument(
        "--query-contains",
        default=os.getenv("SEARCH_CONSOLE_QUERY_CONTAINS", "conversation cards"),
        help="Query substring to report.",
    )
    parser.add_argument("--row-limit", type=int, default=100, help="Maximum rows per API query.")
    parser.add_argument("--min-impressions", type=int, default=50, help="Minimum impressions for page flags.")
    parser.add_argument("--max-ctr", type=float, default=0.02, help="CTR at or below this value is flagged.")
    parser.add_argument("--min-position", type=float, default=10.0, help="Average position at or above this value is flagged.")
    parser.add_argument("--credentials", help="Path to service-account JSON credentials.")
    parser.add_argument("--list-sites", action="store_true", help="List Search Console properties visible to this token.")
    parser.add_argument("--json", action="store_true", help="Print JSON instead of Markdown.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        token = get_access_token(args.credentials)
        if args.list_sites:
            sites = list_sites(token)
            if args.json:
                print(json.dumps({"sites": sites}, indent=2))
            else:
                print("# Search Console Properties")
                if not sites:
                    print("No properties returned for this token.")
                for site in sites:
                    print(f"- {site.get('siteUrl')} | permission: {site.get('permissionLevel')}")
            return 0

        query_rows = render_rows(
            search_analytics_query(
                token,
                args.site_url,
                metrics_body(
                    args.start_date,
                    args.end_date,
                    ["query", "page"],
                    args.row_limit,
                    args.query_contains,
                ),
            ),
            ["query", "page"],
        )
        page_rows = render_rows(
            search_analytics_query(
                token,
                args.site_url,
                metrics_body(args.start_date, args.end_date, ["page"], args.row_limit),
            ),
            ["page"],
        )
        flagged_pages = low_performing_pages(
            page_rows,
            args.min_impressions,
            args.max_ctr,
            args.min_position,
        )
    except Exception as exc:
        print(f"Search Console report failed: {exc}", file=sys.stderr)
        return 1

    if args.json:
        print(
            json.dumps(
                {
                    "site_url": args.site_url,
                    "start_date": args.start_date,
                    "end_date": args.end_date,
                    "query_contains": args.query_contains,
                    "query_rows": query_rows,
                    "low_performing_pages": flagged_pages,
                },
                indent=2,
            )
        )
    else:
        print_report(query_rows, page_rows, flagged_pages, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
