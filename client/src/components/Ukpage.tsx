import { motion } from 'framer-motion';
import { FiDownload, FiCheckCircle, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UKPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses/courses");
        const usData = response.data.find((item) => item.country === "UK");
        setSubjects(usData ? usData.subjects : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);
  // const handleDownload = () => {
  //   setIsDownloading(true);
  //   setTimeout(() => setIsDownloading(false), 2000);
  // };
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
  
      // Fetch the guide data
      const response = await axios.get("http://localhost:5000/api/guides/guides/GB");
  
      if (!response.data || response.data.length === 0) {
        throw new Error("No guides found for this country.");
      }
  
      const guide = response.data[0]; 
      let fileUrl = guide.fileUrl.startsWith("http") ? guide.fileUrl : `http://localhost:5000${guide.fileUrl}`;
  
      console.log("Original File URL:", fileUrl);
  
      // Encode the URL to handle special characters
      fileUrl = encodeURI(fileUrl);
      console.log("Encoded File URL:", fileUrl);
  
      // Fetch file from the server
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) throw new Error(`Failed to fetch file. Server responded with ${fileResponse.status}`);
  
      const blob = await fileResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
  
      // Create and trigger a download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = guide.fileName || "downloaded_file.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading guide:", error);
      setIsDownloading(false);
    }
  };
  
  const universities = [
    { name: 'University of Oxford', location: 'Oxford', ranking: '#1' },
    { name: 'University of Cambridge', location: 'Cambridge', ranking: '#2' },
    { name: 'Imperial College London', location: 'London', ranking: '#3' },
  ];

  const requirements = [
    'Valid Passport',
    'Academic Transcripts',
    'English Proficiency Proof (IELTS/TOEFL)',
    'Financial Documentation',
    'Letter of Offer from University',
  ];

  //   {
  //     subject: 'Engineering & Technology',
  //     courses: [
  //       {
  //         name: 'Computer Science',
  //         duration: '3 years',
  //         cost: '$35k/yr',
  //         universities: ['University of Oxford', 'Imperial College London'],
  //       },
  //       {
  //         name: 'Civil Engineering',
  //         duration: '4 years',
  //         cost: '$33k/yr',
  //         universities: ['University of Cambridge', 'Imperial College London'],
  //       },
  //     ],
  //   },
  //   {
  //     subject: 'Business & Management',
  //     courses: [
  //       {
  //         name: 'MBA',
  //         duration: '1 year',
  //         cost: '$50k/yr',
  //         universities: ['University of Oxford', 'University of Cambridge'],
  //       },
  //       {
  //         name: 'Economics',
  //         duration: '3 years',
  //         cost: '$38k/yr',
  //         universities: ['Imperial College London', 'University of Oxford'],
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/10 pointer-events-none" />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors z-10"
      >
        <FiArrowLeft className="text-xl" />
        <span>Back to Home</span>
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Study in the UK
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            A globally recognized hub for education, home to prestigious universities and diverse career opportunities.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className={`mt-8 px-8 py-3 rounded-lg font-semibold transition-all ${
              isDownloading
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiDownload className="text-xl" />
              {isDownloading ? 'Preparing Guide...' : 'Download Full Guide'}
            </div>
          </motion.button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-400">Visa Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req, index) => (
              <motion.div
                key={req}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-blue-900/50 to-blue-900/20 rounded-xl border border-blue-800/50"
              >
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-blue-400 text-xl" />
                  <span className="text-lg">{req}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-purple-400">Top Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {universities.map((uni, index) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-1 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="bg-black p-6 rounded-xl h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{uni.name}</h3>
                    <FiStar className="text-yellow-400" />
                  </div>
                  <p className="text-blue-300 mb-2">{uni.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 text-sm">World Ranking</span>
                    <span className="text-blue-400 font-mono">{uni.ranking}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-blue-400">Popular Courses by Subject</h2> <input
              type="text"
              placeholder="Search for courses..."
              className="w-full p-3 mb-6 text-black rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="space-y-16">
              {/* {subjects.map((subject, index) => (
              <motion.div key={subject.subject} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-bold mb-6 text-purple-400">{subject.subject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subject.courses.map((course) => (
                    <motion.div key={course.name} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="p-6 bg-blue-900/20 rounded-xl border border-blue-800/50 hover:border-blue-500 transition-all">
                      <h3 className="text-lg font-semibold mb-3">{course.name}</h3>
                      <div className="flex justify-between text-sm text-blue-300 mb-4">
                        <span>Duration: {course.duration}</span>
                        <span>Cost: {course.cost}</span>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blue-300 mb-2">Offered By:</h4>
                        {course.universities.map((uniName) => (
                          <div key={uniName} className="flex items-center gap-2 text-sm text-blue-200">
                            <FiStar className="text-yellow-400 flex-shrink-0" />
                            <span className="truncate">{uniName}</span>
                          </div>
                        ))}
                      </div>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg transition-all">
                        Explore Programs
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))} */}
              {subjects && subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <motion.div key={subject.subject || index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                    <h3 className="text-2xl font-bold mb-6 text-purple-400">{subject.subject}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subject.courses
                        ?.filter((course) => course?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((course) => (
                          <motion.div key={course.name} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="p-6 bg-blue-900/20 rounded-xl border border-blue-800/50 hover:border-blue-500 transition-all">
                            <h3 className="text-lg font-semibold mb-3">{course.name}</h3>
                            <div className="flex justify-between text-sm text-blue-300 mb-4">
                              <span>Duration: {course.duration}</span>
                              <span>Cost: {course.cost}</span>
                            </div>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg transition-all">
                              Explore Programs
                            </motion.button>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">No courses found.</p>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
export default UKPage;