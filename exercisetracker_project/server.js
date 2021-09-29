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
