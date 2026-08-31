"""
Server-side HTML for content that lives in the database (questions, blog posts).

The React app is a client-rendered SPA, so crawlers used to see an empty shell for
these URLs. Here we take the built index.html, replace the head tags and put real
content into <div id="root">. React still boots on top and takes over the page.
Everything is best-effort: callers fall back to the plain shell on any exception.
"""
import html
import logging
import re
import time
from os import path
from typing import Dict, List, Optional

SITE = "https://jous.app"
LANGS = ("de", "es", "fa")
RTL = {"fa"}
UNTRANSLATED = "Not avilable in the selected language"  # sic: matches question_service

log = logging.getLogger(__name__)
_template_cache: Dict[str, str] = {}


def _template(build_dir: str) -> str:
    if "html" not in _template_cache:
        with open(path.join(build_dir, "index.html"), encoding="utf-8") as fh:
            _template_cache["html"] = fh.read()
    return _template_cache["html"]


def _truncate(text: str, limit: int) -> str:
    text = " ".join(text.split())
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def render_shell(
    build_dir: str,
    *,
    title: str,
    description: str,
    canonical: str,
    body_html: str,
    lang: str = "en",
    alternates: Optional[Dict[str, str]] = None,
    jsonld: Optional[str] = None,
    og_type: str = "website",
) -> str:
    tpl = _template(build_dir)
    if '<div id="root"></div>' not in tpl:
        raise RuntimeError("index.html has no empty root div")

    head = [
        f"<title>{html.escape(title)}</title>",
        f'<meta name="description" content="{html.escape(description, quote=True)}"/>',
        f'<link rel="canonical" href="{html.escape(canonical, quote=True)}"/>',
        f'<meta property="og:title" content="{html.escape(title, quote=True)}"/>',
        f'<meta property="og:description" content="{html.escape(description, quote=True)}"/>',
        f'<meta property="og:type" content="{og_type}"/>',
        f'<meta property="og:url" content="{html.escape(canonical, quote=True)}"/>',
    ]
    for code, href in (alternates or {}).items():
        head.append(f'<link rel="alternate" hreflang="{code}" href="{html.escape(href, quote=True)}"/>')
    if alternates:
        head.append(f'<link rel="alternate" hreflang="x-default" href="{html.escape(alternates.get("en", canonical), quote=True)}"/>')
    if jsonld:
        head.append(f'<script type="application/ld+json">{jsonld}</script>')

    out = re.sub(r"<title>.*?</title>", "", tpl, count=1, flags=re.S)
    out = re.sub(r'<meta name="description"[^>]*>', "", out, count=1)
    out = re.sub(r'<link rel="canonical"[^>]*>', "", out, count=1)
    out = re.sub(r'<meta property="og:[^"]*"[^>]*>', "", out)
    dir_attr = ' dir="rtl"' if lang in RTL else ""
    out = out.replace('<html lang="en">', f'<html lang="{lang}"{dir_attr}>', 1)
    out = out.replace("</head>", "".join(head) + "</head>", 1)
    out = out.replace('<div id="root"></div>', f'<div id="root">{body_html}</div>', 1)
    return out


# ----------------------------------------------------------------------------- questions

def _question_body(q: dict, answers: List[dict], related: List[dict], lang: str) -> str:
    content = html.escape(q["content"])
    parts = [
        '<main class="seo-question" style="max-width:640px;margin:0 auto;padding:1rem">',
        '<p><a href="/conversation-cards">Conversation cards</a> › Card</p>',
        f"<h1>{content}</h1>",
        "<p>A random conversation card from Jous. Draw it with friends, on a date, with family, or with a stranger.</p>",
        '<p><a href="/random">Draw another random card</a> · <a href="/conversation-cards">All conversation cards</a></p>',
    ]
    if answers:
        parts.append(f"<h2>{len(answers)} public answer{'s' if len(answers) != 1 else ''}</h2><ul>")
        for a in answers:
            parts.append(f"<li>{html.escape(a.get('content') or '')} <small>— {html.escape(a.get('username') or 'anonymous')}</small></li>")
        parts.append("</ul>")
    if related:
        parts.append("<h2>More cards</h2><ul>")
        for r in related:
            rq = r.get("question", r)
            parts.append(f'<li><a href="/question/{rq["id"]}">{html.escape(rq["content"])}</a></li>')
        parts.append("</ul>")
    parts.append("</main>")
    return "".join(parts)


def question_page(build_dir: str, question_service, question_id: int, lang: Optional[str]) -> Optional[str]:
    """Return HTML for /question/<id> (optionally ?lang=de|es|fa) or None if it does not exist."""
    lang = (lang or "").lower()
    if lang and lang not in LANGS:
        lang = ""
    data = question_service.get_question_by_id(question_id)
    if not isinstance(data, dict) or "error" in data:
        return None
    q = data["question"]
    answers = data.get("answers") or []

    content = q["content"]
    page_lang = "en"
    if lang:
        tdata = question_service.get_question_by_id(question_id, language_id=lang)
        translated = tdata.get("question", {}).get("content") if isinstance(tdata, dict) else None
        if not translated or translated == UNTRANSLATED:
            return None
        content = translated
        page_lang = lang
    q = dict(q, content=content)

    try:
        rnd = question_service.get_random_questions(limit=6)
        related = [r for r in (rnd if isinstance(rnd, list) else []) if r.get("question", {}).get("id") != question_id][:5]
    except Exception:  # related cards are a nice-to-have
        related = []

    base = f"{SITE}/question/{question_id}"
    canonical = base if page_lang == "en" else f"{base}?lang={page_lang}"
    alternates = {"en": base}
    for code in LANGS:
        alternates[code] = f"{base}?lang={code}"
    n = len(answers)
    title = f"{_truncate(content, 70)} | Jous"
    description = _truncate(
        f"Conversation card: {content} {n} public answer{'s' if n != 1 else ''} on Jous, the free open-source random conversation card app. Draw another card or add your own question.",
        160,
    )
    jsonld = None
    if answers:
        import json

        jsonld = json.dumps(
            {
                "@context": "https://schema.org",
                "@type": "QAPage",
                "mainEntity": {
                    "@type": "Question",
                    "name": content,
                    "answerCount": n,
                    "suggestedAnswer": [
                        {"@type": "Answer", "text": a.get("content") or "", "author": {"@type": "Person", "name": a.get("username") or "anonymous"}}
                        for a in answers[:10]
                    ],
                },
            },
            ensure_ascii=False,
        )
    return render_shell(
        build_dir,
        title=title,
        description=description,
        canonical=canonical,
        body_html=_question_body(q, answers, related, page_lang),
        lang=page_lang,
        alternates=alternates,
        jsonld=jsonld,
    )


_sitemap_cache: Dict[str, object] = {"xml": None, "at": 0.0}


def questions_sitemap(question_model) -> str:
    """XML sitemap of every question page, cached for an hour."""
    if _sitemap_cache["xml"] and time.time() - float(_sitemap_cache["at"]) < 3600:
        return _sitemap_cache["xml"]  # type: ignore[return-value]
    rows = question_model.query.with_entities(question_model.id, question_model.time).order_by(question_model.id).all()
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for qid, when in rows:
        lastmod = f"<lastmod>{when.date().isoformat()}</lastmod>" if when else ""
        out.append(f"<url><loc>{SITE}/question/{qid}</loc>{lastmod}<changefreq>monthly</changefreq><priority>0.4</priority></url>")
    out.append("</urlset>")
    xml = "\n".join(out)
    _sitemap_cache.update(xml=xml, at=time.time())
    return xml


# ----------------------------------------------------------------------------- blog

def _extract(pattern: str, doc: str) -> Optional[str]:
    m = re.search(pattern, doc, flags=re.S | re.I)
    return html.unescape(m.group(1)).strip() if m else None


def blog_page(build_dir: str, blog_service, url: str, fallback_title: Optional[str] = None) -> Optional[str]:
    """Return HTML for /blog/<url> or None if the post does not exist."""
    data = blog_service.get_blog_by_url(url)
    if isinstance(data, tuple):  # (error dict, status)
        data = data[0]
    if not isinstance(data, dict) or "error" in data or not data.get("html_content"):
        return None
    doc = data["html_content"]
    title = _extract(r"<title[^>]*>(.*?)</title>", doc) or _extract(r'<meta name="title" content="(.*?)"', doc) or fallback_title or url.replace("-", " ").title()
    description = _extract(r'<meta name="description" content="(.*?)"', doc) or _truncate(re.sub(r"<[^>]+>", " ", doc), 160)
    body = _extract(r"<body[^>]*>(.*?)</body>", doc)
    if body is None:
        body = re.sub(r"<head>.*?</head>", "", doc, flags=re.S | re.I)
    body = re.sub(r"<script.*?</script>", "", body, flags=re.S | re.I)
    canonical = f"{SITE}/blog/{url}"
    import json

    jsonld = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "mainEntityOfPage": canonical,
            "publisher": {"@type": "Organization", "name": "Jous", "url": SITE},
        },
        ensure_ascii=False,
    )
    body_html = (
        '<main class="seo-blog" style="max-width:720px;margin:0 auto;padding:1rem">'
        '<p><a href="/blog">Blog</a> › Article</p>'
        f"{body}"
        '<p><a href="/conversation-cards">Try the conversation cards</a> · <a href="/random">Draw a random question</a></p>'
        "</main>"
    )
    return render_shell(
        build_dir,
        title=f"{title} | Jous",
        description=description,
        canonical=canonical,
        body_html=body_html,
        jsonld=jsonld,
        og_type="article",
    )
