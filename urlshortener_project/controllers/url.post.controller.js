const Url = require('../models/url');
const dns = require('dns');

module.exports = function urlPostController(req, res) {
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
}