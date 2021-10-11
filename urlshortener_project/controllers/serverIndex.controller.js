module.exports = (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
};
