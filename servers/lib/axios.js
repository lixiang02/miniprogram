const axios = require('axios');

const defaultOptions = {
    method: 'get'
}

module.exports = async function fetch(options) {
    const response = await axios(Object.assign({}, defaultOptions, options));
    if (response && response.status === 200 && response.statusText === 'OK' && response.data) {
        return response.data
    }
}