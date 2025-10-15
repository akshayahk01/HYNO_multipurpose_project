import React, { useState } from "react";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-200 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl animate-pop-in">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Admin Dashboard
        </h1>
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminPage;
