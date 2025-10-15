// src/components/OnlineAppointment.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import CallRoom from "./CallRoom";
import ChatBox from "./ChatBox";
import { jsPDF } from "jspdf";

const OnlineAppointment = () => {
  const [mode, setMode] = useState(null); // "video" | "voice" | "chat"
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [filter, setFilter] = useState("all");
  const roomIdRef = useRef("room-1234");

  // List of doctors (expanded, realistic)
  const doctors = [
    {
      id: 1,
      name: "Dr. Arjun Mehta",
      specialty: "Cardiologist",
      experience: "10+ years",
      rating: 4.9,
      reviews: "1.2k",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      status: "online",
      qualification: "MBBS, MD Cardiology",
      languages: "English, Hindi",
      fee: "₹800",
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Dermatologist",
      experience: "8 years",
      rating: 4.7,
      reviews: "980",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "online",
      qualification: "MBBS, Dermatology",
      languages: "English, Hindi",
      fee: "₹600",
    },
    {
      id: 3,
      name: "Dr. Rohan Nair",
      specialty: "Neurologist",
      experience: "12 years",
      rating: 4.8,
      reviews: "1.5k",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "offline",
      qualification: "MBBS, MD Neurology",
      languages: "English, Hindi, Kannada",
      fee: "₹1000",
    },
    {
      id: 4,
      name: "Dr. Ananya Verma",
      specialty: "Pediatrician",
      experience: "7 years",
      rating: 4.6,
      reviews: "890",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      status: "online",
      qualification: "MBBS, DCH",
      languages: "English, Hindi",
      fee: "₹500",
    },
    {
      id: 5,
      name: "Dr. Vikram Singh",
      specialty: "Orthopedic",
      experience: "15 years",
      rating: 4.9,
      reviews: "1.8k",
      image: "https://randomuser.me/api/portraits/men/35.jpg",
      status: "offline",
      qualification: "MBBS, MS Orthopedic",
      languages: "English, Hindi",
      fee: "₹900",
    },
    // New realistic doctors
    {
      id: 6,
      name: "Dr. Meera Rao",
      specialty: "Gynecologist",
      experience: "9 years",
      rating: 4.8,
      reviews: "1.1k",
      image: "https://randomuser.me/api/portraits/women/30.jpg",
      status: "online",
      qualification: "MBBS, MD Gynecology",
      languages: "English, Hindi",
      fee: "₹700",
    },
    {
      id: 7,
      name: "Dr. Suresh Kulkarni",
      specialty: "ENT Specialist",
      experience: "11 years",
      rating: 4.7,
      reviews: "1.0k",
      image: "https://randomuser.me/api/portraits/men/50.jpg",
      status: "online",
      qualification: "MBBS, MS ENT",
      languages: "English, Hindi, Marathi",
      fee: "₹650",
    },
    {
      id: 8,
      name: "Dr. Kavya Iyer",
      specialty: "Psychiatrist",
      experience: "8 years",
      rating: 4.9,
      reviews: "1.3k",
      image: "https://randomuser.me/api/portraits/women/40.jpg",
      status: "offline",
      qualification: "MBBS, MD Psychiatry",
      languages: "English, Hindi",
      fee: "₹900",
    },
  ];

  const specialties = [
    "all",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "Gynecologist",
    "ENT Specialist",
    "Psychiatrist",
  ];

  const handleStart = (selectedMode) => {
    if (selectedDoctor?.status === "offline") {
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        setMode(selectedMode);
      }, 4000);
    } else {
      setMode(selectedMode);
    }
  };

  const handleEndCall = () => setMode(null);

  const handleDownloadPrescription = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Medical Prescription", 20, 20);
    doc.setFontSize(12);
    doc.text(`Doctor: ${selectedDoctor?.name}`, 20, 40);
    doc.text(`Specialty: ${selectedDoctor?.specialty}`, 20, 50);
    doc.text(`Patient: John Doe`, 20, 70);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
    doc.setFontSize(14);
    doc.text("Medicines:", 20, 100);
    doc.text("- Paracetamol 500mg (2 times a day)", 20, 115);
    doc.text("- Vitamin D3 (1 time a day)", 20, 125);
    doc.save("Prescription.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10"
      >
        {/* Filter */}
        {!selectedDoctor && (
          <>
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
              👨‍⚕️ Choose a Doctor for Consultation
            </h2>

            <div className="flex justify-center mb-6 gap-3 flex-wrap">
              {specialties.map((sp) => (
                <button
                  key={sp}
                  className={`px-4 py-2 rounded-full font-medium ${
                    filter === sp
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFilter(sp)}
                >
                  {sp}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {doctors
                .filter((doc) => filter === "all" || doc.specialty === filter)
                .map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                    }}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md p-5 cursor-pointer border hover:shadow-lg transition"
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-cyan-100 shadow"
                    />
                    <h3 className="text-lg font-semibold text-center mt-3 text-blue-700">
                      {doc.name}
                    </h3>
                    <p className="text-center text-gray-500 text-sm">
                      {doc.specialty} • {doc.experience}
                    </p>
                    <p className="text-center text-yellow-500 font-semibold">
                      ⭐ {doc.rating} ({doc.reviews})
                    </p>
                    <p
                      className={`text-center mt-2 text-sm font-medium ${
                        doc.status === "online"
                          ? "text-green-600 animate-pulse"
                          : "text-gray-400"
                      }`}
                    >
                      {doc.status === "online" ? "🟢 Online" : "🔴 Offline"}
                    </p>
                    <p className="text-center text-sm mt-1 text-gray-600">
                      Fee: {doc.fee} • {doc.languages}
                    </p>
                  </motion.div>
                ))}
            </div>
          </>
        )}

        {/* Selected Doctor Profile and Consultation */}
        {selectedDoctor && (
          <div>
            {/* Doctor Info + Actions */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6 mb-6">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-100 shadow-md"
              />
              <div className="flex-1 text-left">
                <h1 className="text-3xl font-bold text-blue-800">
                  {selectedDoctor.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedDoctor.specialty} • {selectedDoctor.experience}
                </p>
                <p className="text-gray-500 mt-1">
                  {selectedDoctor.qualification}
                </p>
                <p className="text-gray-500 mt-1">
                  Languages: {selectedDoctor.languages}
                </p>
                <p className="text-yellow-500 mt-1 font-semibold">
                  ⭐ {selectedDoctor.rating} ({selectedDoctor.reviews})
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleStart("video")}
                  className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
                >
                  🎥 Video
                </button>
                <button
                  onClick={() => handleStart("voice")}
                  className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
                >
                  📞 Voice
                </button>
                <button
                  onClick={() => handleStart("chat")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="bg-gray-200 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-300 transition"
                >
                  🔙 Back
                </button>
              </div>
            </div>

            {/* Waiting Screen */}
            {connecting && (
              <div className="text-center py-10 animate-pulse">
                <p className="text-xl text-blue-600 font-semibold">
                  Please wait... Connecting to {selectedDoctor.name} 🔄
                </p>
              </div>
            )}

            {/* Chat Mode */}
            {mode === "chat" && !connecting && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      Chat with {selectedDoctor.name}
                    </h3>
                    <ChatBox
                      roomId={roomIdRef.current}
                      username={"Patient"}
                      autoReply={`Hello, this is ${selectedDoctor.name}. How can I help you today?`}
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-semibold">Patient Actions</h4>
                    <label className="mt-3 block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">
                      📁 Share Report
                      <input className="hidden" type="file" />
                    </label>
                    <button
                      onClick={handleDownloadPrescription}
                      className="mt-3 w-full bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
                    >
                      💊 Download Prescription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Video/Voice Mode */}
            {(mode === "video" || mode === "voice") && !connecting && (
              <CallRoom
                roomId={roomIdRef.current}
                localName={"Patient"}
                remoteName={selectedDoctor.name}
                type={mode}
                onEnd={handleEndCall}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OnlineAppointment;
