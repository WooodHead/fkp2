/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */

module.exports = function (schema) {
    schema.add({
      nickname: { type: String, default: ''},
      phone: {type: String, default: ''},
      create_at: { type: String, default: (new Date().getTime()) },   //Date.now 带格式
      update_at: { type: String, default: (new Date().getTime()) },
      url: { type: String },
      profile_image_url: {type: String},
      location: { type: String },
      profile: { type: String },
      avatar: { type: String },
      signature: { type: String },
      email: { type: String}
    });

    schema.index({email: 1})
    // schema.index({email: 1}, {unique: true});
    // schema.index({score: -1});
    // schema.index({githubId: 1});
};
