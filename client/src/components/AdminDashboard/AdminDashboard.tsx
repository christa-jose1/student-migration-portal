import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../backend/firebase'; 
import UserManagement from './UserManagement';
import CoursesManagement from './CoursesMangement';
import UniversitiesManagement from './UniversitiesManagement';
import FAQManagement from './FAQManagement';
import GuidesManagement from '../AdminDashboard/GuidesManagement';
import Sidebar from './Sidebar';
import Analytics from './Analytics';

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "userManagement" && <UserManagement />}
        {activeTab === "courses" && <CoursesManagement />}
        {activeTab === "universities" && <UniversitiesManagement />}
        {activeTab === "faq" && <FAQManagement />}
        {activeTab === "guides" && <GuidesManagement />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
};

export default AdminDashboard;