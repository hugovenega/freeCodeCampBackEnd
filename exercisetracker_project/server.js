require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

const userSchema = new Schema({
  username: String,

}, { versionKey: false }); // HIDE VERSION KEY

const User = mongoose.model('User', userSchema);
// --------------------------------------

// DEFINING SCHEMA & MODEL FOR EXERCISE
const exeSchema = new Schema({
  key: String,
  description: String,
  duration: Number,
  date: String,
  // HIDE ID AND PROPERTY "KEY"
}, { 'Indicative.Present._id': 0, 'Indicative.Present.key': 0 });

const Exe = mongoose.model('Exe', exeSchema);

// CREATING AN EMPTY ARRAYS TO STORE PUSH USERS & EXERCISES LATER
const users = [];
const log = [];

app.post('/api/users', async (req, res) => {
  // GET WHAT IS TYPED IN USERNAME INPUT
  const typedNewUser = req.body.username;

  try {
    // CHECK FOR EXISTING USER
    let foundUser = await User.findOne({ username: typedNewUser });
    if (!foundUser) { // NO USER => CREATE NEW
      foundUser = new User({ username: typedNewUser });
      foundUser.save();
      users.push(foundUser); // PUSH FOUND USER IN USERS ARRAY
      res.json({ username: foundUser.username, _id: foundUser._id });
    } else { // YES => REDIRECT TO /API/USERS
      res.redirect('/api/users');
    }
    // CHECK FOR ERRORS
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.get('/api/users', (req, res) => {
  res.send([...users]); // SEND ARRAY WITH USERS ARRAY
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  // TYPEDID SHOULD BE = TO WHAT IS TYPED IN URL OR USER ID
  const typedId = req.body.userId || req.params._id;
  // GET WHAT TYPED IN DESCRIPTION FIELD
  const typedDes = req.body.description;
  // GET WHAT TYPED IN DURATION FIELD
  const typedDur = parseInt(req.body.duration);
  // CREATE A VAR TYPEDDATE TO STORE DATE LATER
  let typedDate;

  try {
    // CHECK FOR EXISTING USER WITH ID MATCHING TYPEDID
    const foundUser = await User.findOne({ _id: typedId });
    if (foundUser) { // YES => IF THE DATE WAS TYPED
      if (new Date(req.body.date) == 'Invalid Date') {
        // NO, SET TYPEDDATE TO TODAYS DATE
        typedDate = new Date().toDateString();
      } else {
      // YES, STORE THAT DATE IN TYPEDDATE
        typedDate = new Date(req.body.date).toDateString();
      }
      // --------------------------------------

      // CREATE NEW EXERCISE & SAVE
      const newExe = new Exe({
        key: foundUser._id,
        date: typedDate,
        duration: typedDur,
        description: typedDes,
      });
      newExe.save();
      // --------------------------------------

      // SEND RESPONCE
      res.json({
        _id: foundUser._id,
        username: foundUser.username,
        date: typedDate,
        duration: typedDur,
        description: typedDes,
      });
    }
    // --------------------------------------

    // CHECK FOR ERRORS
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  // GET WHTS TYPED IN URL INSTEAD OF _ID
  const typedId = req.params._id;
  // GET QUERYIES AND ASSIGHN THEM TO FROM,TO,LIMIT
  const { from, to, limit } = req.query;
  // CREATE AN LOG ERRAY TO STORE VALUE LATER
  let logs = [];

  try {
    // CHECK FOR USER WITH MATCHING ID
    const foundLog = await User.findOne({ _id: typedId });
    if (foundLog) {
      // IF FOUND PUSH ALL HIS EXERCISES TO LOGS ARRAY
      const foundExeLogs = await Exe.find({ key: foundLog._id }, { _id: 0, key: 0, __v: 0 }).lean().exec();
      logs = [...foundExeLogs];
      // --------------------------------------

      // CHECK IF FROM OR TO TYPED AFTER LOGS IN URL AND IF YES
      if (req.query.from || req.query.to) {
        // CREATE 2 DATES
        let typedFrom = new Date(0); // INITIAL DATE
        let typedTo = new Date(); // FINISH DATE

        // IF FROM TYPED ASSIGN NEW WALUE OF WHAT TYPED IN URL TO typedFrom
        if (from) {
          typedFrom = new Date(from);

          // IF TO TYPED ASSIGN NEW WALUE OF WHAT TYPED IN URL TO typedTo
        }
        if (to) {
          typedTo = new Date(to);
        }
        // MODIFY LOGS ACCORDING TO NEW DATE'S FILTER
        logs = await logs.filter((foundLog) => new Date(foundLog.date).getTime() > typedFrom
     && new Date(foundLog.date).getTime() < typedTo);

        // IF LIMIT IS TYPED, CROP THE ARRAY
        if (limit) {
          logs = logs.slice(0, limit);
        }

        // SEND RESPONSE
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          from: typedFrom.toDateString(),
          to: typedTo.toDateString(),
          count: logs.length,
          log: logs,
        });
        // --------------------------------------
      } else {
        // IF BOTH FROM AND TO WAS NOT TYPED

        // IF LIMIT IS TYPED, CROP THE ARRAY
        if (req.query.limit) {
          logs = logs.slice(0, req.query.limit);
        }
        // --------------------------------------

        // SEND RESPONSE
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          count: logs.length,
          log: logs,
        });
      }
      // --------------------------------------
    }

    // CHECK FOR ERRORS
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});
