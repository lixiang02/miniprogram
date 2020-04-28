const router = require('koa-router')()
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

router.get('/account/:id', dealParams, controllers.getController('accounts').getUserAccountsItem)

router.put('/account/:id', dealParams, controllers.getController('accounts').updateUserAccountItem)

router.post('/account', dealParams, controllers.getController('accounts').createUserAccountItem)

router.get('/account/totalMoney/:id', dealParams, controllers.getController('accounts').getUserTotalMoney)

router.get('/account/types', dealParams, controllers.getController('accounts').getTypes)

// ----------------------

router.get('/product/list', dealParams, controllers.getController('product').getList.bind(controllers.getController('product')))
router.get('/product/list/all', dealParams, controllers.getController('product').getAllList.bind(controllers.getController('product')))
router.get('/product/:id', dealParams, controllers.getController('product').getDetail.bind(controllers.getController('product')))
router.post('/product', dealParams, controllers.getController('product').addDetail.bind(controllers.getController('product')))
router.put('/product/:id', dealParams, controllers.getController('product').updateDetail.bind(controllers.getController('product')))
router.delete('/product/:id', dealParams, controllers.getController('product').deleteDetail.bind(controllers.getController('product')))

router.get('/types/list', dealParams, controllers.getController('types').getList.bind(controllers.getController('types')))
router.get('/types/list/all', dealParams, controllers.getController('types').getAllList.bind(controllers.getController('types')))
router.get('/types/:id', dealParams, controllers.getController('types').getDetail.bind(controllers.getController('types')))
router.post('/types', dealParams, controllers.getController('types').addDetail.bind(controllers.getController('types')))
router.put('/types/:id', dealParams, controllers.getController('types').updateDetail.bind(controllers.getController('types')))
router.delete('/types/:id', dealParams, controllers.getController('types').deleteDetail.bind(controllers.getController('types')))

router.get('/images/list', dealParams, controllers.getController('images').getList.bind(controllers.getController('images')))
router.get('/images/list/all', dealParams, controllers.getController('images').getAllList.bind(controllers.getController('images')))
router.get('/images/list/banners', dealParams, controllers.getController('images').getBanners.bind(controllers.getController('images')))
router.get('/images/types', dealParams, controllers.getController('images').getImageTypes.bind(controllers.getController('images')))
router.get('/images/:id', dealParams, controllers.getController('images').getDetail.bind(controllers.getController('images')))
router.post('/images', dealParams, controllers.getController('images').addDetail.bind(controllers.getController('images')))
router.put('/images/:id', dealParams, controllers.getController('images').updateDetail.bind(controllers.getController('images')))
router.delete('/images/:id', dealParams, controllers.getController('images').deleteDetail.bind(controllers.getController('images')))

module.exports = router