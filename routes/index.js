const router = require('koa-router')()
const servers = require('../servers')
const controllers = require('../controller')

const dealParams = async function (ctx, next) {
  ctx.params = Object.assign({}, ctx.request.body, ctx.query, ctx.params)
  if (typeof ctx.params.id === 'string' && Number(ctx.params.id) >= 0) {
    ctx.params.id = Number(ctx.params.id)
  }
  console.log('params -> ', ctx.params)
  return await next()
}

router.get('/', async (ctx, next) => {
  return await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/db', servers.user.getOne)

router.get('/account/:id', dealParams, controllers.accounts.getUserAccountsItem)

router.put('/account/:id', dealParams, controllers.accounts.updateUserAccountItem)

router.post('/account', dealParams, controllers.accounts.createUserAccountItem)

router.get('/account/totalMoney/:id', dealParams, controllers.accounts.getUserTotalMoney)

router.get('/account/types', dealParams, controllers.accounts.getTypes)

module.exports = router
