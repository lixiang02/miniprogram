const model = require('../models')

module.exports =  class Container {
    async getOne() {
        return await model.user.findOne()
    }
}