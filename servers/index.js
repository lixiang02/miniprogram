const User = require('./user')
const Types = require('./types')
const Accounts = require('./accounts')

module.exports = {
    user: new User(),
    types: new Types(),
    accounts: new Accounts()
}