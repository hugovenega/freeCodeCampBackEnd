const Url = require('../models/url');

module.exports = function urlGetController(req, res) {
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
}