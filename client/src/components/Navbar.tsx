// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  HelpCircle,
  Home as HomeIcon,
  LogOut,
  User as UserIcon,
  Cloud,
} from 'lucide-react';
import { Article } from '@mui/icons-material';
import axios from 'axios';
import Weather from './Weather'; // Your Weather component

interface User {
  name: string;
  email: string;
  phone: string;
  countriesChosen: string[];
  courses: string[];
  universities: string[];
  image?: string;
  education?: string; // Changed to a single string field
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
  user: User | null;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${
        isActive
          ? 'text-blue-400 bg-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isAdmin,
  user,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [showWeather, setShowWeather] = useState(false);

  const userId = sessionStorage.getItem('mongoId');

  // Fetch fresh user data when opening profile
  const toggleProfile = async () => {
    try {
      if (!showProfile) {
        const response = await axios.post('http://localhost:5000/api/auth/get-user-by-id', {
          userId,
        });
        console.log('✅ User Data:', response.data);
        setUserData(response.data);
      }
      setShowProfile((prev) => !prev);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  };

  const removeItem = async (
    type: 'course' | 'country' | 'university',
    item: string
  ) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/remove-${type}/${userId}`, {
        [type]: item,
      });

      setUserData((prev) => {
        if (!prev) return prev;
        const key = type === 'country' ? 'countriesChosen' : `${type}s`;
        return {
          ...prev,
          [key]: Array.isArray(prev[key as keyof User])
            ? (prev[key as keyof User] as string[]).filter((i) => i !== item)
            : [],
        };
      });
    } catch (error) {
      console.error(`❌ Error removing ${type}:`, error);
    }
  };

  const goToProfile = () => {
    setActiveTab('profile');
    setShowProfile(false);
  };

  const toggleWeather = () => {
    setShowWeather((prev) => !prev);
  };

  if (isAdmin) return null;

  return (
    <nav className="relative z-[999999] border-b border-blue-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative overflow-x-auto whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              EduConnect
            </span>
          </div>

          <div className="flex items-center space-x-8">
            <NavItem
              icon={<HomeIcon className="w-5 h-5" />}
              label="Home"
              isActive={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
            />

            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Real Time Chat"
              isActive={activeTab === 'forum'}
              onClick={() => setActiveTab('forum')}
            />

            <NavItem
              icon={<Article className="w-5 h-5" />}
              label="Community Forum"
              isActive={activeTab === 'post'}
              onClick={() => setActiveTab('post')}
            />

            <NavItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="FAQ"
              isActive={activeTab === 'faq'}
              onClick={() => setActiveTab('faq')}
            />

            {/* 🌤️ Weather toggle */}
            <button
              onClick={toggleWeather}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-900/20 text-blue-300"
            >
              <Cloud className="w-6 h-6" />
            </button>

            <button
              onClick={toggleProfile}
              className="relative flex items-center space-x-2 px-4 py-2 rounded-md bg-black text-blue-400 font-semibold text-lg bg-clip-text shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 bg-gradient-to-r from-purple-400 to-pink-400 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              <UserIcon className="w-5 h-5 text-blue-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-6 py-2 rounded-md bg-black text-blue-400 bg-clip-text font-semibold text-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 bg-gradient-to-r from-purple-400 to-pink-400 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              <LogOut className="w-5 h-5 text-blue-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🌦️ Weather panel */}
      {showWeather && (
        <div className="absolute top-16 right-20 w-80 bg-gray-900/95 border border-blue-800/40 rounded-md shadow-xl p-4 text-white z-[999999] backdrop-blur-sm">
          <Weather />
        </div>
      )}

      {/* 👤 Profile popup */}
      {showProfile && user && userData && (
        <div className="absolute top-16 right-4 w-80 bg-gray-900/95 border border-gray-700/50 rounded-lg p-6 shadow-xl backdrop-blur-sm text-white z-[999999] max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {userData.image && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={
                      userData.image.startsWith('http')
                        ? userData.image
                        : `http://localhost:5000${userData.image}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h2
                  className="text-xl font-bold cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={goToProfile}
                >
                  {userData.name}
                </h2>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={toggleProfile}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
            </button>
          </div>

          <h3 className="text-xl font-bold mb-4 text-purple-300">Welcome to BrainbridGe!</h3>

          <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-200">Contact Details</h4>
            <p className="text-sm text-gray-300 mb-1">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="text-sm text-gray-300 mb-1">
              <strong>Phone:</strong> {userData.phone}
            </p>
          </div>

          {userData.education && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Education</h4>
              <p className="text-sm text-gray-300 mb-1">
                {userData.education || 'Not specified'}
              </p>
            </div>
          )}

          {userData.countriesChosen.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Countries Chosen</h4>
              <ul className="list-disc pl-5">
                {userData.countriesChosen.map((country, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-300 flex justify-between items-center"
                  >
                    <span>{country}</span>
                    <button
                      onClick={() => removeItem('country', country)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {userData.courses.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Courses</h4>
              <ul className="list-disc pl-5">
                {userData.courses.map((course, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-300 flex justify-between items-center"
                  >
                    <span>{course}</span>
                    <button
                      onClick={() => removeItem('course', course)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {userData.universities.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">
                Universities Selected
              </h4>
              <ul className="list-disc pl-5">
                {userData.universities.map((uni, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-300 flex justify-between items-center"
                  >
                    <span>{uni}</span>
                    <button
                      onClick={() => removeItem('university', uni)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={goToProfile}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              View Full Profile
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
