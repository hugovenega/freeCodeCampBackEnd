const express = require('express');
const dotEnv = require('dotenv');
const dns = require('dns');
const createCorsMiddleware = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };
const urlencodedOpts = { extended: true };
dotEnv.config();

app.use(createCorsMiddleware(corsMiddlewareOpts));
app.use(express.urlencoded(urlencodedOpts));
app.use(express.json());
app.use('/public', express.static(`${__dirname}/public`));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});
const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    required: true,
    default: 0,
  },
});
const Url = mongoose.model('Url', urlSchema);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});
app.post('/api/shorturl', (req, res) => {
  const urlRequest = req.body.url;
  const hostname = urlRequest
    .replace(/http[s]?\:\/\//, '')
    .replace(/\/(.+)?/, '');
  dns.lookup(hostname, (lookupErr, addresses) => {
    if (lookupErr) {
      console.log('lookup() error');
    }
    if (!addresses) {
      res.json({
        error: 'invalid URL',
      });
    } else {
      Url.findOne({
        original_url: urlRequest,
      }, (findOneErr, urlFound) => {
        if (findOneErr) {
          console.log('findOne() error');
        }
        if (!urlFound) {
          Url.estimatedDocumentCount((countErr, count) => {
            if (countErr) {
              res.send('estimatedDocumentCount() error');
            }
            const url = new Url({
              original_url: urlRequest,
              short_url: count + 1,
            });
            url.save((saveErr, urlSaved) => {
              if (saveErr) {
                res.send('save() error');
              }
              res.json({
                original_url: urlSaved.original_url,
                short_url: urlSaved.short_url,
              });
            });
          });
        } else {
          res.json({
            original_url: urlFound.original_url,
            short_url: urlFound.short_url,
          });
        }
      });
    }
  });
});
app.get('/api/shorturl/:shorturl', (req, res) => {
  const { shorturl } = req.params;
  Url.findOne({
    short_url: shorturl,
  }, (err, urlFound) => {
    if (err) {
      console.log('findOne() error');
    }
    if (!urlFound) {
      res.json({
        error: 'No short URL found for the given input',
      });
    } else {
      res.redirect(urlFound.original_url);
    }
  });
});

app.listen(port);
console.log(`listening on port ${port}`);
