const router = require('koa-router')()
//先引入user的模型
const User = require('../models/userSchema')
// 引入公共的结构
const utils = require('../utils/util')
// 引入jwt
const jwt = require('jsonwebtoken')
router.prefix('/users')

router.post('/login', async (ctx) => {
  try {
    // ctx是前端调用这个接口请求的数据
    const { userName, userPwd } = ctx.request.body
    //在用户表中寻找传来的用户数据
    /**
    * 返回数据指定字段的三种方式
    * 1.let res = await User.findOne({ userName, userPwd },'userId userName userEmail state role deptId roleList')
    * 2.let res = await User.findOne({ userName, userPwd },{ userId:1,_id:0})  1代表返回，2代表不返回
    * 3.let res = await User.findOne({ userName, userPwd }).select('userId') select里面是返回的数据
    */
    let res = await User.findOne({ userName, userPwd },'userId userName userEmail state role deptId roleList')
    // 获取到用户数据在res的_doc中
    const data = res._doc
    // 生成token
    const token = jwt.sign({
      data: data
    },'jason', { expiresIn: '1h' })
    if (res) {
      data.token = token
      ctx.body = utils.success(data)
    } else {
      ctx.body = utils.fail("用户名或密码错误")
    }
  } catch (error) {
    ctx.body = utils.fail(error.msg)
  }
})

module.exports = router
