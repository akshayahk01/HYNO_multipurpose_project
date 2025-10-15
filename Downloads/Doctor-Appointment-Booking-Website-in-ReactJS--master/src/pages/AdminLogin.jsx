import React, { useState } from "react";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 w-80 animate-pop-in"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          Admin Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all duration-200">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
