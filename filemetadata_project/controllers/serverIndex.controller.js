module.exports = (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
};
