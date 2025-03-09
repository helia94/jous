import DatabaseBlogData from './src/components/DatabaseBlogData.js';
import fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

// List of paths in your app
const blogPaths = DatabaseBlogData.map((post) => ({
    url: `/blog/${post.URL}`,
    changefreq: 'daily',
    priority: 0.3,
    lastmod: new Date().toISOString(),
  }));

const paths = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/home', changefreq: 'daily', priority: 0.8 },
    { url: '/home?lang=fa', changefreq: 'daily', priority: 0.8 },
    { url: '/home/?lang=de', changefreq: 'daily', priority: 0.8 },
    { url: '/random', changefreq: 'daily', priority: 0.6 },
    { url: '/blog', changefreq: 'daily', priority: 0.6 },
    { url: '/more-blogs', changefreq: 'daily', priority: 0.6 },
    { url: '/random', changefreq: 'daily', priority: 0.6 },
];

const allPaths = paths.concat(blogPaths);

const sitemapStream = new SitemapStream({ hostname: 'https://www.jous.app' });

streamToPromise(Readable.from(allPaths).pipe(sitemapStream)).then((sitemap) => {
    fs.writeFileSync('public/sitemap.xml', sitemap.toString());
});