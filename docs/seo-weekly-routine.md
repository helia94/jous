# Weekly SEO routine (Claude Code cloud routine)

Status: **created 2026-08-31**; end-to-end test same day: fetch->report->commit->GitHub-API-push all work, but the cloud sandbox egress proxy REFUSES connections to jous.app (connect_rejected, org policy) so the data fetch fails. Direct googleapis.com calls are likely blocked by the same allowlist (unverified). FIXED 2026-08-31 evening: owner set the environment's Network access to Custom with jous.app allowed; a 500 from 19 sequential URL inspections exceeding the 30s gunicorn timeout was fixed by parallelizing inspections + a 300s /api/seo route timeout. Run 4 (16:10 UTC) succeeded end-to-end: fetch -> report -> GitHub-API push (commit 6e35eba). Known non-issues for early reports: analytics rows stay empty until ~2 days after the property was created; URL Inspection 'unknown to Google' vs 'Discovered' fluctuates; 'Request Indexing' is UI-only, use sitemap resubmit + IndexNow instead. Also note: in the sandbox `git push` gets HTTP 403 — push via the GitHub MCP `push_files` tool. — id `trig_01PC4BQ264knL7SwEkTcE791`, https://claude.ai/code/routines/trig_01PC4BQ264knL7SwEkTcE791 . Originally the API refused with
"Connect your GitHub account before saving a routine that uses a GitHub repository".
Prerequisites for the owner: (1) install the Claude GitHub App on helia94/jous via
https://claude.ai/code/onboarding?magic=github-app-setup ; (2) add the env var
`GOOGLE_SERVICE_ACCOUNT_JSON` (contents of ~/.config/jous/google-search-console.json)
to the "Default" cloud environment (env_01DNwxZ61QYXv9JMZp9Z8Wdu).

Then create it with the RemoteTrigger tool (`action: create`) using:

- name: `Jous weekly SEO check`
- cron: `0 5 * * 1` (Mondays 05:00 UTC = 07:00 Europe/Berlin)
- model: `claude-sonnet-5`, source repo `https://github.com/helia94/jous`
- allowed tools: Bash, Read, Write, Edit, Glob, Grep

Prompt (self-contained; the cloud agent starts with zero context):

```
You are the weekly SEO monitor for https://jous.app (repo helia94/jous, a free open-source random
conversation-card app). Your job: pull Google Search Console data, compare with last week's report,
write a new report file, and push it. You must not change application code, deploy anything, or ask
questions — the owner does not want to be involved.

SETUP
1. `pip install PyJWT cryptography requests` (only these; do not install the full requirements).
2. Credentials come from the environment variable GOOGLE_SERVICE_ACCOUNT_JSON (service-account key
   JSON as a string). The scripts read it automatically. If it is missing or auth fails, write
   docs/seo-reports/<today>.md stating exactly that (with the error text), commit, push, and stop.
3. Scripts (run with python3, add `--env-file /dev/null`):
   - backend/scripts/search_console_report.py --site-url <PROPERTY> --start-date A --end-date B
     --query-contains "" --row-limit 100 --min-impressions 1 --json
   - backend/scripts/search_console_report.py --site-url <PROPERTY> --list-sites
   - backend/scripts/search_console_report.py --site-url <PROPERTY> --inspect URL [--inspect URL ...] --json
   Property: run --list-sites first. Use sc-domain:jous.app if the permission there is not
   siteUnverifiedUser, otherwise use https://jous.app/ .

DATA TO COLLECT (Search Console data lags ~3 days, so end-date = today minus 3)
- Search analytics for the last 7 days and the last 28 days: queries (clicks, impressions, CTR,
  position) and pages. Also a run with --query-contains "conversation" for the 28-day window.
- URL Inspection for: https://jous.app/ , /conversation-cards , /online-conversation-cards ,
  /random-conversation-cards , /open-source-conversation-cards , /free-conversation-cards ,
  /conversation-cards-for-friends , /conversation-cards-for-couples , /conversation-cards-for-date-night ,
  /weird-conversation-cards , /non-cringe-conversation-starters , /printable-conversation-cards ,
  /open-source-card-dataset , /blog , /blog/art-of-small-talk (all on https://jous.app). One URL per
  call if a batch fails; on 429 wait and continue; note any URL you could not inspect.
- Read the most recent file in docs/seo-reports/ (sorted by name) as last week's baseline.

REPORT — write docs/seo-reports/<YYYY-MM-DD>.md (today, UTC) with:
1. Headline numbers: clicks / impressions / avg position for 7d and 28d, with change vs previous report.
2. Index status table for every inspected URL (verdict, coverage, last crawl, Google canonical) with a
   "changed since last report" column.
3. Top queries (28d) and top pages (28d).
4. Queries containing "conversation" (28d).
5. Pages with impressions >= 20 and CTR <= 2% or position >= 10 (opportunities).
6. "What changed since last week" — 3 to 6 plain sentences.
7. "Recommended next actions" — at most 3 concrete actions, each with the data point that justifies it.
Factual only; if something could not be fetched, say so. Do not edit any other file.

FINISH: git add the report, commit "Weekly SEO report <date>", push to master. Final message = the
headline numbers and the recommended actions.
```
