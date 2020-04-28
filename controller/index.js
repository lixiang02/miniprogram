class Controller {
    getController (name) {
        return require(`./${name}`)
    }
}

module.exports = new Controller()

