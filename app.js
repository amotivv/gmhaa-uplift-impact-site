import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the .well-known folder
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Sitemap middleware
const sitemapMiddleware = (req, res) => {
  const sitemapStream = new SitemapStream({ hostname: 'https://gmhaa.org' });

  // List your website's URLs
  const urls = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/about/', changefreq: 'monthly', priority: 0.8 },
    { url: '/partners/', changefreq: 'monthly', priority: 0.8 },
    // Add more URLs as needed
  ];

  res.setHeader('Content-Type', 'application/xml');

  const readableStream = new Readable({
    read() {
      urls.forEach((url) => sitemapStream.write(url));
      sitemapStream.end();
    },
  });

  readableStream.pipe(sitemapStream).pipe(res);
};

app.get('/sitemap.xml', sitemapMiddleware);


app.get('/', async (req, res) => {
    const response = await fetch(
      'https://codegen.plasmic.app/api/v1/loader/html/published/' + process.env.PLASMIC_PROJECT_ID + '/Homepage?hydrate=1&embedHydrate=1&prepass=1',
      {
        headers: {
            'x-plasmic-api-project-tokens': process.env.PLASMIC_API_PROJECT_TOKENS,
          },          
      }
    );
  
    const result = await response.json();
  
    // Render the index.ejs template with the fetched HTML
    res.render('index', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN, googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID });
  });


  app.get('/about', async (req, res) => {
    const response = await fetch(
      'https://codegen.plasmic.app/api/v1/loader/html/published/' + process.env.PLASMIC_PROJECT_ID + '/About?hydrate=1&embedHydrate=1&prepass=1',
      {
        headers: {
            'x-plasmic-api-project-tokens': process.env.PLASMIC_API_PROJECT_TOKENS,
          },          
      }
    );
  
    const result = await response.json();
  
    // Render the index.ejs template with the fetched HTML
    res.render('partners', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN, googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID });
  });


  app.get('/partners', async (req, res) => {
    const response = await fetch(
      'https://codegen.plasmic.app/api/v1/loader/html/published/' + process.env.PLASMIC_PROJECT_ID + '/Partners?hydrate=1&embedHydrate=1&prepass=1',
      {
        headers: {
            'x-plasmic-api-project-tokens': process.env.PLASMIC_API_PROJECT_TOKENS,
          },          
      }
    );
  
    const result = await response.json();
  
    // Render the index.ejs template with the fetched HTML
    res.render('partners', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN, googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID });
  });
  

// 404 catch-all route
app.use(async (req, res) => {
    const response = await fetch(
      'https://codegen.plasmic.app/api/v1/loader/html/published/' + process.env.PLASMIC_PROJECT_ID + '/Error404?hydrate=1&embedHydrate=1&prepass=1',
      {
        headers: {
            'x-plasmic-api-project-tokens': process.env.PLASMIC_API_PROJECT_TOKENS,
          },          
      }
    );
  
    const result = await response.json();
  
    // Render the 404.ejs template with the fetched HTML and set the status code to 404
    res.status(404).render('404', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN, googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID });
  });
  
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
