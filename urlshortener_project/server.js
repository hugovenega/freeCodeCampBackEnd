require('dotenv').config();
const express = require('express');
const createCorsMiddleware = require('cors');
const urlPostController = require('./controllers/url.post.controller');
const urlGetController = require('./controllers/url.get.controller');

const app = express();
const port = 3000;
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };
const urlencodedOpts = { extended: true };

app.use(createCorsMiddleware(corsMiddlewareOpts));
app.use(express.urlencoded(urlencodedOpts));
app.use(express.json());
app.use('/public', express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});
app.post('/api/shorturl', urlPostController);
app.get('/api/shorturl/:shorturl', urlGetController);

app.listen(port);
console.log(`listening on port ${port}`);
