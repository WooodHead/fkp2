let libs = require('libs')
let mongoose = require("mongoose")
let Topic = mongoose.model('Topic')

async function updateTopic(ctx, param) {
  if (method === 'POST') {
    try {
      let _user = false
      let body = param.body

      if (this.session.$user) _user = this.session.$user
      if (!_user) return Errors['10005']

      let parsedMd = await ctx.fkp().markdown(body.cnt, {mdcontent:{}})
      let _tags = parsedMd.mdcontent.tags||parsedMd.mdcontent.tag;

      if (!parsedMd.mdcontent.title){
        return Errors['10006'];
      }

      if (!parsedMd.mdcontent.desc){
        return Errors['10006'];
      }

      _tags = _tags.split(',')
      let utopic = {
        title: parsedMd.mdcontent.title,
        content: body.cnt,
        img: parsedMd.mdcontent.img,
        cats: parsedMd.mdcontent.cats,
        tags: _tags
      }

      let upstat = await Topic.updateTopicMatchesId(body.topic, {$set: utopic}, _user)
      if (upstat.error) return upstat
      return Errors.success
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  getData : updateTopic
}
