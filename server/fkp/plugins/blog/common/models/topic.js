// "use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var config = CONFIG.db


var BaseTopicSchema = new Schema({
    title: { type: String },
    content: { type: String },
    img: { type: String },
    cats: { type: String, default: '默认'},
    tags: [String],
    user: {
        id: { type: String },
        author_id: { type: String },
        username: { type: String },
        nickname: { type: String },
        avatar: { type: String }
    },
    create_at: { type: String, default: (new Date().getTime()) },  //创建时间
    update_at: { type: String, default: (new Date().getTime()) }
});

BaseTopicSchema.index({tags: 1})
BaseTopicSchema.index({title: 1})

/**
 * Middlewares
 */
var topic_profile = require('./catoray/topic_profile')
BaseTopicSchema.plugin(topic_profile);

BaseTopicSchema.methods.userMatches = async function (user) {
    var this_user = this.user.username.toString();
    var that_user = user.username.toString()
    if (this_user === that_user) return true
    // var topic = yield this.findOne({ _id: topic_id }).exec();
    // if (!topic) {
    //     return Errors['10003'];
    // }
    // return topic;
}

BaseTopicSchema.statics.topicList = async function (start, end, options) {
    let query = {deleted: false}
    let pageSize = config.mongo.pageSize
    if (!start) start = 0;
    end = pageSize
    // if (!end) end = pageSize
    // if (tag && typeof tag==='string') query.tags = decodeURI(tag)
    // if (cat && typeof cat==='string') query.cats = cat
    let $query = this.find(query,'title _id tags create_at update_at img user visit_count',{skip:start, limit:end, sort: {update_at: -1, create_at: -1} })
    return await $query.exec()
}

//获取topic
BaseTopicSchema.statics.topicMatchesId = async function (topic_id) {
  console.log('匹配文章id-----------');
  var topic = await this.findOne({ _id: topic_id }).exec();
  return (topic||Errors['20004'])
}

//topic的count
BaseTopicSchema.statics.topicCount = async function (topic_id) {
  console.log('文章浏览计数-----------');
  var topic = await this.findOne({ _id: topic_id }).exec();
  if (!topic) return Errors['20004']
  var _count = topic.visit_count
  var stat = {
    $set: {
      visit_count: _count+1
    }
  }
  return await BaseTopicSchema.update({ _id: topic_id }, stat, {}).exec()
};

BaseTopicSchema.statics.deletTopicMatchesId = async function (topic_id, user) {
  console.log('删除文章----------');
  try {
    var topic = await this.findOne({ _id: topic_id }).exec()
    if (!topic) return Errors['20004']
    else {
      if (await topic.userMatches(user)) return await BaseTopicSchema.remove({ _id: topic_id }).exec()
      return Errors['20003']
    }
  } catch (e) {
    console.log(e);
  }
};

BaseTopicSchema.statics.updateTopicMatchesId = async function (topic_id, body, user) {
  try {
    var topic = await this.findOne({ _id: topic_id }).exec();
    if (!topic) return Errors['20004']
    else {
      if (await topic.userMatches(user)) {
        body.update_at = new Date().getTime()
        return await this.update({ _id: topic_id }, body, {}).exec()
      }
      return Errors['20003'];
    }
  } catch (e) {
    console.log(e)
  }
}

// Model creation
mongoose.model("Topic", BaseTopicSchema);
