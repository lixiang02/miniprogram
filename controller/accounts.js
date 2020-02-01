const servers = require('../servers')
const moment = require('moment')

exports.getUserAccountsItem = async ctx => {
    // 获取账单详情
    const account = await servers.accounts.getItem() || {}

    // 获取类型
    const types = await servers.types.getList()
    return {
        account,
        types
    }
}

exports.updateUserAccountItem = async ({ params }) => {
    return await servers.accounts.updateItem(params)
}

exports.createUserAccountItem = async ({ params }) => {
    return await servers.accounts.createItem(params)
}

exports.getUserTotalMoney = async ({ params }) => {
    const all = await servers.accounts.getList()
    return  all.map(e => e.money).reduce((a,b) => a + b)
}

exports.getTypes = async () => {
    return await servers.types.getList()
}