// src/pages/MyAppointments.jsx
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { user, appointments, fetchUserAppointments, setAppointments } =
    useContext(AppContext);
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("Doctors"); // Doctors | Hospitals | Online
  const [timers, setTimers] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments when user changes
  useEffect(() => {
    if (user?.id) fetchUserAppointments(user.id);
  }, [user]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      appointments.forEach((appt) => {
        const diff = new Date(appt.datetime) - new Date();
        if (diff <= 0) newTimers[appt._id] = "Now";
        else {
          const hrs = Math.floor(diff / 1000 / 60 / 60);
          const mins = Math.floor((diff / 1000 / 60) % 60);
          const secs = Math.floor((diff / 1000) % 60);
          newTimers[appt._id] = `${hrs}h ${mins}m ${secs}s`;
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [appointments]);

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: "Cancelled" } : a)),
    );
    setSelectedAppointment(null);
  };

  const clearCancelled = () => {
    setAppointments((prev) => prev.filter((a) => a.status !== "Cancelled"));
  };

  const downloadInvoice = (appt) => {
    if (!appt) return;
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFillColor(108, 21, 170);
    doc.rect(0, 0, 600, 80, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("Hyno Health Management", 40, 50);

    doc.setFontSize(12);
    doc.text(`Invoice No: INV-${Math.floor(Math.random() * 100000)}`, 420, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 420, 60);

    doc.setTextColor("#000");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Details", 40, 120);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Patient: ${appt.patient.name}`, 40, 140);
    doc.text(`Doctor/Hospital: ${appt.name}`, 40, 160);
    doc.text(`Date: ${new Date(appt.datetime).toDateString()}`, 40, 180);
    doc.text(
      `Time: ${new Date(appt.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      40,
      200,
    );
    doc.text(`Status: ${appt.status}`, 40, 220);
    doc.text(`Fee: ₹${appt.fees}`, 40, 240);

    doc.save(`Invoice_${appt.patient.name}.pdf`);
  };

  const filteredAppointments =
    filter === "All"
      ? appointments.filter((a) => a.type === category.slice(0, -1))
      : appointments.filter(
          (a) => a.status === filter && a.type === category.slice(0, -1),
        );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-50 to-purple-100">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        My Appointments
      </h1>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["Doctors", "Hospitals", "Online"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full border font-medium ${
              category === c
                ? "bg-purple-600 text-white border-purple-600"
                : "border-gray-300 text-gray-700 hover:bg-purple-200"
            } transition-all duration-300`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["All", "Pending", "Paid", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full border font-medium ${
              filter === f
                ? "bg-purple-600 text-white border-purple-600"
                : "border-gray-300 text-gray-700 hover:bg-purple-200"
            } transition-all duration-300`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Clear Cancelled */}
      {filteredAppointments.some((a) => a.status === "Cancelled") && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearCancelled}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md"
          >
            Clear Cancelled
          </button>
        </div>
      )}

      {/* Appointments List */}
      <AnimatePresence>
        {filteredAppointments.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
            className="grid grid-cols-[1fr_2fr_1fr] sm:flex sm:items-center gap-4 sm:gap-6 p-4 mb-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => setSelectedAppointment(item)}
          >
            <div className="flex-shrink-0">
              <img
                className="w-28 h-28 object-cover rounded-lg bg-indigo-50"
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-purple-700">
                {item.name}
              </p>
              {item.type === "Doctor" && (
                <p className="text-gray-600">{item.speciality}</p>
              )}
              {item.type === "Hospital" && item.address && (
                <p className="text-gray-600">{item.address.line1}</p>
              )}
              <p className="text-sm mt-1">
                <span className="font-medium text-gray-700">Date & Time:</span>{" "}
                {new Date(item.datetime).toDateString()}{" "}
                {new Date(item.datetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium text-gray-700">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    item.status === "Paid"
                      ? "text-green-600"
                      : item.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </p>
              {item.status !== "Cancelled" && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Countdown:</span>{" "}
                  {timers[item._id]}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {filteredAppointments.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No appointments found.
        </p>
      )}
    </div>
  );
};

export default MyAppointments;
