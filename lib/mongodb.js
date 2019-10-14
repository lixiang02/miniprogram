const mongoose = require('mongoose');

async function getMongoDb() {
  return await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true});
//   const Schema = new res.Schema({
//     _id: String,
//     userId: Number,
//     type: Number,
//     money: Number,
//     desc: String,
//     createTime: Date
// }, {
//     collection: 'book'
// })
//   const MyModel = mongoose.model('book', Schema);
//   console.log(await MyModel.find());
}

let db = null
try {
    db = await getMongoDb()
} catch (error) {
    console.error('MongoDB Connect Fail', error.stack)
}
module.exports = db
