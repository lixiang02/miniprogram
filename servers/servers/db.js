const config = require('../config/local.json')
const rq = require('../lib/axios')
const TokenServer = require('./access-token')

const MAX_LIMIT = 100
class DbServer extends TokenServer {
    constructor() {
        super()
        this.get = '.get()'
        this.count = '.count()'
    }
    async requestBase({ url='', method='get', query='' }) {
        const { access_token } = await this.getAccessToken()

        const options = {
            method,
            url: `${config.BaseUrl}${url}`,// /tcb/databasequery
            params: { 
                access_token,
            },
            data: {
                env: config.env,
                query
            }
        }
        const result = await rq(options);
        if (result.errcode === 0) {
            return result
        }
        return {}
    }

    async select({ query, dbName, where, ids, limit=10, offset=0 }) {
        if (dbName) {
            query = this.getDBQuery(dbName)
            query += this.getDocs(ids)
            query += this.getWhereQuery(where)
            query += this.getPager(limit, offset)
            query += this.get
        }
        return await this.requestBase({ 
            url: '/tcb/databasequery',
            query,// "db.collection(\"geo\").where({done:true}).limit(10).skip(1).get()"
            method: 'post'
        });
    }

    async selectItem({ query, dbName, id }) {
        if (dbName) {
            query = this.getDBQuery(dbName)
            query += this.getDoc(id)
            query += this.get
        }
        return await this.requestBase({ 
            url: '/tcb/databasequery',
            query,// "db.collection(\"geo\").where({done:true}).limit(10).skip(1).get()"
            method: 'post'
        });
    }

    async selectAll({ dbName, where, ids }) {
        if (ids && ids.length > 0) { return await this.selectAllByIds({ dbName, ids: Array.from(new Set(ids)) }) }

        // 先取出集合记录总数
        const countResult = await this.getCount({ dbName, where })
        const total = countResult.count
        console.log('countResult:', countResult)

        // 计算需分几次取
        const batchTimes = Math.ceil(total / 100)

        // 承载所有读操作的 promise 的数组
        const params = []
        for (let i = 0; i < batchTimes; i++) {
            params.push({ dbName,skip: i * MAX_LIMIT, limit: MAX_LIMIT, where })
        }

        // 等待所有
        const results = await Promise.all(params.map(param => this.select(param)))
        let list = []
        for (const item of results) {
            if (item.errcode === 0) {
                list = list.concat(item.data)
            }
        }
        return {
            errcode: 0,
            errmsg: 'ok',
            pager: { Offset: 0, Limit: list.length, Total: list.length },
            data: list
        }
    }

    async selectAllByIds({ dbName, ids }) {
        // 先取出集合记录总数
        const total = Array.from(new Set(ids)).length
        console.log('total:', total)

        // 计算需分几次取
        const batchTimes = Math.ceil(total / 100)

        // 承载所有读操作的 promise 的数组
        const params = []
        for (let i = 0; i < batchTimes; i++) {
            params.push({ dbName, skip: i * MAX_LIMIT, limit: MAX_LIMIT, ids })
        }

        // 等待所有
        const results = await Promise.all(params.map(param => this.select(param)))
        let list = []
        for (const item of results) {
            if (item.errcode === 0) {
                list = list.concat(item.data)
            }
        }
        return {
            errcode: 0,
            errmsg: 'ok',
            pager: { Offset: 0, Limit: list.length, Total: list.length },
            data: list
        }
    }

    async update({ query }) {
        return await this.requestBase({ 
            url: '/tcb/databaseupdate',
            query,// "db.collection(\"geo\").where({age:14}).update({data:{age: _.inc(1)}})"
            method: 'post'
        });
    }

    async delete({ query }) {
        return await this.requestBase({ 
            url: '/tcb/databasedelete',
            query,//  "db.collection(\"geo\").where({done:false}).remove()"
            method: 'post'
        });
    }

    async add({ query }) {
        return await this.requestBase({ 
            url: '/tcb/databaseadd',
            query,
            method: 'post'
        });
            // "db.collection(\"geo\").add({
            //     data: [{
            //       description: \"item1\",
            //       due: new Date(\"2019-09-09\"),
            //       tags: [
            //         \"cloud\",
            //         \"database\"
            //       ],
            //       location: new db.Geo.Point(113, 23),
            //       done: false
            //     },
            //     {
            //       description: \"item2\",
            //       due: new Date(\"2019-09-09\"),
            //       tags: [
            //         \"cloud\",
            //         \"database\"
            //       ],
            //       location: new db.Geo.Point(113, 23),
            //       done: false
            //     }
            //     ]
            //   })"
    }

    async getCount({ query, dbName, where }) {
        if (dbName) {
            query = this.getDBQuery(dbName)
            query += this.getWhereQuery(where)
            query += this.count
        }
        const result = await this.requestBase({ 
            url: '/tcb/databasecount',// "db.collection(\"geo\").where({done:true}).count()"
            query,
            method: 'post'
        });
        if (result.errcode !== 0) {
            throw new Error(result)
        }
        return result
    }

    async aggregate({ query }) {
        return await this.requestBase({ 
            url: '/tcb/databaseaggregate',// "db.collection(\"test_collection\").aggregate().match({tags:\"cloud\"}).limit(10).end()"
            query,
            method: 'post'
        });
    }

    async getTablesInfo() {
        return await this.requestBase({ 
            url: '/tcb/databasecollectionget',
            method: 'post'
        });
    }

    getDBQuery(dbName){
        return dbName ? `db.collection(\'${dbName}\')` : ''
    }
    getWhereQuery(where) {
        return where ? `.where(${JSON.stringify(where)})` : ''
    }
    getPager(limit=10, offset=0) {
        return `.limit(${limit}).skip(${offset})`
    }
    getDoc(id) {
        return id ? `.doc(\'${id}\')` : ''
    }
    getDocs(ids) {
        return ids && ids.length > 0 ? `.where({ _id: _.in(${JSON.stringify(ids)}) })` : ''
    }
}

module.exports = new DbServer()