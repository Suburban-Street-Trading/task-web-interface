const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');

const app = express();
const port = 3008;

const shopifyApiKey = '1374ae7e7447ddb45210a79b4c2a1e35';
const shopifyApiSecret = '5cfa89d677a70d205677ed5f9ef35ad1';
const shopifyApiPassWithToken = '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';
const shopifyStoreName = '2fe1b7-95.myshopify.com';

const shopifyBaseUrl = `https://${shopifyApiKey}:${shopifyApiSecret}@${shopifyStoreName}/admin/api/2022-01`;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const fetchWithAgent = (url, options) => {
  return fetch(url, { ...options, agent });
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const response = await fetchWithAgent(`${shopifyBaseUrl}/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order: orderData }),
    });

    if (response.ok) {
      const createdOrder = await response.json();
      res.json(createdOrder);
    } else {
      console.error('Failed to create order');
      res.sendStatus(500);
    }
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
