const mongoose = require('../lib/mongodb')

module.exports = mongoose.model('User', new mongoose.Schema({ 
    _id : { type: String }, //ID 
    id: { type: Number }, //ID
    desc: { type: String }, //类型描述
}, {
    collection: 'user'
}));