// "use strict";
let mongoose = require("mongoose")
let Schema = mongoose.Schema

let FavoriteSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, required: true }, // user id
    type: {type: String}, //喜欢的类型，如article/author/other
    favorite: {
      id: {type: Schema.Types.ObjectId, required: true}, // article/author/   id
      title: {type: String},
      desc: {type: String},
      username: {type: String},
      nickname: {type: String},
      url: {type: String}
    }
  }, {id: false}
)
FavoriteSchema.index({uid: 1})
FavoriteSchema.index({type: 1})

FavoriteSchema.pre("save", async function(next) {
  // if favorite author then update author'follower and self's following
})

// Model creation
mongoose.model("Favorite", FavoriteSchema);
