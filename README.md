# Jous — open-source random conversation cards

**[jous.app](https://jous.app/conversation-cards)** · free forever · no signup · anyone can add a question

Jous is a conversation-card app that is *not* a self-help kit. You draw a random card and get a question that might be dumb, weird, casual, or uncomfortably deep — that mix is the point. The question set has 1,500+ prompts in English, German, Spanish and Persian, and it grows from real submissions.

- **Draw a card:** https://jous.app/random
- **Conversation cards hub:** https://jous.app/conversation-cards
- **Use cases:** [friends](https://jous.app/conversation-cards-for-friends) · [couples](https://jous.app/conversation-cards-for-couples) · [date night](https://jous.app/conversation-cards-for-date-night) · [weird](https://jous.app/weird-conversation-cards) · [non-cringe starters](https://jous.app/non-cringe-conversation-starters)
- **Printable set:** https://jous.app/printable-conversation-cards
- **Open dataset:** https://jous.app/open-source-card-dataset

## Why another conversation-card thing?

Most decks and apps in this category sell polished emotional homework: "deepen your connection", "transform your relationship". Jous is the opposite bet — a large, open, random pile of questions with no script. Some cards are dumb. Some are deep. Nobody sees the next one coming.

## Features

- Random question draw with filters (occasion, depth, language)
- Add your own questions; answer publicly or anonymously
- Like questions, user pages, question detail pages
- Groups: make a group, post questions to it
- Blog with 400+ articles on conversation and connection
- Bots: Telegram, Slack and Twitter integrations (`bots/`, `telegram/`, `slack/`, `twitter/`)

## Stack

Flask + PostgreSQL + Celery/Redis backend, React (CRA) frontend served by Flask, deployed on Railway. SEO landing pages are pre-rendered at build time (`frontend/prerender.js`).

## Run locally

Backend:

```shell
docker-compose up
```

Frontend (new terminal):

```shell
cd frontend
set NODE_OPTIONS=--openssl-legacy-provider
npm install
npm start
```

Run it the way production does (Flask serves the built frontend):

```shell
cd frontend
npm ci
npm run build      # also pre-renders the SEO pages
cd ..
python wsgi.py
```

## Contributing

The easiest contribution is a good question — add it in the app. Code contributions: open an issue or a PR. The SEO strategy and reports live in `docs/`.

## License

See the repository license file. The question set is open: use it, fork it, argue with it.
