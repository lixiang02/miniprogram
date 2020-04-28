const servers = require('../servers')
const fileServer = require('../lib/file')

const imageTypes = new Set(['list', 'banner', 'cover', 'detail'])

class Controller {
    constructor(name) {
        this.dbName = name
    }
    async getList (ctx) {
        const params = ctx.params
        let where = ''
        if (params.type && imageTypes.has(params.type)) {
            where = { type: params.type }
        }

        // 获取账单详情
        const result = await servers.getCloudDb().select({ 
            dbName: this.dbName,
            where,
            limit: params.limit > 0 ? params.limit : 100,
            offset: params.offset > 0 ? params.offset: 0
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
        // 获取图片链接
        const fileIds = result.data.map(e => e.fileId)
        const files = await servers.getFile().batchDownloadFile(fileIds)
        const urlSet = new Map(files.filter(e=>e.download_url).map(e => [e.fileid, e]))
        result.data.map(item => {
            const urlData = urlSet.get(item.fileId)
            item.url = urlData && urlData.download_url ? urlData.download_url : ''

            // 格式化size
            item.sizeStr = servers.getFile().formatSize(item.size)

            return item
        })
        result.imageTypes = Array.from(imageTypes)

        return result
    }
    
    async getAllList (ctx) {
        const params = ctx.params
        const type = params.type && imageTypes.has(params.type) ? params.type : ''
        let where = ''
        if (type) { where = { type } }
        const ids = params.ids
        const result = await servers.getCloudDb().selectAll({ dbName: this.dbName, where, ids })
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
        }

        // 获取图片链接
        const fileIds = result.data.map(e => e.fileId)
        const files = await servers.getFile().batchDownloadFile(fileIds)
        const urlSet = new Map(files.filter(e=>e.download_url).map(e => [e.fileid, e]))
        result.data.map(item => {
            const urlData = urlSet.get(item.fileId)
            item.url = urlData && urlData.download_url ? urlData.download_url : ''
                    
            // 格式化size
            item.sizeStr = servers.getFile().formatSize(item.size)
            return item
        })
        result.imageTypes = Array.from(imageTypes)
        return result.data
    }

    async getImageTypes(ctx) {
        return Array.from(imageTypes)
    }

    async getAllListByIds(ids) {
        if (ids && ids.length) {
            return await this.getAllList({ params: ids })
        }
        return []
    }

    async getBanners(ctx) {
        ctx.params.type = 'banner'
        return await this.getAllList(ctx)
    }
    
    async getDetail (ctx) {
        const params = ctx.params
        console.log('-params---', params)
        if (!params.id) { throw new Error('NOT FOUND ID') }

        let result = await servers.getCloudDb().selectItem({
            dbName: this.dbName,
            id: params.id
        })
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
        if (params.only) {
            return result
        }
        result.imageTypes = Array.from(imageTypes)

        // 获取图片链接
        const files = await servers.getFile().batchDownloadFile([result.fileId])
        result.url = files[0] && files[0].download_url ? files[0].download_url : ''
        
        // 格式化size
        result.sizeStr = servers.getFile().formatSize(result.size)

        return result
    }

    async addDetail (ctx) {
        const params = ctx.params
        if (params.id) { throw new Error('FAIL PARAMS ID') }

        // 上传文件啊
        const files = ctx.request.files
        let fileId = ''
        let size = 0
        if (files && Object.keys(files).length) {
            let filesData = await this.uploadFiles(files)
            filesData = filesData[0]
            if (!filesData) { throw new Error(`UPLOAD FILES FAIL: ${filesData}`) }
            if (!params.name && typeof filesData === 'object') {
                params.name = filesData.name
            }
            fileId = filesData.fileId
            size = filesData.size
        }

        const type = params.type && imageTypes.has(params.type) ? params.type : ''
        const query = `db.collection(\'${this.dbName}\').add({ data: ${JSON.stringify([{ type, fileId, name: params.name || '', size }])} })`
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

        // 获取详情
        params.only = true
        const data = await this.getDetail({ params })

        // 只允许更新类型，文件不允许更新，只可以添加删除， 你品，你细品
        const type = params.type && imageTypes.has(params.type) ? params.type : ''

        const query = `db.collection(\'${this.dbName}\').doc(\'${params.id}\').set({ data: ${JSON.stringify(Object.assign({}, data, { type }))}})`
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

        // 获取详情
        params.only = true
        const data = await this.getDetail({ params })

        // 验证产品是否使用该数据，要求使用就不可以被删除
        if (data.fileId) {
            const countData = await servers.getCloudDb().getCount({ 
                dbName: 'product',
                where: { fileId: data.fileId }
            })
            if (countData.count > 0) {
                throw new Error('IMAGES BE USED BUY PRODUCT')
            }

            // 先去删除存储文件
            await servers.getFile().batchDeleteFile([data.fileId])
        }

        const query = `db.collection(\'${this.dbName}\').doc(\'${params.id}\').remove()`
        return await servers.getCloudDb().delete({ query })
    }

    async uploadFiles(filesData) {
        // 上传文件列表
        const files = []
        try {
            for (const [key, value] of Object.entries(filesData)) {
                const result = await this.uploadFile(value)
                console.log('--result--', result)
                files.push({
                    fileId: result.fileId,
                    name: result.name,
                    size: result.size
                })
            }
            return files
        } catch (error) {
            throw error
        } finally {
            // 删除临时文件
            for (const [key, { path }] of Object.entries(files)) {
                try {
                    fileServer.remove(path)
                } catch (error) {
                    continue
                }
            }
        }
    }

    async uploadFile(file) {
        const couldFilePath = `admin/${file.name}`
        const fileStream = fileServer.get(file.path, { needUutf8: false })
        const { fileId } = await servers.getFile().uploadFile(couldFilePath, fileStream) 
        return { 
            fileId, 
            name: file.name, 
            size: file.size 
        }
    }
}

module.exports = new Controller('images')

