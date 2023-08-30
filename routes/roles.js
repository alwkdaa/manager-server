//导入router 
const router = require('koa-router')()
// 导入util
const util = require('../utils/util')
// 导入menu模型
const Roles = require('../models/rolesSchema')

// 添加路由前缀 '/menu'
router.prefix('/roles')

// 获取所有角色菜单
router.get('/allList', async (ctx) => {
  try {
    const list = await Roles.find({},"_id roleName") 
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(`查询失败:${error.stack}`)
  }
})
// 获取角色列表
router.get('/list', async (ctx) => {
  const {roleName} = ctx.request.query
  const {page,skipIndex} = util.pager(ctx.request.query)
  try {
    let params = {}
    if(roleName) params.roleName = roleName
    const query = Roles.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Roles.countDocuments(params)
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total
      }
    })
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`)
  }
 
})


module.exports = router

