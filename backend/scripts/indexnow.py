#!/usr/bin/env python3
"""
Submit URLs to IndexNow (Bing, DuckDuckGo via Bing, Yandex, Naver, Seznam, Yep).

The key must be served at https://jous.app/<key>.txt (the file lives in frontend/public/).
Set INDEXNOW_KEY in the environment or .env, or pass --key.

  python backend/scripts/indexnow.py --sitemap https://jous.app/sitemap.xml   # every sitemap URL
  python backend/scripts/indexnow.py https://jous.app/conversation-cards ...    # specific URLs
"""
import argparse
import os
import re
import sys

import requests

ENDPOINT = "https://api.indexnow.org/indexnow"
HOST = "jous.app"


def load_env(path):
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def sitemap_urls(url):
    xml = requests.get(url, timeout=30).text
    return re.findall(r"<loc>(.*?)</loc>", xml)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("urls", nargs="*")
    ap.add_argument("--sitemap")
    ap.add_argument("--key")
    ap.add_argument("--env-file", default=".env")
    a = ap.parse_args()
    load_env(a.env_file)
    key = a.key or os.getenv("INDEXNOW_KEY")
    if not key:
        print("INDEXNOW_KEY missing", file=sys.stderr)
        return 1
    urls = list(a.urls)
    if a.sitemap:
        urls += sitemap_urls(a.sitemap)
    urls = [u for u in dict.fromkeys(urls) if u.startswith(f"https://{HOST}/")]
    if not urls:
        print("no URLs to submit", file=sys.stderr)
        return 1
    # confirm the key file is reachable before submitting
    probe = requests.get(f"https://{HOST}/{key}.txt", timeout=30)
    if probe.status_code != 200 or probe.text.strip() != key:
        print(f"key file not served correctly at https://{HOST}/{key}.txt (status {probe.status_code})", file=sys.stderr)
        return 1
    for i in range(0, len(urls), 10000):
        batch = urls[i : i + 10000]
        r = requests.post(
            ENDPOINT,
            json={"host": HOST, "key": key, "keyLocation": f"https://{HOST}/{key}.txt", "urlList": batch},
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=60,
        )
        print(f"submitted {len(batch)} URLs -> HTTP {r.status_code} {r.text[:200]}")
        if r.status_code not in (200, 202):
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
