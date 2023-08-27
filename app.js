const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
// const log4js = require("log4js");

const log4js = require('./utils/log4j')
const users = require('./routes/users')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const util = require('./utils/util')
// error handler
onerror(app)
require('./config/db')
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
/* const logger = log4js.getLogger()
logger.level = "debug";
logger.debug("Some debug messages") */
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // 服务端 希望看到前端请求过来的数据
  // const start = new Date()
  log4js.info(`get params:${JSON.stringify(ctx.request.query)} `)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)} `)
  await next().catch((error) => {
    if (error.status == '401') {
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw error;
    }
  })
  /* const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) */
})

app.use(koajwt({ secret: 'jason' }).unless({
  path: [/^\/api\/users\/login/]
}))
router.prefix('/api')
router.get('/leave/count', (ctx) => {
  // 拿到前端携带过来的token进行验证
  const token = ctx.request.headers.authorization.split(' ')[1]
  const payload = jwt.verify(token, 'jason')
  ctx.body = payload
})
router.use(users.routes(), users.allowedMethods())
// routes
app.use(router.routes(), router.allowedMethods())
// log4js.info('info output')
// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  log4js.error(`${err.stack}`)
});

module.exports = app
