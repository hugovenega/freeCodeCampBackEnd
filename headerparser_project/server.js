require('dotenv').config();
const express = require('express');
const createCorsMiddleware = require('cors');

const app = express();
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };

app.use(createCorsMiddleware(corsMiddlewareOpts));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});
app.get('/api/whoami', (req, res) => {
  res.json({ ipaddress: req.connection.remoteAddress, language: req.headers['accept-language'], software: req.headers['user-agent'] });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
