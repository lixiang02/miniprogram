const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body')

require('./lib/mongodb')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  ctx.set('Access-Control-Allow-Headers', '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Max-Age', 1728000);
  if (ctx.request.files && ctx.request.files.length) {
    console.log('FILES: ', JSON.stringify(ctx.request.files, null, 2))
  }
  console.log('FILES: ', JSON.stringify(ctx.request.files, null, 2))

  await next();
});
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// return
app.use(async (ctx, next) => {
  try {
    ctx.body = {
      code: 0,
      message: 'success',
      success: true,
      data: await next()
    };
  } catch (error) {
    console.log('Request Error', error.stack)
    ctx.body = {
      code: 1,
      message: error.stack,
      success: false,
      data: null
    }
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
