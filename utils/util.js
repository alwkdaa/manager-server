/* 对公共的结构体例如分页函数，返回结构和错误码进行封装 */

const log4js = require('./log4j')
// 引入jwt
const jwt = require('jsonwebtoken')
// 定义的状态码
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001,// 参数错误
  USER_ACCOUNT_ERROR: 20001,// 账号或者密码错误
  USER_LOGIN_ERROR: 30001,// 用户未登录
  BUSINESS_ERROR: 40001,// 业务请求失败
  AUTH_ERROR: 50001,// 认证失败或者token过期
}

// 向外导出
module.exports = {
  /**
   * 分页函数封装
   * @param {number} pageNum 页码
   * @param {number} pageSize 每页展示的数据条数
   */
  pager({pageNum = 1, pageSize = 10}) {
    pageNum *= 1
    pageSize *= 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    }
  },
  success(data = '', msg = '', code = CODE.SUCCESS) {
    log4js.debug(data)
    return {
      code,
      data,
      msg
    }
  },
  // 失败
  fail (msg = '', code = CODE.BUSINESS_ERROR,data) {
    log4js.debug(msg)
    return {
      code, 
      data, 
      msg
    }
  },
  CODE,
  decode(authorization) {
    if(authorization) {
      // 如果有签名，就获取到token，在登陆的时候就已经将token加到authorization里了
      const token = authorization.split(' ')[1]
      //给定的token进行验证。
      return jwt.verify(token, 'jason')
    }
    return ''
  },


  // 递归树的方法
  getTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i]
      if (String(item.parentId.slice().pop()) == String(id)) {
        list.push(item._doc)
      }
    }
    // 对每个子项递归调用 getMenuTree，以构建类似树状结构
    list.map(item => {
      item.children = []
      this.getTree(rootList, item._id, item.children)
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
}