import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import Forum from './components/Forum';
import FAQ from './components/FAQ';
import HomePage from './components/Home';
import Usapage from './components/Usapage';
import Ukpage from './components/Ukpage';
import Canadapage from './components/Canadapage';
import Australiapage from './components/AustraliaPage';
import Germanypage from './components/Germanypage';
import NetworkAnimation from './components/NetworkAnimation';
import StartPage from './components/Startpage';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  countriesChosen: string[];
  courses: string[];
  universities: string[];
}

function App() {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, isAdmin: false });
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Auth state:", auth);
  }, [auth]);

  const handleSignIn = (isAdmin: boolean) => {
    console.log("Signing in as:", isAdmin ? "Admin" : "User");

    const normalUser: User = {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '9876543210',
      countriesChosen: ['UK', 'Australia'],
      courses: ['Business Administration', 'Marketing'],
      universities: ['University of Oxford', 'University of Melbourne']
    };

    const adminUser: User = {
      name: 'Admin Lisa',
      email: 'admin.lisa@example.com',
      phone: '1234567890',
      countriesChosen: [],
      courses: [],
      universities: []
    };

    setAuth({ isAuthenticated: true, isAdmin });
    setUser(isAdmin ? adminUser : normalUser);
  };

  const handleSignUp = () => {
    const newUser: User = {
      name: 'New SignUp User',
      email: 'signup.user@example.com',
      phone: '5555555555',
      countriesChosen: ['Canada'],
      courses: ['Computer Science'],
      universities: ['University of Toronto']
    };

    setAuth({ isAuthenticated: true, isAdmin: false });
    setUser(newUser);
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, isAdmin: false });
    setUser(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'forum':
        return <Forum />;
      case 'faq':
        return <FAQ />;
      default:
        return <HomePage />;
    }
  };

  const ProtectedRoute = ({
    children,
    showNavbar = true,
    requireAdmin = false
  }: {
    children: React.ReactNode;
    showNavbar?: boolean;
    requireAdmin?: boolean;
  }) => {
    if (!auth.isAuthenticated) return <Navigate to="/signin" replace />;
    if (requireAdmin && !auth.isAdmin) return <Navigate to="/dashboard" replace />;

    return (
      <div className="min-h-screen relative z-10">
        {showNavbar && (
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
              isAdmin={auth.isAdmin}
              user={user}
            />
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <div>
      <NetworkAnimation />

      <div className="min-h-screen text-gray-900 dark:text-gray-100 relative z-10">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route
            path="/signin"
            element={
              auth.isAuthenticated
                ? <Navigate to={auth.isAdmin ? "/admin-dashboard" : "/dashboard"} replace />
                : <SignIn onSignIn={handleSignIn} />
            }
          />
          <Route
            path="/signup"
            element={
              auth.isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <SignUp onSignUp={handleSignUp} />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <main className="container mx-auto px-4 py-8">{renderContent()}</main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/usa"
            element={
              <ProtectedRoute showNavbar={false}>
                <Usapage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/uk"
            element={
              <ProtectedRoute showNavbar={false}>
                <Ukpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/canada"
            element={
              <ProtectedRoute showNavbar={false}>
                <Canadapage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/australia"
            element={
              <ProtectedRoute showNavbar={false}>
                <Australiapage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/germany"
            element={
              <ProtectedRoute showNavbar={false}>
                <Germanypage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;