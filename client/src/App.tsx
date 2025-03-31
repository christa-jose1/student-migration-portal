import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Forum from "./components/Forum";
import FAQ from "./components/FAQ";
import HomePage from "./components/Home";
import Usapage from "./components/Usapage";
import Ukpage from "./components/Ukpage";
import Canadapage from "./components/Canadapage";
import Australiapage from "./components/AustraliaPage";
import Germanypage from "./components/Germanypage";
import NetworkAnimation from "./components/NetworkAnimation";
import StartPage from "./components/Startpage";
import { auth, db } from "./backend/firebase";
import { onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword } from "firebase/auth";
import UsersPage from "./components/ViewUsers";
import { doc, setDoc } from "firebase/firestore";
import Post from "./components/Post";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  mongoId?: string; // Add MongoDB _id
}

export interface User {
  name: string;
  email: string;
  phone: string;
  gitid?: string;
  countriesChosen: string[];
  courses: string[];
  universities: string[];
  mongoId?: string; // Add MongoDB _id to User
}

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
  });
  const [activeTab, setActiveTab] = useState<string>("home");
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(
  //     auth,
  //     async (firebaseUser: FirebaseUser | null) => {
  //       if (firebaseUser) {
  //         const email = firebaseUser.email || "";
  //         const isAdmin = email === "admin@gmail.com";

  //         // Check MongoDB for user
  //         try {
  //           const response = await axios.post(
  //             "http://localhost:5000/api/auth/check-user",
  //             {
  //               uid: firebaseUser.uid,
  //             }
  //           );
  //           const mongoId = response.data._id;

  //           setAuthState({ isAuthenticated: true, isAdmin, mongoId });
  //           sessionStorage.setItem("mongoId", mongoId);

  //           const loggedInUser: User = isAdmin
  //             ? {
  //                 name: "Admin Lisa",
  //                 email,
  //                 phone: "1234567890",
  //                 countriesChosen: [],
  //                 courses: [],
  //                 universities: [],
  //                 mongoId,
  //               }
  //             : {
  //                 name: firebaseUser.displayName || "User",
  //                 email,
  //                 phone: "",
  //                 countriesChosen: [],
  //                 courses: [],
  //                 universities: [],
  //                 mongoId,
  //               };

  //           setUser(loggedInUser);
  //         } catch (error) {
  //           console.error("MongoDB check failed:", error);
  //           setAuthState({ isAuthenticated: false, isAdmin: false });
  //           setUser(null);
  //           sessionStorage.removeItem("mongoId");
  //         }
  //       } else {
  //         setAuthState({ isAuthenticated: false, isAdmin: false });
  //         setUser(null);
  //         sessionStorage.removeItem("mongoId");
  //       }
  //     }
  //   );

  //   // Check session storage on mount
  //   const mongoId = sessionStorage.getItem("mongoId");
  //   if (mongoId && !authState.isAuthenticated) {
  //     // Optionally verify session with backend if needed
  //   }

  //   return () => unsubscribe();
  // }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/check-user", {
            uid: firebaseUser.uid,
          });
  
          const mongoId = response.data._id;
          const role = response.data.role; // Get the role from MongoDB
  
          const isAdmin = role === "admin"; // Check role dynamically
  
          setAuthState({ isAuthenticated: true, isAdmin, mongoId });
          sessionStorage.setItem("mongoId", mongoId);
          sessionStorage.setItem("role", role); // Store role in session
  
          setUser({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone || "",
            countriesChosen: [],
            courses: [],
            universities: [],
            mongoId,
          });
  
        } catch (error) {
          console.error("MongoDB check failed:", error);
          setAuthState({ isAuthenticated: false, isAdmin: false });
          setUser(null);
          sessionStorage.removeItem("mongoId");
        }
      } else {
        setAuthState({ isAuthenticated: false, isAdmin: false });
        setUser(null);
        sessionStorage.removeItem("mongoId");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const handleSignIn = async (email: string, isAdmin: boolean) => {
    const mongoId = sessionStorage.getItem("mongoId") || "";
    setAuthState({ isAuthenticated: true, isAdmin, mongoId });

    const normalUser: User = {
      name: "Alex Johnson",
      email,
      gitid: "alexjohnson",
      countriesChosen: ["UK", "Australia"],
      courses: ["Business Administration", "Marketing"],
      universities: ["University of Oxford", "University of Melbourne"],
      phone: "",
      mongoId,
    };

    const adminUser: User = {
      name: "Admin Lisa",
      email,
      phone: "1234567890",
      countriesChosen: [],
      courses: [],
      universities: [],
      mongoId,
    };

    setUser(isAdmin ? adminUser : normalUser);
  };

  // const handleSignUp = (mongoId: string) => {
  //   const newUser: User = {
  //     name: "New SignUp User",
  //     email: "signup.user@example.com",
  //     phone: "5555555555",
  //     countriesChosen: ["Canada"],
  //     courses: ["Computer Science"],
  //     universities: ["University of Toronto"],
  //     mongoId,
  //   };
  //   setAuthState({ isAuthenticated: true, isAdmin: false, mongoId });
  //   setUser(newUser);
  // };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Determine if the user should be an admin
      const isAdmin = email === "admin@gmail.com";
  
      // Store user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        role: isAdmin ? "admin" : "user",
      });
  
      // Redirect after successful signup
      // onSignUp(user.uid);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };


  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, isAdmin: false });
    setUser(null);
    setActiveTab("home");
    sessionStorage.removeItem("mongoId");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "forum":
        return <Forum />;
      case "faq":
        return <FAQ />;
      case "post":
          return <Post />;
      default:
        return <HomePage />;
    }
  };

  const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    showNavbar?: boolean;
    requireAdmin?: boolean;
  }> = ({ children, showNavbar = true, requireAdmin = false }) => {
    if (!authState.isAuthenticated || !sessionStorage.getItem("mongoId")) {
      return <Navigate to="/signin" replace />;
    }
    if (requireAdmin && !authState.isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="min-h-screen relative z-10">
        {showNavbar && (
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
              isAdmin={authState.isAdmin}
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
              authState.isAuthenticated ? (
                <Navigate
                  to={authState.isAdmin ? "/admin-dashboard" : "/dashboard"}
                  replace
                />
              ) : (
                <SignIn onSignIn={handleSignIn} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              authState.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SignUp onSignUp={handleSignUp} />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin-dashboard/*"
            element={
              // <ProtectedRoute requireAdmin={true}>
                <AdminDashboard onLogout={handleLogout} />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <main className="container mx-auto px-4 py-8">
                  {renderContent()}
                </main>
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
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
