const request = require('request-promise')

const defaultOptions = {
    method: 'get'
}

module.exports = async function fetch(options) {
    return await new Promise((resolver, reject) => {
        request(Object.assign({}, defaultOptions, options)).then(function (body) {
            // POST succeeded...
            resolver(body)
        })
        .catch(function (err) {
            // POST failed...
            reject(err)
        })
    })
} 