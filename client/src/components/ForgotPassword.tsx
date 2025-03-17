import { useState } from "react";
import { resetPassword } from "../backend/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    await resetPassword(email);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send Reset Email
        </button>
      </form>
    </div>
  );
};
export default ForgotPassword;