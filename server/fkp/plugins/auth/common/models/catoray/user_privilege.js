/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */

module.exports = function (schema) {
  schema.add({
    gid: { type: String },   // 从哪里注册进来
    gpassword: { type: String },
    groups: {type: [String]},
    mode: {type: String, default: '777'}  //读 写 评
  })
};
