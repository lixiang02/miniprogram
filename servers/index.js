
class Servers {
    getDb (name) {
        return new require(`./${name}`)()
    }
    getCloudDb() {
        return require('./servers/db')
    }
    getFile() {
        return require('./servers/file')
    }
    getFunc() {
        return require('./servers/func')
    }
}

module.exports = new Servers()