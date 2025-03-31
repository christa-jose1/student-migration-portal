import React, { useState } from 'react';
import { GraduationCap, Users, HelpCircle, Home as HomeIcon, LogOut, User as UserIcon } from 'lucide-react';
import { Article } from '@mui/icons-material';

interface User {
  name: string;
  email: string;
  phone: string;
  countriesChosen: string[];
  courses: string[];
  universities: string[];
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
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${isActive
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
  user
}) => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (isAdmin) return null;

  return (
    <nav className="relative z-[999999] border-b border-blue-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
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
              label="Community Forum"
              isActive={activeTab === 'forum'}
              onClick={() => setActiveTab('forum')}
            />

            <NavItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="FAQ"
              isActive={activeTab === 'faq'}
              onClick={() => setActiveTab('faq')}
            />
            <NavItem
              icon={<Article className="w-5 h-5" />}
              label="Posts"
              isActive={activeTab === "post"}
              onClick={() => setActiveTab("post")}
            />
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

      {showProfile && user && (
        <div className="absolute top-16 right-4 w-80 bg-gray-900/95 border border-gray-700/50 rounded-lg p-6 shadow-xl backdrop-blur-sm text-white z-[999999]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <button onClick={toggleProfile} className="text-gray-400 hover:text-gray-300 transition-colors">
              ✕
            </button>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-purple-300">Welcome to EduConnect!</h3>

          <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-200">Contact Details</h4>
            <p className="text-sm text-gray-300 mb-1">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-300 mb-1">
              <strong>Phone:</strong> {user.phone}
            </p>
          </div>

          {user.countriesChosen.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Countries Chosen</h4>
              <ul className="list-disc pl-5">
                {user.countriesChosen.map((country, index) => (
                  <li key={index} className="text-sm text-gray-300">{country}</li>
                ))}
              </ul>
            </div>
          )}

          {user.courses.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Courses</h4>
              <ul className="list-disc pl-5">
                {user.courses.map((course, index) => (
                  <li key={index} className="text-sm text-gray-300">{course}</li>
                ))}
              </ul>
            </div>
          )}

          {user.universities.length > 0 && (
            <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2 text-gray-200">Universities Selected</h4>
              <ul className="list-disc pl-5">
                {user.universities.map((uni, index) => (
                  <li key={index} className="text-sm text-gray-300">{uni}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;