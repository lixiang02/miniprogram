const servers = require('../servers')
const controllers = require('../controller')

class Controller {
    constructor(name) {
        this.dbName = name
    }
    async getList (ctx) {
        const params = ctx.params
        let where = ''
        if (params.typeId) {
            where = { typeId: params.typeId }
        }
    
        // 获取账单详情
        const [
            result,
            types
        ] = await Promise.all([
            servers.getCloudDb().select({ 
                dbName: this.dbName, 
                where,
                limit: params.limit > 0 ? params.limit : 100,
                offset: params.offset > 0 ? params.offset: 0
            }),
            controllers.getController('types').getAllList()
        ])
        if (result.errcode !== 0) {
            throw new Error(`Fail GET CLOUD DB`)
        }
        const typesMap = new Map(types.map(t => [t._id, t]))
        result.types = types
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map(item => {
                if (typeof item === 'string') {
                    try {
                        item = JSON.parse(item)
                        item.type = typesMap.get(item.typeId) || ''
                        item.type = typeof item.type === 'object' ? item.type.name : ''
                    } catch (error) {
                    }
                }
                return item
            })
        
            // 获取图片链接
            const imageData = await controllers.getController('images').getAllListByIds(result.data.map(e => e.imageId))
            const urlSet = new Map(imageData.filter(e=>e.url).map(e => [e._id, e]))
            result.data.map(item => {
                const urlData = urlSet.get(item.imageId)
                item.url = urlData && urlData.url ? urlData.url : ''

                return item
            })
        }

        return result
    }
    
    async getAllList (ctx) {   
        const params = ctx.params
        let where = ''
        if (params.typeId) {
            where = { typeId: params.typeId }
        } 
        // 获取账单详情
        const result = await servers.getCloudDb().selectAll({ dbName: this.dbName, where })

        if (result.errcode !== 0) {
            throw new Error(`Fail GET CLOUD DB , ${JSON.stringify(result, null, 2)}`)
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
                    
            // 获取图片链接
            const imageData = await controllers.getController('images').getAllListByIds(result.data.map(e => e.imageId))
            const urlSet = new Map(imageData.filter(e=>e.url).map(e => [e._id, e]))
            result.data.map(item => {
                const urlData = urlSet.get(item.imageId)
                item.url = urlData && urlData.url ? urlData.url : ''
                
                return item
            })
        }
        return result.data
    }

    async getDetail (ctx) {
        const params = ctx.params
        console.log('-params---', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        let [
            result,
            types
        ] = await Promise.all([
            servers.getCloudDb().selectItem({ dbName: this.dbName, id: params.id }),
            controllers.getController('types').getAllList()
        ])
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
        result.types = types || []

        if (result.typeId) {
            const item = types.find(e => e._id === result.typeId)
            result.type = item.name
        }
        
        // 获取图片链接
        const files = await servers.getFile().batchDownloadFile([result.fileId])
        result.url = files[0] && files[0].download_url ? files[0].download_url : ''
        
        return result
    }

    async addDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (params.id) { throw new Error('FAIL PARAMS ID') }

        const query = `db.collection(\'${this.dbName}\').add({ data: ${JSON.stringify(params)} })`
        let result = await servers.getCloudDb().add({ query })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async updateDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        // 获取详情信息
        await this.getDetail(ctx)

        const query = `db.collection(\'${this.dbName}\').doc(\'${params.id}\').set({ data: ${JSON.stringify(params)}})`
        let result = await servers.getCloudDb().update({ query })
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async deleteDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        const query = `db.collection(\'${this.dbName}\').doc(\'${params.id}\').remove()`
        return await servers.getCloudDb().delete({ query })
    }
}

module.exports = new Controller('product')



