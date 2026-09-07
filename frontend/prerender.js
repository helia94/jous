/*
 * Build-time pre-rendering for the SEO landing pages.
 *
 * Runs automatically after `npm run build` (see "postbuild" in package.json).
 * For every conversation-card page it renders the React component to static
 * HTML, injects the <Helmet> head tags, and writes build/<path>/index.html.
 * Flask (client_app.py) serves that file when it exists, so crawlers get the
 * full page text without executing JavaScript. The React bundle still loads
 * and takes over the page for real users.
 */
const fs = require("fs");
const path = require("path");

// babel-preset-react-app only emits CommonJS in the "test" env, which is what
// we need to `require()` the JSX source files from Node.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = process.env.NODE_ENV || "test";

require("ignore-styles").default([
  ".css", ".scss", ".sass", ".less",
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
  ".woff", ".woff2", ".ttf", ".eot",
]);

require("@babel/register")({
  presets: [require.resolve("babel-preset-react-app")],
  extensions: [".js", ".jsx"],
  ignore: [/node_modules/],
  cache: false,
});

// Minimal browser globals so components that touch them at render time don't crash.
global.localStorage = global.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.navigator = global.navigator || { userAgent: "node" };
global.window = global.window || {
  location: { href: "https://jous.app/", pathname: "/", search: "" },
  setTimeout,
  clearTimeout,
  localStorage: global.localStorage,
};

const React = require("react");
const { renderToString } = require("react-dom/server");
const { StaticRouter } = require("react-router-dom");
const { Helmet } = require("react-helmet");
Helmet.canUseDOM = false;

const ConversationCards = require("./src/components/ConversationCards.jsx").default;
const ConversationCardSpoke = require("./src/components/ConversationCardSpoke.jsx").default;
const QuestionList = require("./src/components/QuestionList.jsx").default;
const PrintableConversationCards = require("./src/components/PrintableConversationCards.jsx").default;
const { conversationCardSpokePages } = require("./src/components/conversationCardSeoPages.js");
const { localizedSeoPages } = require("./src/components/localizedSeoPages.js");
const { curatedLists } = require("./src/components/curatedLists.js");

const BUILD_DIR = path.join(__dirname, "build");
const template = fs.readFileSync(path.join(BUILD_DIR, "index.html"), "utf8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: build/index.html does not contain <div id="root"></div>');
}

// The SEO pages share a lazily-loaded CSS chunk; link it so the static HTML is styled before React boots.
const cssDir = path.join(BUILD_DIR, "static", "css");
const seoCssFiles = fs.existsSync(cssDir)
  ? fs.readdirSync(cssDir)
      .filter((f) => f.endsWith(".css"))
      .filter((f) => fs.readFileSync(path.join(cssDir, f), "utf8").includes(".conversation-cards-page"))
  : [];
const seoCssLinks = seoCssFiles.map((f) => `<link rel="stylesheet" href="/static/css/${f}">`).join("");

// Paths that App.jsx routes to a dedicated component instead of the generic spoke.
const dedicatedPages = {
  "/conversation-cards": ConversationCards,
  "/printable-conversation-cards": PrintableConversationCards,
};
const pages = [
  ...Object.entries(dedicatedPages).map(([routePath, Component]) => ({ routePath, Component })),
  ...Object.keys(conversationCardSpokePages)
    .filter((routePath) => !dedicatedPages[routePath])
    .map((routePath) => ({ routePath, Component: ConversationCardSpoke })),
  ...Object.keys(localizedSeoPages).map((routePath) => ({ routePath, Component: ConversationCardSpoke })),
  ...Object.keys(curatedLists).map((routePath) => ({ routePath, Component: QuestionList })),
];

let written = 0;
for (const { routePath, Component } of pages) {
  const markup = renderToString(
    React.createElement(
      StaticRouter,
      { location: routePath, context: {} },
      React.createElement(Component)
    )
  );
  const helmet = Helmet.renderStatic();
  const headTags = [
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    seoCssLinks,
  ].join("");

  const htmlAttrs = helmet.htmlAttributes.toString();
  let html = template
    .replace('<html lang="en">', htmlAttrs ? `<html ${htmlAttrs}>` : '<html lang="en">')
    .replace(/<title>.*?<\/title>/, helmet.title.toString())
    // Remove the generic default description so the page-specific one wins.
    .replace(/<meta name="description"[^>]*>/, "")
    .replace(/<link rel="canonical"[^>]*>/, "")
    .replace(/<meta property="og:[^"]*"[^>]*>/g, "")
    .replace("</head>", `${headTags}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  const outDir = path.join(BUILD_DIR, routePath.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  written += 1;
  console.log(`prerendered ${routePath} (${markup.length} bytes of markup)`);
}

console.log(`prerender: wrote ${written} pages`);
