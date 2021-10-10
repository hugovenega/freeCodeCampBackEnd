const express = require('express');
const dotEnv = require('dotenv');
const multer = require('multer');
const createCorsMiddleware = require('cors');

const app = express();
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };
dotEnv.config();

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(createCorsMiddleware(corsMiddlewareOpts));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.post('/api/fileanalyse', multer().single('upfile'), (req, res) => {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
