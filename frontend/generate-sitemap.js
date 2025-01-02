const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// List of paths in your app
const paths = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/home', changefreq: 'daily', priority: 0.8 },
    { url: '/random', changefreq: 'daily', priority: 0.6 },
];

const sitemapStream = new SitemapStream({ hostname: 'https://www.jous.app' });

streamToPromise(Readable.from(paths).pipe(sitemapStream)).then(sitemap => {
    fs.writeFileSync('public/sitemap.xml', sitemap.toString());
});
