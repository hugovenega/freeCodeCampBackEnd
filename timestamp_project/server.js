const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/api/:date', (req, res) => {
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
});

app.get('/api', (req, res) => {
  const date = new Date();
  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
