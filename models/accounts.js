const mongoose = require('../lib/mongodb')

module.exports = mongoose.model('Accounts', new mongoose.Schema({ 
    money: { type: Number }, //钱数
    typeKey: { type: String }, //类型key
    desc: { type: String }, //消费说明
    createTime: { type: Date }, //创建时间
}, {
    collection: 'accounts',
}));