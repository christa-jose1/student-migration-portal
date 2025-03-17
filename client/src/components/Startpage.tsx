import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const StartPage: React.FC = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.jpg')", 
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: false,
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: true,
              speed: 0.2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 30,
            },
            opacity: { value: 0.1 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl flex items-center justify-center font-gluon tracking-widest">
            <span className="text-white">BRAIN</span>    
            <span className="text-yellow-400">BRIDG</span>
          </h1>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl"
          >
            Your gateway to international education opportunities. Empower your journey with insights, support, and personalized guidance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link to="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold shadow-lg transition-all duration-300"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-md bg-transparent border-2 border-yellow-600 text-white font-semibold shadow-lg transition-all duration-300"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <footer className="relative z-10 py-6 text-blue-100 text-sm text-center">
        <p>© {new Date().getFullYear()} BRAINBRIDG. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
};
export default StartPage;