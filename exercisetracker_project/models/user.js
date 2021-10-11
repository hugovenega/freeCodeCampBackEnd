const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  username: String,
}, { versionKey: false });
const User = mongoose.model('User', userSchema);

module.exports = User;
