/* 对公共的结构体例如分页函数，返回结构和错误码进行封装 */

const log4js = require('./log4j')
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
  pager(pageNum = 1, pageSize = 10) {
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
  }
}