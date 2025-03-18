import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { auth } from "../backend/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface SignInProps {
  onSignIn: (isAdmin: boolean) => void;
}

const ADMIN_EMAIL = "anjaliharish2004@gmail.com";
const ADMIN_PASS= "admin@123";
const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      onSignIn(true);
      toast.success("Welcome, Admin!", {
        position: "top-center",
        transition: Bounce,
        autoClose: 3000,
        theme: "dark"
      });
      navigate("/admin-dashboard");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email before signing in.", {
          position: "top-center",
          transition: Bounce,
          autoClose: 3000,
          theme: "dark"
        });
        return;
      }

      onSignIn(false);
      toast.success("Sign in successful!", {
        position: "top-center",
        transition: Bounce,
        autoClose: 3000,
        theme: "dark"
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Firebase SignIn Error:", err);
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        transition: Bounce,
        autoClose: 3000,
        theme: "dark"
      });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <div className="fixed inset-0 bg-[#050f2e]">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-[#0ea5e9] blur-[100px] opacity-20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <GraduationCap className="w-16 h-16 text-blue-400" />
        </div>

        <div className="backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10 shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h1>

          {error && (
            <p className="text-red-400 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 border border-white/5 
                           backdrop-blur-sm transition-all"
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
                autoComplete="current-password"
                className="w-full bg-black/20 text-white rounded-lg pl-12 pr-12 py-3 
                           placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 border border-white/5 
                           backdrop-blur-sm transition-all"
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                         text-white rounded-lg py-3 font-medium 
                         hover:from-blue-600 hover:to-blue-700 transition-all 
                         duration-300 shadow-lg shadow-blue-500/25"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            New to EduConnect?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
export default SignIn;