const Exe = require('../models/exercise');
const User = require('../models/user');

async function chargeLogs(req, res) {
  const typedId = req.params._id;
  const { from, to, limit } = req.query;
  let logs = [];

  try {
    const foundLog = await User.findOne({ _id: typedId });
    if (foundLog) {
      const foundExeLogs = await Exe.find({ key: foundLog._id }, { _id: 0, key: 0, __v: 0 }).lean().exec();
      logs = [...foundExeLogs];
      if (req.query.from || req.query.to) {
        let typedFrom = new Date(0);
        let typedTo = new Date();
        if (from) {
          typedFrom = new Date(from);
        }
        if (to) {
          typedTo = new Date(to);
        }
        logs = await logs.filter((foundLog) => new Date(foundLog.date).getTime() > typedFrom
     && new Date(foundLog.date).getTime() < typedTo);

        if (limit) {
          logs = logs.slice(0, limit);
        }
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          from: typedFrom.toDateString(),
          to: typedTo.toDateString(),
          count: logs.length,
          log: logs,
        });
      } else {
        if (req.query.limit) {
          logs = logs.slice(0, req.query.limit);
        }
        res.json({
          _id: foundLog._id,
          username: foundLog.username,
          count: logs.length,
          log: logs,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
}

module.exports = chargeLogs;
