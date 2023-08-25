/* 日志存储
  @author lsl
*/
const log4js = require('log4js')

const levels = {
  'trace': log4js.levels.TRACE,
  'debug': log4js.levels.DEBUG,
  'info': log4js.levels.INFO,
  'warn': log4js.levels.WARN,
  'error': log4js.levels.ERROR,
  'fatal': log4js.levels.FATAL,
}

log4js.configure({
  appenders: {
    // 输出
    console: { type: 'console' },
    info:{
      type: 'file',
      filename: 'logs/all-logs.log'
    },
    error:{
      type: 'dateFile',
      filename: 'logs/log',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true //设置文件的名称是filename + pattern
    }
  },
  // 分类
  categories: {
    default: { appenders: ['console'], level: "debug" },
    info:{
      appenders:['info', 'console'],
      level: 'info0'
    },
    error:{
      appenders: ['error', 'console'],
      level: 'error'
    }
  },
});

/* 日志输出 level为debug */
exports.debug = (content) => {
  const logger = log4js.getLogger()
  logger.level = levels.debug
  logger.debug(content) 
}
/* 日志输出 level为info */
exports.info = (content) => {
  const logger = log4js.getLogger('info')
  logger.level = levels.info
  logger.info(content) 
}
/* 日志输出 level为error */
exports.error = (content) => {
  const logger = log4js.getLogger('error')
  logger.level = levels.error
  logger.error(content) 
}