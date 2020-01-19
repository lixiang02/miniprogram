const model = require('../models')

module.exports =  class Container {
    constructor() {
        this.model = model.types
    }
    async getOne() {
        return await this.model.findOne()
    }
    async getItem(params) {
        return await this.model.findById(params.id)
    }
    async getList(params) {
        return await this.model.find()
    }
    async addone(params) {
        await this.model.create(params)
    }
    async deleteOne(params) {
        await this.model.deleteOne({ where: { id: params.id }})
    }
    async updateItem(params) {
        await this.model.update(params, { where: { id: params.id } })
    }
}