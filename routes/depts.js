//导入router 
const router = require('koa-router')()
// 导入util
const util = require('../utils/util')
// 导入menu模型
const Dept = require('../models/deptSchema')

// 添加路由前缀 '/menu'
router.prefix('/dept')

router.get('/list', async (ctx) => {
  const { deptName } = ctx.request.query
  const params = {}
  if (deptName) params.deptName = deptName
  let rootList = await Dept.find(params) || []
  const permission = getDeptTree(rootList, null, [])
  if (deptName) {
    ctx.body = util.success(rootList)
  } else {
    ctx.body = util.success(permission)
  }
})

router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let info
  try {
    if (action == 'create') {
      await Dept.create(params)
      info = '创建成功'
    } else if (action == 'edit') {
      params.updateTime = new Date()
      await Dept.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      await Dept.findByIdAndRemove(_id)
      await Dept.deleteMany({ parentId: { $all: [_id] } })
      info = '删除成功'
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail({}, error.stack)
  }
})

// 递归数返回数据
function getDeptTree(rootList, id, list) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i]
    if (String(item.parentId.slice().pop()) == String(id)) {
      list.push(item._doc)
    }
  }
  // 对每个子项递归调用 getMenuTree，以构建类似树状结构
  list.map(item => {
    item.children = []
    getDeptTree(rootList, item._id, item.children)
    // 如果子项没有子项，删除 children 属性
    if (item.children.length == 0) {
      delete item.children
    } else if (item.children.length > 0 && item.children[0].menuType == 2){
      // 如果子项有子项，并且第一个子项的 menuType 为 2，将 action 属性设置为子项的数组
      item.action = item.children //快速区分按钮和菜单，用于后期做按钮权限
    }
  })
  return list
}

module.exports = router