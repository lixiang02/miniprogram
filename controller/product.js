const _ = require('lodash')
const servers = require('../servers')
const controllers = require('../controller')
const common = require('../lib/common')
const imageTypes = common.imageTypes || {}

class Controller {
    constructor(name) {
        this.dbName = name
        this.schemas = [
            'commentCount',
            'desc',
            'imageId',
            'name',
            'price',
            'realPrice',
            'sellCount',
            'typeId'
        ]
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
            controllers.getController(common.cNames.types).getAllList()
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
            const imageData = await controllers.getController(common.cNames.images).getAllListByIds(result.data.map(e => e.imageId))
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
            const imageData = await controllers.getController(common.cNames.images).getAllListByIds(result.data.map(e => e.imageId))
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
        console.log('getDetail:params:', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        let [
            result,
            detail,
            types,
            images
        ] = await Promise.all([
            servers.getCloudDb().selectItem({ dbName: this.dbName, id: params.id }),
            controllers.getController(common.cNames.productDetail).getDetail(params.id),
            controllers.getController(common.cNames.types).getAllList(),
            controllers.getController(common.cNames.images).getAllList({ params: { type: imageTypes.list } })
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
        if (detail) {
            result.detail = detail
            Object.assign(result, _.pick(detail, controllers.getController(common.cNames.productDetail).schemas))
        }
        if (params.only) {
            return result
        }
        result.types = types || []
        result.images = images || []

        if (result.typeId) {
            const item = types.find(e => e._id === result.typeId)
            result.type = item.name
        }
        
        // 获取图片链接
        const imageData = images.find(e => e._id === result.imageId)
        result.url = imageData && imageData.url ? imageData.url : ''
        const coverData = images.find(e => e._id === result.coverId)
        result.coverUrl = coverData && coverData.url ? coverData.url : ''

        return result
    }

    async addDetail (ctx) {
        console.log('addDetail:params:', params)
        const params = ctx.params
        if (params.id) { throw new Error('FAIL PARAMS ID') }

        let [
            result,
            detailResult
        ] = await Promise.all([
            servers.getCloudDb().add({ dbName: this.dbName, data: _.pick(params, this.schemas) }),
            controllers.getController(common.cNames.productDetail).add(params.id, params)
        ])
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        result.detail = detailResult
        return result
    }

    async updateDetail (ctx) {
        console.log('updateDetail:params:', params)
        const params = ctx.params
        if (!params.id) { throw new Error('NOT FOUND ID') }

        // 获取详情信息
        params.only = true
        const data = await this.getDetail(ctx)

        let [result, detailResult] = await Promise.all([
            servers.getCloudDb().update({ dbName: this.dbName, id: params.id, data: Object.assign({}, data, params) }),
            controllers.getController(common.cNames.productDetail).updateDetail(params.id, params)
        ])
        
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        result.detail = detailResult
        return result
    }

    async deleteDetail (ctx) {
        const params = ctx.params
        console.log('--params--', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        // 获取详情信息
        params.only = true
        await this.getDetail(ctx)

        return await servers.getCloudDb().delete({ dbName: this.dbName, id: params.id })
    }
}

module.exports = new Controller(common.dbNames.product)



