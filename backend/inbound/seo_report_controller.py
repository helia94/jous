"""
Read-only Search Console data for the weekly SEO routine.

The cloud routine cannot hold the Google service-account key, but this backend can
(GOOGLE_SERVICE_ACCOUNT_JSON on Railway). The routine calls this endpoint with the
static SEO_REPORT_TOKEN instead. Everything here is read-only reporting.
"""
import hmac
import json
import os
import time

import jwt
import requests
from flask import Blueprint, jsonify, request

seo_report_api = Blueprint("seo_report_api", __name__)

TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPE = "https://www.googleapis.com/auth/webmasters"
PROPERTY = "https://jous.app/"
SITE = "https://jous.app"

INSPECT_URLS = [
    f"{SITE}/",
    f"{SITE}/conversation-cards",
    f"{SITE}/online-conversation-cards",
    f"{SITE}/random-conversation-cards",
    f"{SITE}/open-source-conversation-cards",
    f"{SITE}/free-conversation-cards",
    f"{SITE}/conversation-cards-for-friends",
    f"{SITE}/conversation-cards-for-couples",
    f"{SITE}/conversation-cards-for-date-night",
    f"{SITE}/weird-conversation-cards",
    f"{SITE}/non-cringe-conversation-starters",
    f"{SITE}/printable-conversation-cards",
    f"{SITE}/open-source-card-dataset",
    f"{SITE}/de/gespraechskarten",
    f"{SITE}/es/cartas-de-conversacion",
    f"{SITE}/fa/conversation-cards",
    f"{SITE}/blog",
    f"{SITE}/blog/art-of-small-talk",
    f"{SITE}/question/1441",
]


def _google_token():
    creds = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"])
    now = int(time.time())
    assertion = jwt.encode(
        {"iss": creds["client_email"], "scope": SCOPE, "aud": TOKEN_URL, "iat": now, "exp": now + 3600},
        creds["private_key"],
        algorithm="RS256",
    )
    r = requests.post(
        TOKEN_URL,
        data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()["access_token"]


def _analytics(token, start, end, dimensions, query_contains=None, row_limit=100):
    body = {"startDate": start, "endDate": end, "dimensions": dimensions, "rowLimit": row_limit, "dataState": "final"}
    if query_contains:
        body["dimensionFilterGroups"] = [
            {"filters": [{"dimension": "query", "operator": "contains", "expression": query_contains}]}
        ]
    r = requests.post(
        "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fjous.app%2F/searchAnalytics/query",
        headers={"Authorization": f"Bearer {token}"},
        json=body,
        timeout=60,
    )
    r.raise_for_status()
    return r.json().get("rows", [])


@seo_report_api.route("/seo/weekly", methods=["GET"])
def seo_weekly():
    expected = os.getenv("SEO_REPORT_TOKEN") or ""
    supplied = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    if not expected or not hmac.compare_digest(expected, supplied):
        return jsonify({"error": "unauthorized"}), 401

    import datetime as dt

    end = (dt.date.today() - dt.timedelta(days=3)).isoformat()
    start7 = (dt.date.today() - dt.timedelta(days=9)).isoformat()
    start28 = (dt.date.today() - dt.timedelta(days=30)).isoformat()

    token = _google_token()
    out = {
        "property": PROPERTY,
        "window": {"end": end, "start_7d": start7, "start_28d": start28},
        "analytics": {
            "7d_queries": _analytics(token, start7, end, ["query"]),
            "7d_pages": _analytics(token, start7, end, ["page"]),
            "28d_queries": _analytics(token, start28, end, ["query"]),
            "28d_pages": _analytics(token, start28, end, ["page"]),
            "28d_conversation_queries": _analytics(token, start28, end, ["query"], query_contains="conversation"),
        },
    }

    if request.args.get("inspect") == "1":
        # Inspections run in parallel: 19 sequential calls exceeded the 30s
        # gunicorn worker timeout (each Google call takes 1-3s).
        from concurrent.futures import ThreadPoolExecutor

        def inspect(url):
            try:
                r = requests.post(
                    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"inspectionUrl": url, "siteUrl": PROPERTY},
                    timeout=20,
                )
                r.raise_for_status()
                status = r.json().get("inspectionResult", {}).get("indexStatusResult", {})
                return url, {
                    "verdict": status.get("verdict"),
                    "coverage": status.get("coverageState"),
                    "lastCrawl": status.get("lastCrawlTime"),
                    "googleCanonical": status.get("googleCanonical"),
                }
            except Exception as exc:  # report the failure per URL, keep going
                return url, {"error": str(exc)[:200]}

        with ThreadPoolExecutor(max_workers=6) as pool:
            out["inspections"] = dict(pool.map(inspect, INSPECT_URLS))

    return jsonify(out), 200
