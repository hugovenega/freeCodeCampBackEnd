const express = require('express');
const dotEnv = require('dotenv');
const multer = require('multer');
const createCorsMiddleware = require('cors');
const serverIndexController = require('./controllers/serverIndex.controller');
const fileAnalyseController = require('./controllers/fileanalyse.controller');

const app = express();
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };
dotEnv.config();

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(createCorsMiddleware(corsMiddlewareOpts));

app.get('/', serverIndexController);

app.post('/api/fileanalyse', multer().single('upfile'), fileAnalyseController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
