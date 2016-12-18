// "use strict";
let mongoose = require("mongoose")
let Schema = mongoose.Schema

let FollowSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, required: true }, // user id
    follower: {
      id: {type: Schema.Types.ObjectId},
      username: {type: String, default: ''},
      nickname: {type: String, default: ''}
    },
    following: {
      id: {type: Schema.Types.ObjectId},
      username: {type: String, default: ''},
      nickname: {type: String, default: ''}
    },
  }, {id: false}
)
FollowSchema.index({uid: 1})

// Model creation
mongoose.model("Follow", FollowSchema);
