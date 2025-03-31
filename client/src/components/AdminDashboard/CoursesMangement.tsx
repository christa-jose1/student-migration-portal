import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash, FiUpload } from "react-icons/fi";
import axios from "axios";

interface Course {
  id: string;
  university: string;
  place: string;
  course: string;
  countryCode: string; // Changed to countryCode
}

const API_URL = "http://localhost:5000/api/courses";

const CoursesManagement: React.FC = () => {
  const initialCourse: Partial<Course> = { university: "", place: "", course: "", countryCode: "" };
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>(initialCourse);
  const [showModal, setShowModal] = useState(false);


  const fetchCourses = () => {
    axios.get(API_URL)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  };

  const handleInputChange = (field: keyof Course, value: string) => {
    setNewCourse((prev) => ({ ...prev, [field]: value }));
  };


  const handleAddCourse = () => {
    if (newCourse.university && newCourse.place && newCourse.course && newCourse.countryCode) {
      axios.post(API_URL, newCourse)
        .then((res) => {
          fetchCourses(); // Fetch updated list after adding
          handleCloseModal();
        })
        .catch((err) => console.error("Error adding course:", err));
    }
  };
  
  const handleDeleteCourse = (id: string) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchCourses()) // Fetch updated list after deletion
      .catch((err) => console.error("Error deleting course:", err));
  };
  const handleOpenModal = () => {
    setNewCourse(initialCourse);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setNewCourse(initialCourse);
    setShowModal(false);
  };



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important!
      })
      .then((res) => setCourses([...courses, ...res.data]))
      .catch((err) => console.error("Error uploading courses:", err));
  };

  useEffect(() => {
    fetchCourses(); // Fetch courses when component mounts
  }, []);
  
  return (
    <div className="p-6 rounded-2xl border border-blue-800/30 bg-gradient-to-br from-blue-900/20 to-purple-900/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Courses Management</h2>
        <label className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg cursor-pointer">
          <FiUpload />
          <span>Upload Excel</span>
          <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
        </label>
        <button onClick={handleOpenModal} className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg">
          <FiPlus /> Add Course
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-900/10">
            <tr>
              <th className="px-4 py-3 text-left">University</th>
              <th className="px-4 py-3 text-left">Place</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Country Code</th> {/* Updated */}
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-blue-900/5 transition-colors">
                <td className="px-4 py-3">{course.university}</td>
                <td className="px-4 py-3">{course.place}</td>
                <td className="px-4 py-3">{course.course}</td>
                <td className="px-4 py-3">{course.countryCode}</td> {/* Updated */}
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleDeleteCourse(course._id)} className="text-red-400"><FiTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-300">Add New Course</h3>
            <div className="flex flex-col space-y-4">
              {(["university", "place", "course", "countryCode"] as (keyof Course)[]).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="px-4 py-2 text-black" // Change applied here
                  value={newCourse[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              ))}
              <div className="flex justify-end gap-3">
                <button onClick={handleAddCourse} className="bg-blue-600 px-4 py-2 rounded-lg">Save</button>
                <button onClick={handleCloseModal} className="bg-red-600 px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
