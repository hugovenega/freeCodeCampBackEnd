require('dotenv').config();
const express = require('express');
const createCorsMiddleware = require('cors');
const mongoose = require('mongoose');
const serverIndexController = require('./controllers/serverIndex.controller');
const newUserPostController = require('./controllers/newUser.post.controller');
const newExerciseController = require('./controllers/newExercise.post.controller');
const chargeLogsController = require('./controllers/logs.get.controllers');

const app = express();
const corsMiddlewareOpts = { optionsSuccessStatus: 200 };

app.use(createCorsMiddleware(corsMiddlewareOpts));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

app.get('/', serverIndexController);
app.post('/api/users', newUserPostController);
app.post('/api/users/:_id/exercises', newExerciseController);
app.get('/api/users/:_id/logs', chargeLogsController);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
