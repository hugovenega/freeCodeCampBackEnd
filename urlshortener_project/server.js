
const port = 3000;

//all necesary requires
const express = require('express');
require('dotenv').config();
const dns = require('dns');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoose = require('mongoose');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));



//server config
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
});
//URL object config
const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true,
    default: 0
  }
});
const Url = mongoose.model('Url', urlSchema);


app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.use('/public',express.static(__dirname + '/public'));






app.listen(port);
console.log(`listening on port ${port}`);
