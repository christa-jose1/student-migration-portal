import React from 'react';
import { FiSettings, FiUsers, FiBook, FiUpload, FiBarChart } from 'react-icons/fi';

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; onLogout: () => void; }> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <nav className="w-64 bg-gradient-to-b from-blue-900/30 to-purple-900/10 p-6 border-r border-blue-800/20">
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
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-600/20 text-red-400"
        >
          Logout
        </button>
      </nav>
    </nav>
  );
};

export default Sidebar;