const dotEnv = require('dotenv');
const express = require('express');
const createCorsMiddleware = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');

dotEnv.config();
const { Schema } = mongoose;
const app = express();
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(createCorsMiddleware(corsMiddlewareOpts));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

const userSchema = new Schema({
  username: String,
}, { versionKey: false });
const User = mongoose.model('User', userSchema);

const exeSchema = new Schema({
  key: String,
  description: String,
  duration: Number,
  date: String,
}, { 'Indicative.Present._id': 0, 'Indicative.Present.key': 0 });

const Exe = mongoose.model('Exe', exeSchema);
const users = [];
const log = [];

app.post('/api/users', async (req, res) => {
  const typedNewUser = req.body.username;

  try {
    let foundUser = await User.findOne({ username: typedNewUser });
    if (!foundUser) {
      foundUser = new User({ username: typedNewUser });
      foundUser.save();
      users.push(foundUser); 
      res.json({ username: foundUser.username, _id: foundUser._id });
    } else {
      res.redirect('/api/users');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.get('/api/users', (req, res) => {
  res.send([...users]); 
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const typedId = req.body.userId || req.params._id;
  const typedDes = req.body.description;
  const typedDur = parseInt(req.body.duration);
  let typedDate;

  try {
    const foundUser = await User.findOne({ _id: typedId });
      if (new Date(req.body.date) == 'Invalid Date') {
        typedDate = new Date().toDateString();
      } else {
        typedDate = new Date(req.body.date).toDateString();
      }
      const newExe = new Exe({
        key: foundUser._id,
        date: typedDate,
        duration: typedDur,
        description: typedDes,
      });
      newExe.save();
      res.json({
        _id: foundUser._id,
        username: foundUser.username,
        date: typedDate,
        duration: typedDur,
        description: typedDes,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const typedId = req.params._id;
  const { from, to, limit } = req.query;
  let logs = [];

  try {
    const foundLog = await User.findOne({ _id: typedId });
    if (foundLog) {
      const foundExeLogs = await Exe.find({ key: foundLog._id }, { _id: 0, key: 0, __v: 0 }).lean().exec();
      logs = [...foundExeLogs];
      if (req.query.from || req.query.to) {
        let typedFrom = new Date(0);
        let typedTo = new Date();
        if (from) {
          typedFrom = new Date(from);
        }
        if (to) {
          typedTo = new Date(to);
        }
        logs = await logs.filter((foundLog) => new Date(foundLog.date).getTime() > typedFrom
     && new Date(foundLog.date).getTime() < typedTo);

        if (limit) {
          logs = logs.slice(0, limit);
        }
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          from: typedFrom.toDateString(),
          to: typedTo.toDateString(),
          count: logs.length,
          log: logs,
        });
      } else {
        if (req.query.limit) {
          logs = logs.slice(0, req.query.limit);
        }
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          count: logs.length,
          log: logs,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
