//导入router 
const router = require('koa-router')()
// 导入util
const util = require('../utils/util')
// 导入menu模型
const Menu = require('../models/menuSchema')

// 添加路由前缀 '/menu'
router.prefix('/menu')
// 菜单列表
router.get('/list', async (ctx) => {
  //ctx.request.query 表示从请求上下文中获取查询参数的对象。
  const { menuName, menuState } = ctx.request.query
  const params = {}
  if(menuName) params.menuName = menuName
  if(menuState) params.menuState = menuState
  let rootList = await Menu.find(params) || []
  // const permissionList = getMenuTree(rootList,null,[])
  ctx.body = util.success(rootList)
})



// 处理对 '/operate' 路径的 POST 请求
router.post('/operate', async (ctx) => {
  // 从请求体中解构获取 _id、action 和 params 属性
  const { _id, action, ...params } = ctx.request.body
  let res, info
  try {
    // 如果 action 等于 'add'
    if (action == 'add') {
      // 创建一个新的菜单项
      res = await Menu.create(params)
      // 设置 info 变量为 '创建成功'
      info = '创建成功'
    }
    // 如果 action 等于 'edit'
    else if (action == 'edit') {
      // 将 params 对象的 updateTime 属性设置为当前日期和时间
      params.updateTime = new Date()
      // 更新指定 _id 的菜单项
      await Menu.findByIdAndUpdate(_id, params)
      // 设置 info 变量为 '编辑成功'
      info = '编辑成功'
    }
    // 如果 action 既不是 'add' 也不是 'edit'
    else {
      // 删除指定 _id 的菜单项
      await Menu.findByIdAndRemove(_id)
      // 删除所有 parentId 包含指定 _id 的菜单项
      await Menu.deleteMany({ parentId: { $all: [_id] } })
      // 设置 info 变量为 '删除成功'
      info = '删除成功'
    }

    // 设置响应体为调用 util.success() 方法的结果
    ctx.body = util.success({}, info)
  } catch (error) {
    // 错误处理逻辑
  }
})

module.exports = router


