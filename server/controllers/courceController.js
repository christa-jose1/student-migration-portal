const Course = require("../models/Cource");
const multer = require("multer");
const XLSX = require("xlsx");

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const CourseController = {
  // Create a new course
  async createCourse(req, res) {
    try {
      const { university, place, course, countryCode } = req.body;
      console.log(req.body,"workingggg>>>>>>>>>>>>>>>");
      console.log(university, place, course, countryCode,"gergerger");
      
      

      // Validate required fields
      if (!university || !place || !course || !countryCode) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Create and save the new course
      const newCourse = new Course({ university, place, course, countryCode });
      await newCourse.save();

      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all courses
  async listCourses(req, res) {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get a single course by ID
  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update a course
  async updateCourse(req, res) {
    try {
      const { university, place, course, countryCode } = req.body;
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { university, place, course, countryCode },
        { new: true, runValidators: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete a course
  async deleteCourse(req, res) {
    try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);
      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Bulk upload courses from an Excel file
  async uploadCourses(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const courses = jsonData.map(row => ({
        university: row["University"] || "Unknown",
        place: row["Location"] || "Unknown",
        course: row["Courses Offered"] || "Unknown",
        countryCode: row["Country Code"] || "Unknown"
      }));

      const createdCourses = await Course.insertMany(courses);
      res.status(201).json(createdCourses);
    } catch (error) {
      console.error("Error uploading courses:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// Export the controller along with the multer upload middleware
module.exports = { CourseController, upload };
