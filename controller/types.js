const servers = require('../servers')
const common = require('../lib/common')

class Controller {
    constructor(name) {
        this.dbName = name
    }
    async getList (ctx) {
        const params = ctx.params
    
        // 获取账单详情
        const result = await servers.getCloudDb().select({ 
            dbName: this.dbName,
            offset: params.offset > 0 ? params.offset: 0, 
            limit: params.limit > 0 ? params.limit : 100
        })
        if (result.errcode !== 0) {
            throw new Error(`Fail GET CLOUD DB`)
        }
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map(item => {
                if (typeof item === 'string') {
                    try {
                        item = JSON.parse(item)
                    } catch (error) {
                    }
                }
                return item
            })
        }
        return result
    }
    
    async getAllList (ctx) {
        const result = await servers.getCloudDb().selectAll({ dbName: this.dbName })
        if (result.errcode !== 0) {
            throw new Error(`Fail GET CLOUD DB, ${JSON.stringify(result, null, 2)}`)
        }
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map(item => {
                if (typeof item === 'string') {
                    try {
                        item = JSON.parse(item)
                    } catch (error) {
                    }
                }
                return item
            })
        }
        return result.data
    }
    
    async getDetail (ctx) {
        const params = ctx.params
        console.log('-params---', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        let result = await servers.getCloudDb().selectItem({ dbName: this.dbName, id: params.id })
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

    async addDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (params.id) { throw new Error('FAIL PARAMS ID') }

        let result = await servers.getCloudDb().add({ dbName: this.dbName, data: params })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async updateDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        let result = await servers.getCloudDb().update({ dbName: this.dbName, id: params.id, data: params })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async deleteDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        return await servers.getCloudDb().delete({ dbName: this.dbName, id: params.id })
    }
}

module.exports = new Controller(common.dbNames.types)

