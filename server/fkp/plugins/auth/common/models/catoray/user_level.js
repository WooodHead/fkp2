

/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */

module.exports = function (schema) {
  schema.add({
    score: { type: Number, default: 0},
    follower: {type: Number, default: 0},
    following: {type: Number, default: 0},
    friends: {type: Number, default: 0}
  })
};
