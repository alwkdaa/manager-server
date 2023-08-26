const router = require('koa-router')()
//先引入user的模型
const User = require('../models/userSchema')
// 引入公共的结构
const utils = require('../utils/util')
router.prefix('/users')

router.post('/login', async (ctx) => {
  try {
    // ctx是前端调用这个接口请求的数据
    const { userName, userPwd } = ctx.request.body
    //在用户表中寻找传来的用户数据
    let res = await User.findOne({ userName, userPwd })
    if (res) {
      ctx.body = utils.success(res)
    } else {
      ctx.body = utils.fail("用户名或密码错误")
    }
  } catch (error) {
    ctx.body = utils.fail(error.msg)
  }
})

module.exports = router
