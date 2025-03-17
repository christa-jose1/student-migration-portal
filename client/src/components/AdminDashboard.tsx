import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../backend/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { FiSettings, FiPlus, FiEdit, FiTrash, FiUpload, FiBook, FiUsers, FiBarChart} from "react-icons/fi";

interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: Timestamp;
}

interface Course {
  id: string;
  name: string;
  duration: string;
  cost: string;
  universities: string[];
}

interface University {
  id: string;
  name: string;
  location: string;
  ranking: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Guide {
  id: string;
  fileName: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("userManagement");
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [newUniversity, setNewUniversity] = useState<Partial<University>>({});
  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({});
  const [newGuideName, setNewGuideName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editedCourseName, setEditedCourseName] = useState("");
  const [editedCourseDuration, setEditedCourseDuration] = useState("");
  const [editedCourseCost, setEditedCourseCost] = useState("");
  const [editingUniversityId, setEditingUniversityId] = useState<string | null>(null);
  const [editedUniversityName, setEditedUniversityName] = useState("");
  const [editedUniversityLocation, setEditedUniversityLocation] = useState("");
  const [editedUniversityRanking, setEditedUniversityRanking] = useState("");
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [editedGuideName, setEditedGuideName] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        if (userSnapshot.empty) {
          console.warn("No users found in Firestore.");
        }

        const userList = userSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Fetched user data:", data); 
          return {
            id: doc.id,
            fullName: data["Full Name"],
            email: data["Email address"],
            createdAt:
              data["Created at"] instanceof Timestamp
                ? data["Created at"]
                : Timestamp.now(),
          };
        });

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      onLogout();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.duration && newCourse.cost) {
      setCourses([
        ...courses,
        {
          ...newCourse,
          id: Date.now().toString(),
          universities: [],
        } as Course,
      ]);
      setNewCourse({});
      setIsModalOpen(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setEditedCourseName(course.name);
    setEditedCourseDuration(course.duration);
    setEditedCourseCost(course.cost);
  };

  const handleSaveCourse = (id: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? {
              ...course,
              name: editedCourseName,
              duration: editedCourseDuration,
              cost: editedCourseCost,
            }
          : course
      )
    );
    setEditingCourseId(null);
    setEditedCourseName("");
    setEditedCourseDuration("");
    setEditedCourseCost("");
  };

  const handleCancelEditCourse = () => {
    setEditingCourseId(null);
    setEditedCourseName("");
    setEditedCourseDuration("");
    setEditedCourseCost("");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const handleAddUniversity = () => {
    if (newUniversity.name && newUniversity.location) {
      setUniversities([
        ...universities,
        {
          ...newUniversity,
          id: Date.now().toString(),
          ranking: newUniversity.ranking || "",
        } as University,
      ]);
      setNewUniversity({});
    }
  };

  const handleEditUniversity = (uni: University) => {
    setEditingUniversityId(uni.id);
    setEditedUniversityName(uni.name);
    setEditedUniversityLocation(uni.location);
    setEditedUniversityRanking(uni.ranking);
  };

  const handleSaveUniversity = (id: string) => {
    setUniversities((prev) =>
      prev.map((uni) =>
        uni.id === id
          ? {
              ...uni,
              name: editedUniversityName,
              location: editedUniversityLocation,
              ranking: editedUniversityRanking,
            }
          : uni
      )
    );
    setEditingUniversityId(null);
    setEditedUniversityName("");
    setEditedUniversityLocation("");
    setEditedUniversityRanking("");
  };

  const handleCancelEditUniversity = () => {
    setEditingUniversityId(null);
    setEditedUniversityName("");
    setEditedUniversityLocation("");
    setEditedUniversityRanking("");
  };

  const handleDeleteUniversity = (id: string) => {
    setUniversities((prev) => prev.filter((uni) => uni.id !== id));
  };

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now().toString(),
          question: newFAQ.question,
          answer: newFAQ.answer,
        } as FAQ,
      ]);
      setNewFAQ({});
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQId(faq.id);
    setEditedQuestion(faq.question);
    setEditedAnswer(faq.answer);
  };

  const handleSaveFAQ = (id: string) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id
          ? { ...faq, question: editedQuestion, answer: editedAnswer }
          : faq
      )
    );
    setEditingFAQId(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };

  const handleCancelEditFAQ = () => {
    setEditingFAQId(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleAddGuide = () => {
    if (newGuideName.trim()) {
      setGuides([
        ...guides,
        { id: Date.now().toString(), fileName: newGuideName },
      ]);
      setNewGuideName("");
      setIsGuideModalOpen(false);
    }
  };

  const handleEditGuide = (guide: Guide) => {
    setEditingGuideId(guide.id);
    setEditedGuideName(guide.fileName);
  };

  const handleSaveGuide = (id: string) => {
    setGuides((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, fileName: editedGuideName } : g
      )
    );
    setEditingGuideId(null);
    setEditedGuideName("");
  };

  const handleCancelEditGuide = () => {
    setEditingGuideId(null);
    setEditedGuideName("");
  };

  const handleDeleteGuide = (id: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex">
      <motion.nav
        className="w-64 bg-gradient-to-b from-blue-900/30 to-purple-900/10 p-6 border-r border-blue-800/20"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <FiSettings className="text-blue-400 text-xl" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Portal
          </h1>
        </div>

        <nav className="space-y-4">
          {[
            { id: "userManagement", icon: <FiUsers />, label: "User Management" },
            { id: "courses", icon: <FiBook />, label: "Courses & Universities" },
            { id: "faq", icon: <FiUsers />, label: "FAQ Management" },
            { id: "guides", icon: <FiUpload />, label: "Country Guides" },
            { id: "analytics", icon: <FiBarChart />, label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600/20 text-blue-400 shadow-blue-500/20"
                  : "hover:bg-blue-900/10 hover:text-blue-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-600/20 text-red-400"
          >
            Logout
          </button>
        </nav>
      </motion.nav>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "userManagement" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="content"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              User Details
            </h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="user-table w-full">
                <thead className="bg-blue-900/10">
                  <tr>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Email Address</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-900/5 transition-colors"
                    >
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        {user.createdAt.toDate().toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={async () => {
                            await deleteDoc(doc(db, "users", user.id));
                            setUsers(users.filter((u) => u.id !== user.id));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}

        {activeTab === "courses" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                  Courses Management
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
                >
                  <FiPlus /> Add Course
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-900/10">
                    <tr>
                      <th className="px-4 py-3 text-left">Course Name</th>
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-left">Cost</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-blue-900/5 transition-colors"
                      >
                        {editingCourseId === course.id ? (
                          <>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={editedCourseName}
                                onChange={(e) =>
                                  setEditedCourseName(e.target.value)
                                }
                                className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={editedCourseDuration}
                                onChange={(e) =>
                                  setEditedCourseDuration(e.target.value)
                                }
                                className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={editedCourseCost}
                                onChange={(e) =>
                                  setEditedCourseCost(e.target.value)
                                }
                                className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                              />
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => handleSaveCourse(course.id)}
                                className="text-green-400 hover:text-green-300"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEditCourse}
                                className="text-red-400 hover:text-red-300"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3">{course.name}</td>
                            <td className="px-4 py-3">{course.duration}</td>
                            <td className="px-4 py-3">{course.cost}</td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FiTrash />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-blue-300">
                      Add New Course
                    </h3>
                    <div className="flex flex-col space-y-4">
                      <input
                        type="text"
                        placeholder="Course Name"
                        className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        value={newCourse.name || ""}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, name: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        value={newCourse.duration || ""}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            duration: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Cost"
                        className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        value={newCourse.cost || ""}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, cost: e.target.value })
                        }
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={handleAddCourse}
                          className="bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setNewCourse({});
                          }}
                          className="bg-red-600/30 hover:bg-red-600/50 px-4 py-2 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-6 rounded-2xl border border-purple-800/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-400">
                  Universities Management
                </h2>
                <button
                  onClick={handleAddUniversity}
                  className="flex items-center gap-2 bg-purple-600/30 hover:bg-purple-600/50 px-4 py-2 rounded-lg transition-all"
                >
                  <FiPlus /> Add University
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="University Name"
                  className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  value={newUniversity.name || ""}
                  onChange={(e) =>
                    setNewUniversity({ ...newUniversity, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  value={newUniversity.location || ""}
                  onChange={(e) =>
                    setNewUniversity({
                      ...newUniversity,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Ranking (optional)"
                  className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  value={newUniversity.ranking || ""}
                  onChange={(e) =>
                    setNewUniversity({
                      ...newUniversity,
                      ranking: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universities.map((uni) => (
                  <div
                    key={uni.id}
                    className="p-4 bg-black/20 rounded-xl border border-blue-800/30 hover:border-blue-500 transition-all"
                  >
                    {editingUniversityId === uni.id ? (
                      <>
                        <input
                          type="text"
                          value={editedUniversityName}
                          onChange={(e) =>
                            setEditedUniversityName(e.target.value)
                          }
                          className="bg-transparent text-lg font-semibold w-full border-b border-blue-600/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editedUniversityLocation}
                          onChange={(e) =>
                            setEditedUniversityLocation(e.target.value)
                          }
                          className="bg-transparent text-sm text-blue-300 w-full border-b border-blue-600/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editedUniversityRanking}
                          onChange={(e) =>
                            setEditedUniversityRanking(e.target.value)
                          }
                          className="bg-transparent text-sm text-purple-400 w-full border-b border-blue-600/50 focus:outline-none"
                          placeholder="Ranking"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveUniversity(uni.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditUniversity}
                            className="text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{uni.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUniversity(uni)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUniversity(uni.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-blue-300">{uni.location}</p>
                        <div className="mt-2 text-sm text-purple-400">
                          Ranking: {uni.ranking}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400">
                FAQ Management
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New FAQ Question"
                  className="bg-black/30 border border-blue-800/30 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={newFAQ.question || ""}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, question: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="New FAQ Answer"
                  className="bg-black/30 border border-blue-800/30 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={newFAQ.answer || ""}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, answer: e.target.value })
                  }
                />
                <button
                  onClick={handleAddFAQ}
                  className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
                >
                  <FiPlus />
                  Add FAQ
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => {
                const isEditing = editingFAQId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="p-4 bg-black/20 rounded-xl border border-blue-800/30"
                  >
                    {isEditing ? (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <input
                            type="text"
                            value={editedQuestion}
                            onChange={(e) => setEditedQuestion(e.target.value)}
                            className="bg-transparent text-lg font-semibold w-full border-b border-blue-600/50 focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveFAQ(faq.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditFAQ}
                              className="text-red-400 hover:text-red-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={editedAnswer}
                          onChange={(e) => setEditedAnswer(e.target.value)}
                          className="bg-transparent text-blue-300 w-full h-32 resize-none border-b border-blue-600/50 focus:outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-lg font-semibold">
                            {faq.question}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditFAQ(faq)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </div>
                        <p className="text-blue-300">{faq.answer}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "guides" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400">
                Country Guides
              </h2>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
              >
                <FiUpload /> Upload Guide
              </button>
            </div>

            <div className="border-2 border-dashed border-blue-800/30 rounded-xl p-8 text-center hover:border-blue-500 transition-all">
              <div className="text-blue-400 mb-2">
                <FiUpload className="text-3xl mx-auto" />
              </div>
              <p className="text-blue-300">
                Drag & drop files here or click to upload
              </p>
              <p className="text-sm text-blue-400/60 mt-2">
                PDF, DOCX (Max 50MB)
              </p>
            </div>

            {isGuideModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4 text-blue-300">
                    Upload New Guide
                  </h3>
                  <input
                    type="text"
                    placeholder="Guide File Name"
                    value={newGuideName}
                    onChange={(e) => setNewGuideName(e.target.value)}
                    className="bg-black/30 border border-blue-800/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full mb-4"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleAddGuide}
                      className="bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => {
                        setIsGuideModalOpen(false);
                        setNewGuideName("");
                      }}
                      className="bg-red-600/30 hover:bg-red-600/50 px-4 py-2 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              {guides.map((guide) => {
                const isEditing = editingGuideId === guide.id;
                return (
                  <div
                    key={guide.id}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-blue-900/10 transition-all"
                  >
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editedGuideName}
                          onChange={(e) => setEditedGuideName(e.target.value)}
                          className="bg-transparent border-b border-blue-600/50 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveGuide(guide.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditGuide}
                            className="text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <FiBook className="text-blue-400" />
                          <span>{guide.fileName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditGuide(guide)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteGuide(guide.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30 space-y-8"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              User Login & Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Total Students</div>
                <div className="text-2xl font-bold">{users.length}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Active Logins</div>
                <div className="text-2xl font-bold">N/A</div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-gray-400">New Registrations</div>
                <div className="text-2xl font-bold">N/A</div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Pending Approvals</div>
                <div className="text-2xl font-bold">N/A</div>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="text-xl font-bold mb-4">User Login Details</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-900/10">
                    <tr>
                      <th className="px-4 py-3 text-left">Student Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Last Login</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-blue-900/5 transition-colors"
                      >
                        <td className="px-4 py-3">{user.fullName}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">N/A</td>
                        <td className="px-4 py-3 text-green-400">Active</td>
                        <td className="px-4 py-3">Student</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;