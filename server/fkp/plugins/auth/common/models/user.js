// "use strict";
let fs = require('fs')
let $path = require('path')
let bcrypt = require('bcryptjs')
let mongoose = require("mongoose")
let Increase = mongoose.model('Increase')
let Schema = mongoose.Schema

let BaseUserSchema = new Schema({
  id: { type: String, required: true, unique: true, lowercase: false },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  status: {type: Number, default: 1},  // 预定义 0: 失效, 1: 有效, 10000: super
  accessToken: {type: String}
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.password;
      delete ret.__v;
      // delete ret._id;
      // delete ret.create_at;
      // delete ret.update_at;
    }
  }
})

/**
* Index 索引
*/
BaseUserSchema.index({username: 1}, {unique: true})
BaseUserSchema.index({accessToken: 1})

/**
 * Middlewares
 */
 BaseUserSchema.plugin(require('./catoray/user_profile'))
 BaseUserSchema.plugin(require('./catoray/user_from'))
 BaseUserSchema.plugin(require('./catoray/user_level'))
 BaseUserSchema.plugin(require('./catoray/user_privilege'))

/**
 * Middlewares
 */
BaseUserSchema.pre("save", async function(done) {
  if (this.isNew) {
    this.gid = this._id.toString()
    this.gpassword = '123456'
    this.groups = ['10', '20', '30', '40', '50', this._id.toString()]
    const $inc = await Increase.findByIdAndUpdate({_id: 'Increase'}, {$inc: { u_seq: 1} }).exec()
  }
  if (!this.isModified("password")) return done()
  try {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    done();
  } catch (err) {
    done(err);
  }
  done()
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
  let user = await this.findOne({ username: username }).exec()
  if (!user) return Errors['10001']
  if (await user.comparePassword(password)) return user
  return Errors['10002']
}

BaseUserSchema.statics.userMatches = async function (username, password) {
  return await this.findOne({ username: username }).exec();
  // return Errors['10003']
};


// Model creation
mongoose.model("User", BaseUserSchema);
