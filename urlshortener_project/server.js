
const port = 3000;

//all necesary requires
const express = require('express');
require('dotenv').config();
const dns = require('dns');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();
app.use(cors({optionsSuccessStatus: 200}))
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

app.post('/api/shorturl', (req, res) => {
  // save url from input
    const urlRequest = req.body.url;
  // leave only the hostname  www.example.com
    const hostname = urlRequest
      .replace(/http[s]?\:\/\//, '')
      .replace(/\/(.+)?/, '');
      //does the host exist?
    dns.lookup(hostname, (lookupErr, addresses) => {
      if (lookupErr) {
        console.log('lookup() error');
      }
      if (!addresses) {
        res.json({
          error: 'invalid URL'
        });
      } else {
  
        //if the url it exists it searches the database if it is already entered
        Url.findOne({
          original_url: urlRequest
        }, (findOneErr, urlFound) => {
          if (findOneErr) {
            console.log('findOne() error');
          }
          // if you can't find the url, register it in the database
          //count how many documents are stored in the database
          if (!urlFound) {
            Url.estimatedDocumentCount((countErr, count) => {
              if (countErr) {
                res.send('estimatedDocumentCount() error');
              }
              // ccreate the new document and the short_url assigns it a number according to the one that corresponds
              const url = new Url({
                original_url: urlRequest,
                short_url: count + 1
              });
              //save the document in the database
              url.save((saveErr, urlSaved) => {
                if (saveErr) {
                  res.send('save() error');
                }
                res.json({
                  original_url: urlSaved.original_url,
                  short_url: urlSaved.short_url
                });
              });
            });        
          } else {
            
            res.json({
              original_url: urlFound.original_url,
              short_url: urlFound.short_url
            });
          } 
        }); 
      } 
    }); 
  }); 

  app.get('/api/shorturl/:shorturl', (req, res) => {
    const { shorturl } = req.params;
    //it takes the short_url and if it finds it in the database it redirects
    Url.findOne({
      short_url: shorturl
    }, (err, urlFound) => {
      if (err) {
        console.log('findOne() error');
      }
     
      if (!urlFound) {
        res.json({
          error: 'No short URL found for the given input'
        });
      } else {
        
        res.redirect(urlFound.original_url);
      }
    }); 
  }); 
  
  


app.listen(port);
console.log(`listening on port ${port}`);
