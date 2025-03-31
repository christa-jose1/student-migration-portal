const express = require("express");
const { CourseController, upload } = require("../controllers/courceController");
const Course = require("../models/Cource"); // Ensure correct filename

const router = express.Router();

// Function to categorize courses by subject
const categorizeCourses = (courses) => {
  const subjects = {};

  courses.forEach((course) => {
    const { university, course: courseName, duration = "Varies", cost = "Unknown" } = course;

    let subjectCategory = "Other";
    if (courseName.toLowerCase().includes("computer") || courseName.toLowerCase().includes("engineering")) {
      subjectCategory = "Engineering & Technology";
    } else if (courseName.toLowerCase().includes("business") || courseName.toLowerCase().includes("mba")) {
      subjectCategory = "Business & Management";
    }

    if (!subjects[subjectCategory]) {
      subjects[subjectCategory] = { subject: subjectCategory, courses: [] };
    }

    let courseObj = subjects[subjectCategory].courses.find(c => c.name === courseName);
    if (!courseObj) {
      courseObj = { name: courseName, duration, cost, universities: [] };
      subjects[subjectCategory].courses.push(courseObj);
    }

    // Ensure universities are unique
    if (!courseObj.universities.includes(university)) {
      courseObj.universities.push(university);
    }
  });

  return Object.values(subjects);
};

// Function to categorize courses by country
const categorizeByCountry = (courses) => {
  const countries = {};

  courses.forEach((course) => {
    const { countryCode } = course;
    if (!countryCode) return;

    // Extract country prefix (e.g., "AU_1" → "AU")
    const countryPrefix = countryCode.split("_")[0].toUpperCase();

    if (!countries[countryPrefix]) {
      countries[countryPrefix] = { country: countryPrefix, subjects: [] };
    }

    // Categorize all courses for this country
    const categorizedCourses = categorizeCourses([course]);

    categorizedCourses.forEach((subject) => {
      let existingSubject = countries[countryPrefix].subjects.find(s => s.subject === subject.subject);
      if (!existingSubject) {
        countries[countryPrefix].subjects.push(subject);
      } else {
        subject.courses.forEach((newCourse) => {
          let existingCourse = existingSubject.courses.find(c => c.name === newCourse.name);
          if (!existingCourse) {
            existingSubject.courses.push(newCourse);
          } else {
            existingCourse.universities.push(...newCourse.universities.filter(u => !existingCourse.universities.includes(u)));
          }
        });
      }
    });
  });

  return Object.values(countries);
};

// API to fetch categorized courses by country
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses
    const categorizedCourses = categorizeByCountry(courses); // Categorize courses by country
    res.status(200).json(categorizedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-all", async (req, res) => {
    try {
      const result = await Course.deleteMany({}); // Deletes all courses
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No courses found to delete" });
      }
  
      res.status(200).json({ 
        message: "All courses deleted successfully", 
        deletedCount: result.deletedCount 
      });
  
    } catch (error) {
      console.error("Error deleting all courses:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
// Course CRUD Routes
router.post("/", CourseController.createCourse); // Create course
router.get("/", CourseController.listCourses); // Get all courses
router.get("/:id", CourseController.getCourseById); // Get single course
router.put("/:id", CourseController.updateCourse); // Update course
router.delete("/:id", CourseController.deleteCourse); // Delete course
router.post("/upload", upload.single("file"), CourseController.uploadCourses); // Upload Excel file

module.exports = router;
