const mongoose = require('../lib/mongodb')

module.exports = mongoose.model('Types', new mongoose.Schema({ 
    _id : { type: String }, //ID 
    key: { type: Number }, //类型key
    value: { type: String }, //类型 
}, {
    collection: 'types'
}));