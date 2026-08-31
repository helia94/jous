#!/usr/bin/env python3
"""
Make the Jous service account an owner of the Search Console property using
the Site Verification API, then register the property and (optionally) add a
human co-owner. Requires the same credentials as search_console_report.py.

  --token META    print the <meta> tag token for https://jous.app/   (URL-prefix property)
  --token DNS     print the DNS TXT token for jous.app               (domain property)
  --verify META | --verify DNS   ask Google to check the token and grant ownership
  --add-owner EMAIL              add a Google account as co-owner of the verified resource
  --register                     add the property to the SA's Search Console (sites.add)
"""
import argparse
import json
import os
import sys
import time

import jwt
import requests

TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPES = "https://www.googleapis.com/auth/siteverification https://www.googleapis.com/auth/webmasters"
SV = "https://www.googleapis.com/siteVerification/v1"
SITE_URL = "https://jous.app/"
DOMAIN = "jous.app"


def load_env(path):
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def access_token():
    inline = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    creds = json.loads(inline) if inline else json.load(open(os.environ["GOOGLE_APPLICATION_CREDENTIALS"], encoding="utf-8"))
    now = int(time.time())
    assertion = jwt.encode(
        {"iss": creds["client_email"], "scope": SCOPES, "aud": TOKEN_URL, "iat": now, "exp": now + 3600},
        creds["private_key"],
        algorithm="RS256",
    )
    r = requests.post(TOKEN_URL, data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion}, timeout=30)
    r.raise_for_status()
    return r.json()["access_token"]


def site_body(method):
    if method == "DNS":
        return {"site": {"type": "INET_DOMAIN", "identifier": DOMAIN}, "verificationMethod": "DNS_TXT"}
    return {"site": {"type": "SITE", "identifier": SITE_URL}, "verificationMethod": "META"}


def resource_id(method):
    return DOMAIN if method == "DNS" else SITE_URL


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--env-file", default=".env")
    ap.add_argument("--token", choices=["META", "DNS"])
    ap.add_argument("--verify", choices=["META", "DNS"])
    ap.add_argument("--add-owner")
    ap.add_argument("--register", action="store_true")
    ap.add_argument("--list", action="store_true", help="list resources the SA has verified")
    a = ap.parse_args()
    load_env(a.env_file)
    h = {"Authorization": f"Bearer {access_token()}"}

    if a.token:
        r = requests.post(f"{SV}/token", headers=h, json=site_body(a.token), timeout=30)
        r.raise_for_status()
        print(r.json()["token"])
    if a.verify:
        body = site_body(a.verify)
        r = requests.post(f"{SV}/webResource", headers=h, params={"verificationMethod": body["verificationMethod"]}, json={"site": body["site"]}, timeout=60)
        print(r.status_code, r.text[:500])
        r.raise_for_status()
    if a.add_owner:
        rid = requests.utils.quote(resource_id("DNS" if a.verify == "DNS" else "META"), safe="")
        r = requests.get(f"{SV}/webResource/{rid}", headers=h, timeout=30)
        r.raise_for_status()
        res = r.json()
        owners = sorted(set(res.get("owners", []) + [a.add_owner]))
        r = requests.put(f"{SV}/webResource/{rid}", headers=h, json={"id": res["id"], "site": res["site"], "owners": owners}, timeout=30)
        print(r.status_code, r.text[:300])
        r.raise_for_status()
    if a.register:
        for prop in ("sc-domain:jous.app", SITE_URL):
            r = requests.put(f"https://www.googleapis.com/webmasters/v3/sites/{requests.utils.quote(prop, safe='')}", headers=h, timeout=30)
            print(f"sites.add {prop}: {r.status_code} {r.text[:200]}")
    if a.list:
        r = requests.get(f"{SV}/webResource", headers=h, timeout=30)
        print(r.status_code, json.dumps(r.json(), indent=2)[:800])
    return 0


if __name__ == "__main__":
    sys.exit(main())
