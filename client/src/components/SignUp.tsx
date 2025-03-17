import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { auth, createUserDocument } from "../backend/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { toast, ToastContainer, Bounce } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Store user in MongoDB
  const registerUserInDB = async (uid: string, fullName: string, email: string) => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { uid, fullName, email });
      console.log("User stored in MongoDB");
    } catch (err: any) {
      console.error("MongoDB Registration Error:", err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLoading) return;

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User Registered Successfully in Firebase");

      // Send email verification
      await sendEmailVerification(user);

      // Store user in Firestore
      await createUserDocument(user, { fullName, email });

      // Store user in MongoDB
      await registerUserInDB(user.uid, fullName, email);

      // Show success message
      toast.success("✅ Account created! Please verify your email.", {
        position: "top-center",
        transition: Bounce,
        autoClose: 3000,
      });

      // Logout user so they must verify before login
      await signOut(auth);

      // Redirect to email verification page
      setTimeout(() => {
        navigate("/verify-email");
      }, 3100);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        position: "top-center",
        transition: Bounce,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <div className="fixed inset-0 bg-[#050f2e]">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-[#0ea5e9] blur-[100px] opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <GraduationCap className="w-16 h-16 text-blue-400" />
        </div>

        <div className="backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10 shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Create Account</h1>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-4 py-3"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-4 py-3"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-12 py-3"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-12 py-3"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 font-medium ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
