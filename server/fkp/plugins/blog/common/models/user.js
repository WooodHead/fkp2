// "use strict";
let bcrypt = require('bcryptjs')
let mongoose = require("mongoose")
let Schema = mongoose.Schema

let BaseUserSchema = new Schema({
  id: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  nickname: { type: String, default: ''},
  phone: {type: String, default: ''},
  create_at: { type: String, default: (new Date().getTime()) },   //Date.now 带格式
  update_at: { type: String, default: (new Date().getTime()) },
  accessToken: {type: String}
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.password;
      delete ret._id;
      delete ret.__v;
      delete ret.create_at;
      delete ret.update_at;
    }
  }
})

/**
* Index 索引
*/
BaseUserSchema.index({username: 1}, {unique: true});
BaseUserSchema.index({accessToken: 1});

/**
 * Middlewares
 */
 let user_profile = require('./catoray/user_profile')
 BaseUserSchema.plugin(user_profile);

/**
 * Middlewares
 */
BaseUserSchema.pre("save", function(done) {
  if (!this.isModified("password")) return done()
  co.wrap(function*() {
    try {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(this.password, salt);
      this.password = hash;
      done();
    } catch (err) {
      done(err);
    }
  }).call(this).then(done);
});

/**
 * Methods
 */
BaseUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
}

/**
 * Statics
 */
BaseUserSchema.statics.passwordMatches = async function (username, password) {
  let user = await this.findOne({ username: username.toLowerCase() }).exec()
  if (!user) return Errors['10001']
  if (await user.comparePassword(password)) return user
  return Errors['10002']
}

BaseUserSchema.statics.userMatches = async function (username, password) {
  let user = await this.findOne({ username: username.toLowerCase() }).exec();
  if (!user) return true
  return Errors['10003']
};

BaseUserSchema.statics.hasUserMatches = async function (username, password) {
  let user = await this.findOne({ username: username.toLowerCase() }).exec();
  if (user) return user
};

// Model creation
mongoose.model("User", BaseUserSchema);
