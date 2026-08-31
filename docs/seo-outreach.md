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

## Tier 1 — highest expected value

### 1. Show HN (news.ycombinator.com) [You, or Claude with your OK if you are logged in]
Title: `Show HN: Jous – open-source random conversation cards, 1,500+ questions, no signup`
Text:
> I got tired of conversation-card decks that feel like therapy homework, so I built an open one. You draw a random card; some are dumb, some are deep, nobody sees the next one. 1,500+ questions in EN/DE/ES/FA, anyone can add one, no account needed. Flask + React, source on GitHub. Would love feedback on the question quality more than the code.
URL: https://jous.app/conversation-cards
Best time: Tue–Thu, 14:00–16:00 UTC.

### 2. Product Hunt [You — needs a maker account]
Name: Jous · Tagline: `Random conversation cards that are not cringe` · Topics: Social, Open Source, Games
Description: see Show HN text. First comment from the maker: why "random" and "open" are the features.

### 3. Reddit [Claude, with your OK — if you are logged in; otherwise You]
Communities and angles (read each sub's self-promo rule first; r/SideProject and r/InternetIsBeautiful allow it):
- r/InternetIsBeautiful — title: `A free site that gives you one random conversation question at a time (1,500+, open source)`
- r/SideProject — title: `I made an open-source alternative to conversation-card decks. Roast the questions.`
- r/opensource — title: `Jous: open-source conversation cards (Flask/React), anyone can add questions`
- r/socialskills and r/dating_advice — do NOT post links; only answer threads asking for "questions to ask" with 3–4 actual cards and mention the site once if asked.

### 4. Awesome lists (GitHub PRs) [Claude — PRs are code contributions, no account issue]
- awesome-selfhosted (category: "Games / Miscellaneous" or "Communication - Social Networks") — needs a LICENSE file and a docker-compose (present).
- awesome-opensource-apps / awesome-free-software style lists.
Line: `- [Jous](https://jous.app/) - Open-source random conversation cards; 1,500+ questions, anyone can add one. ([Source Code](https://github.com/helia94/jous)) \`MIT\` \`Python/Docker\``

### 5. AlternativeTo.net [You — account needed]
List Jous as an alternative to: TableTopics, "We're Not Really Strangers", "Let's Get Deep", Gottman Card Decks app, Vertellis. Category: Games / Social. This is where deck-buyers search.

## Tier 2 — steady links

- Directories for free tools: free-for.dev (no fit), `awesome-privacy`(no), **toolsfor.dev**-style lists (low value). Skip unless cheap.
- Indie newsletters that cover open-source consumer apps: Console.dev (submit form) [Claude, with your OK], Changelog News (email) [You].
- Facilitator/teacher resource blogs ("icebreaker questions for class"): pitch the printable set, https://jous.app/printable-conversation-cards . Draft pitch below.
- Board-game / party-game blogs that review conversation decks: pitch "free online alternative" comparison.

Pitch email (for blogs) [You send; Claude drafts per site]:
> Subject: a free, open alternative to conversation-card decks (for your "<article>" post)
> Hi <name>, your post on <article> lists <deck>. If you want a free option for readers: Jous (jous.app) is an open-source random conversation-card app with 1,500+ questions, no signup, and a printable set. It is deliberately not a self-help deck — some cards are silly, some are deep. Happy to make a custom printable for your readers if useful. — Helia

## Tracking
Every link earned goes into `docs/seo-reports/<date>.md` under "Backlinks"; the weekly routine reads Search Console, not backlinks, so add them by hand (or ask Claude to).
