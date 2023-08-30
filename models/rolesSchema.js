const mongoose = require('mongoose')

const rolesSchema = mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: {
    checkedKeys: [],
    halfCheckedKeys: [],
  },
  "createTime": {
    type: Date,
    default: Date.now()
  },//创建时间
})

module.exports = mongoose.model('roles',rolesSchema,'roles')