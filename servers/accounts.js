const model = require('../models')

module.exports =  class Container {
    constructor() {
        this.model = model.accounts
    }
    async getItem() {
        return await this.model.findOne()
    }
    async getList() {
        return await this.model.find()
    }
    async updateItem({id, money, typeKey, desc, createTime}) {
        return await this.model.findByIdAndUpdate(id, { money, typeKey, desc, createTime })
    }
    async deleteItem(params) {
        return this.model.deleteOne(params, { where: { id: params.id } })
    }
}