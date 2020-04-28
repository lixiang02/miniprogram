const config = require('../config/local.json')
const rq = require('../lib/axios')
const TokenServer = require('./access-token')

class FuncServer extends TokenServer {
    async baseFuncExce({ name, POSTBODY }) {
        try {
            const { access_token } = await this.getAccessToken();
            const options = {
                method: 'post',
                url: `${config.BaseUrl}/tcb/invokecloudfunction`,
                params: { 
                    access_token,
                },
                data: {
                    name,
                    POSTBODY, // 云函数的传入参数
                    env: config.env,
                }
            }
            const result = await rq(options);
            if (result.errcode !== 0) {
                throw new Error(`BaseFuncExce Fail : ${result}`)
            }
            return result.resp_data
        } catch (error) {
            throw error
        }
    }
}

module.exports = new FuncServer()