import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth"; // main backend

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_BASE}/forgot-password`, { email });
      setSuccess("Password reset link sent to your email.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <motion.form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight drop-shadow">
          Forgot Password
        </h2>
        <p className="text-center text-gray-300 mb-4">
          Enter your registered email to receive a password reset link.
        </p>

        {error && (
          <p className="text-red-400 text-center font-medium">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-center font-medium">{success}</p>
        )}

        <div className="relative mb-2">
          <FaEnvelope className="absolute left-3 top-3 text-cyan-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="pl-10 pr-3 py-2 w-full border-b-2 border-gray-600 focus:border-cyan-400 bg-transparent text-white outline-none"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white w-full py-3 rounded-full text-lg font-semibold shadow-lg"
        >
          Send Reset Link
        </motion.button>

        <div className="text-center mt-2 text-gray-300">
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 underline cursor-pointer font-semibold"
          >
            Back to Login
          </span>
        </div>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
