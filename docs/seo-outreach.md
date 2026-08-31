# Off-site SEO: outreach kit

Goal: links and mentions from places whose audience already buys/uses conversation-card decks or
likes free open-source tools. Everything here is drafted so that posting is a copy-paste.

Legend — who presses "post":
- **[Claude]** Claude can do it directly (own repo / API / no account needed).
- **[Claude, with your OK]** Claude can do it through your logged-in browser (Chrome extension), but
  each public post needs a one-word go-ahead from you first.
- **[You]** needs an account you own, or a login — Claude never handles passwords.

## Done [Claude]
- GitHub repo: homepage → https://jous.app/conversation-cards, description, topics
  (`conversation-cards`, `conversation-starters`, `icebreakers`, …), README rewritten with deep links.

## Ruled out by the owner (2026-08-31)
Product Hunt (launched twice, no measurable effect) and Reddit (account blocked repeatedly). Do not retry.
Show HN is untested but is account-gated and a lottery; low priority.

## Tier 1 — Claude can execute alone

1. **IndexNow** (Bing, DuckDuckGo via Bing, Yandex, Naver, Seznam) — key served at
   `https://jous.app/615228870f61f6b6892de92d84f56b1a.txt`; `backend/scripts/indexnow.py --sitemap …`.
   Re-run after every content change. Bing Webmaster Tools already has an account (bookmark from 2024) —
   the owner can "Import from Google Search Console" there in one click for Bing reporting.
2. **Open-source directories that work from GitHub, no separate account**
   - awesome-selfhosted (PR) — BLOCKED until a LICENSE file exists (owner decision; MIT recommended).
   - awesome-opensource-apps / opensource.builders (PR) — same license requirement usually.
   - LibHunt / Awesome Open Source index GitHub automatically once the repo has topics + README (done).
3. **Localized landing pages** (`/de/gespraechskarten`, `/de/zufaellige-fragen`, `/es/cartas-de-conversacion`,
   `/es/preguntas-para-conversar`, `/fa/conversation-cards`, `/fa/random-questions`) — competitors in those
   languages are physical decks only; Persian has almost no competition. Built 2026-08-31.
4. **Question pages as long-tail** — every question (`/question/<id>`, ~3,000) server-rendered with the
   question text as title, hreflang'd translations, and `/sitemap-questions.xml`. Built 2026-08-31.
5. **Blog posts server-rendered** (460 URLs) — built 2026-08-31.
6. **Open dataset asset** — `/open-source-card-dataset` exists; a downloadable JSON/CSV export would make
   it linkable from "datasets" lists (GitHub `awesome-public-datasets`, Kaggle needs an account).

## Tier 2 — needs a one-word OK from the owner (Claude does the work)

- **Links from owned domains**: heliajamshidi.me (personal site, same Railway project) and ctrlalt.date.
  A "projects" mention with a link to https://jous.app/conversation-cards. Say "yes" and Claude edits/deploys.
- **Embeddable widget**: `<iframe src="https://jous.app/embed/random">` (to build) that bloggers who write
  "100 questions to ask…" listicles can drop in; each embed is a link. Needs an outreach email per blog.
- **Blogger/facilitator pitch emails** (Gmail connector available; each send needs the owner's explicit OK).
  Targets: teacher icebreaker resource pages, board-game review blogs that cover TableTopics/WNRS,
  German "Gesprächskarten" review posts (simonjan.de / sondermoment.com are the incumbents).

## Tier 3 — owner-only

- AlternativeTo listing (needs an account): list Jous as alternative to TableTopics, We're Not Really
  Strangers, Let's Get Deep, Gottman Card Decks app, Vertellis, Party Qs, Big Talk.
- Pinterest: printable set pins ("conversation starter cards printable") — Pinterest is a search engine
  for printables; needs an account and a few pins.

## Tracking
Backlinks earned go into `docs/seo-reports/<date>.md` under "Backlinks" (by hand or ask Claude).
