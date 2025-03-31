const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  university: { type: String, required: true },
  place: { type: String, required: true },
  course: { type: String, required: true },
  countryCode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
