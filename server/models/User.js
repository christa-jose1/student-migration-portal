//model/User.js
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Ensure name can be saved
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true }, // Firebase UID
  role: { type: String, enum: ["user", "admin"], default: "user" },
  
  // Add missing fields
  phone: { type: String, default: "" },
  // Updated education field (single string instead of object)
  education: {type: String,default: ""},
  countriesChosen: { type: [String], default: [] }, // Array of country names
  courses: { type: [String], default: [] }, // Array of course names
  universities: { type: [String], default: [] }, // Array of university names
  image: { type: String, default: "" } 
});


module.exports = mongoose.model("User", userSchema);


