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
