const mongoose = require('mongoose');

const { Schema } = mongoose;

const exeSchema = new Schema({
  key: String,
  description: String,
  duration: Number,
  date: String,
}, { 'Indicative.Present._id': 0, 'Indicative.Present.key': 0 });

const Exercise = mongoose.model('Exe', exeSchema);

module.exports = Exercise;
