const _ = require('lodash')
const servers = require('../servers')
const common = require('../lib/common')

class Controller {
    constructor(name) {
        this.dbName = name
        this.schemas = [
            'coverId',
            'festival',
            'flowerCount',
            'mainFlowers',
            'scene',
            'style',
            'suitable',
            'unit',
            'weight'
        ]
    }

    async getDetail (productId) {
        if (!productId) { throw new Error('NOT FOUND ID') }

        let result = await servers.getCloudDb().select({ dbName: this.dbName, where: { productId } })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        result = result.data[0]
        if (!result) {
            throw new Error('DATA IS NOT FOUND')
        }
        if (typeof result === 'string') {
            try {
                result = JSON.parse(result)
            } catch (error) {
            }
        }
                
        return result
    }

    async addDetail (productId, params) {
        console.log('addDetail:productId:', productId)
        console.log('addDetail:params:', params)
        if (!productId) { throw new Error('FAIL PARAMS ID') }

        // 参数验证
        let realParams = this.getSchemaParams(params)
        if (!realParams) { return }
        realParams.productId = productId

        const result = await servers.getCloudDb().add({ 
            dbName: this.dbName, 
            data: realParams 
        })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async updateDetail (productId, params) {
        console.log('updateDetail:productId:', productId)
        console.log('updateDetail:params:', params)
        if (!productId) { throw new Error('NOT FOUND productId') }

        // 参数验证
        let realParams = this.getSchemaParams(params)
        if (!realParams) { return }

        // 获取详情信息
        const data = await this.getDetail(productId)
        realParams = this.getRealParamsByData(realParams, data)
        if (!realParams) { return }

        const result = await servers.getCloudDb().update({ dbName: this.dbName, id: data._id, data: Object.assign({}, data, realParams) })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async deleteDetail (productId) {
        console.log('deleteDetail:productId:', productId)
        if (!productId) { throw new Error('NOT FOUND ID') }

        // 获取详情信息
        const data = await this.getDetail(productId)

        return await servers.getCloudDb().delete({ 
            dbName: this.dbName, 
            id: data._id 
        })
    }

    getSchemaParams(params) {
        const intersections = _.intersection(this.schemas, Object.keys(params))
        if (!intersections.length) { return null }
        return _.pick(params, this.schemas)
    }
    getRealParamsByData(params, data) {
        const keys = []
        for (const key of Object.keys(params)) {
            if (params[key] !== data[key]) {
                keys.push(key)
            }
        }
        if (!keys.length) { return }
        return _.pick(params, keys)
    }
}

module.exports = new Controller(common.dbNames.productDetail)



