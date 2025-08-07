const Counter = require('../model/Counter'); // 需先建立 Counter model（儲存序號）

async function getNextSeq(modelName, start = 1000) {
  const result = await Counter.findOneAndUpdate(
    { _id: modelName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!result.seq || result.seq < start) {
    result.seq = start;
    await result.save();
  }

  return result.seq;
}

module.exports = getNextSeq;