import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

// Serve static files from the .well-known folder
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


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
    res.render('index', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN });
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
    res.render('partners', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN });
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
    res.render('partners', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN });
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
    res.status(404).render('404', { html: result.html, fundraiseUpToken: process.env.FUNDRAISEUP_TOKEN });
  });
  
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
