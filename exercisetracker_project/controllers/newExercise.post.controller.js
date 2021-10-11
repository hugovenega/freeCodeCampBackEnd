const Exe = require('../models/exercise');
const User = require('../models/user');

async function newExercise(req, res) {
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
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
}

module.exports = newExercise;
