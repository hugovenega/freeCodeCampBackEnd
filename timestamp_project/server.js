const express = require('express');
const createCorsMiddleware = require('cors');
const serverIndexController = require('./controllers/serverIndex.controller');
const dateEntryController = require('./controllers/dateEntry.controller');
const dateNowController = require('./controllers/dateNow.controller');

const corsMiddlewareOpts = { optionsSuccessStatus: 200 };
const app = express();

app.use(createCorsMiddleware(corsMiddlewareOpts));
app.use(express.static('public'));

app.get('/', serverIndexController);
app.get('/api/:date', dateEntryController);
app.get('/api', dateNowController);

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
