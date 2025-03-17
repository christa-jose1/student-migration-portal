import { motion } from 'framer-motion';
import { FiDownload, FiCheckCircle, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import React from 'react';

const Canadapage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  const universities = [
    { name: 'University of Toronto', location: 'Ontario', ranking: '#1' },
    { name: 'University of British Columbia', location: 'British Columbia', ranking: '#2' },
    { name: 'McGill University', location: 'Quebec', ranking: '#3' },
  ];

  const requirements = [
    'Valid Passport',
    'Academic Transcripts',
    'English/French Proficiency Proof',
    'Financial Documentation',
    'Letter of Acceptance',
  ];

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
            Study in Canada
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Experience world-class education in one of the most welcoming countries with excellent career opportunities.
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

        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
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
      </div>
    </div>
  );
};
export default Canadapage;