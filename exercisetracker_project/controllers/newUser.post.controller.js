const User = require('../models/user');

async function newUser(req, res) {
  const typedNewUser = req.body.username;

  try {
    let foundUser = await User.findOne({ username: typedNewUser });
    if (!foundUser) {
      foundUser = new User({ username: typedNewUser });
      foundUser.save();
      res.json({ username: foundUser.username, _id: foundUser._id });
    } else {
      res.redirect('/api/users');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
}

module.exports = newUser;
