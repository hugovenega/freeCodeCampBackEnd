module.exports = (req, res) => {
  let timeStamp = req.params.date;
  if (timeStamp.match(/\d{5,}/)) {
    timeStamp = +timeStamp;
  }
  const date = new Date(timeStamp);
  if (date.toUTCString() === 'Invalid Date') {
    res.json({ error: 'Invalid Date' });
  }
  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
};
