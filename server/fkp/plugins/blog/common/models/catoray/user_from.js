

/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */

module.exports = function (schema) {
  schema.add({
    signfrom: { type: String, default: 'local' },   // 从哪里注册进来
    thirduser: {}
  })
};
