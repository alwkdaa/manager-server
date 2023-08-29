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
  if (menuName) params.menuName = menuName
  if (menuState) params.menuState = menuState
  let rootList = await Menu.find(params) || []
  const permissionList = getMenuTree(rootList, null, [])
  ctx.body = util.success(permissionList)
})

// 菜单树型结构
//这个函数基于给定的 rootList、id 和 list 构建一个类似树状结构的数据。
function getMenuTree(rootList, id, list) {
  // 遍历 rootList 数组
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i]
    // 检查每个项的 parentId 是否与给定的 id 匹配 
    //item.parentId.slice().pop()的作用是获取item.parentId数组的最后一个元素。
    /* item.parentId.slice()将item.parentId数组进行浅拷贝，得到一个新的数组。
    .pop()从新的数组中移除并返回最后一个元素。
    所以，item.parentId.slice().pop()的结果就是item.parentId数组的最后一个元素。 */
    // console.log(item._doc)
    console.log(String(id))
    console.log(String(item.parentId.slice().pop()))
    console.log(list)
    if (String(item.parentId.slice().pop()) == String(id)) {
      // 将项添加到 list 数组中 这里doc就是里面响应的数据
      list.push(item._doc)
    }
    
  }
  
  // 对每个子项递归调用 getMenuTree，以构建类似树状结构
  list.map(item => {
    item.children = []
    getMenuTree(rootList, item._id, item.children)
    // 如果子项没有子项，删除 children 属性
    if (item.children.length == 0) {
      delete item.children
    } else if (item.children.length > 0 && item.children[0].menuType == 2){
      // 如果子项有子项，并且第一个子项的 menuType 为 2，将 action 属性设置为子项的数组
      item.action = item.children //快速区分按钮和菜单，用于后期做按钮权限
    }
  })
  // 返回 list 数组
  return list
}

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


