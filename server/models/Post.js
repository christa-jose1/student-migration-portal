const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  category: {type:String, enum:["Accomadation","Education","Visa"]}, 
  content: String
}, { timestamps: true });

module.exports = mongoose.model("Posts", postsSchema);
