const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;