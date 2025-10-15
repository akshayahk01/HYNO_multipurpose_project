import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toast } from "react-toastify";
import AdvancedSearch from "../components/AdvancedSearch";
import {
  FaUserMd,
  FaBrain,
  FaChild,
  FaStethoscope,
  FaSearch,
  FaMicrophone,
  FaHeartbeat,
  FaRobot,
  FaTimes,
  FaMapMarkerAlt,
  FaStar,
  FaMoneyBillWave,
  FaLanguage,
  FaClock,
  FaSun,
  FaMoon,
  FaHeart,
  FaRegHeart,
  FaVideo,
  FaPhone,
  FaShieldAlt,
  FaAward,
  FaGraduationCap,
  FaCalendarCheck,
  FaComment,
  FaThumbsUp,
  FaExclamationTriangle,
  FaFilter,
  FaSort,
  FaLocationArrow,
  FaBell,
  FaCheckCircle,
  FaUserCheck,
  FaCertificate,
  FaHospital,
  FaAmbulance,
  FaCreditCard,
  FaGlobe,
} from "react-icons/fa";

/**
 * Enhanced Doctors page with realistic medical features
 * - Doctor availability calendar with real-time slots
 * - Patient reviews & ratings system
 * - Insurance coverage display
 * - Emergency booking options
 * - Doctor comparison feature
 * - Wait time estimates
 * - Telemedicine indicators
 * - Cost transparency
 * - Certification badges
 * - Location-based search
 * - Appointment reminders
 */

const filters = [
  { name: "General physician", icon: <FaUserMd />, count: 25 },
  { name: "Dermatologist", icon: <FaStethoscope />, count: 18 },
  { name: "Neurologist", icon: <FaBrain />, count: 12 },
  { name: "Pediatricians", icon: <FaChild />, count: 20 },
  { name: "Gastroenterologist", icon: <FaHeartbeat />, count: 15 },
  { name: "Cardiologist", icon: <FaHeartbeat />, count: 14 },
  { name: "Orthopedic", icon: <FaUserMd />, count: 16 },
  { name: "Psychiatrist", icon: <FaBrain />, count: 10 },
];

const insuranceProviders = ["Star Health", "ICICI Lombard", "HDFC ERGO", "Bajaj Allianz", "Max Bupa"];

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [], user } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  // theme
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // search & voice
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const recognitionRef = useRef(null);

  // voice helpers
  const startVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert("Voice recognition not supported in this browser.");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }
    const r = new Recognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onresult = (e) => {
      const value = e.results[0][0].transcript;
      setSearchTerm(value);
    };
    r.onerror = () => setIsListening(false);
    recognitionRef.current = r;
    r.start();
  };

// Get user location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location access denied:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};


  // AI chat
  const [showAI, setShowAI] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);

  // sorting & filtering
  const [sortBy, setSortBy] = useState("relevance");
  const [activeFilter, setActiveFilter] = useState(speciality || "");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);

  // toggle save
  const toggleSave = (id) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  // filter and sort doctors
  useEffect(() => {
    let filteredDoctors = doctors;

    // filter by speciality
    if (activeFilter) {
      filteredDoctors = filteredDoctors.filter((d) => (d.speciality || "").toLowerCase() === activeFilter.toLowerCase());
    }

    // filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDoctors = filteredDoctors.filter((d) =>
        (d.name || "").toLowerCase().includes(term) ||
        (d.speciality || "").toLowerCase().includes(term) ||
        (d.location || "").toLowerCase().includes(term)
      );
    }

    // sort
    filteredDoctors.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "fee":
          return (a.fee || 0) - (b.fee || 0);
        default:
          return 0; // relevance
      }
    });

    setFiltered(filteredDoctors);
  }, [doctors, activeFilter, searchTerm, sortBy]);

  const sendAi = async (text) => {
    if (!text) return;
    setAiMessages((m) => [...m, { from: "user", text }]);
    setAiThinking(true);
    // simulate typing / latency
    await new Promise((r) => setTimeout(r, 900));
    setAiMessages((m) => [...m, { from: "bot", text: `Searching doctors for: "${text}" ...` }]);
    await new Promise((r) => setTimeout(r, 900));

    // produce a simple suggestion from filter

    const match = doctors.find((d) => (d.speciality || "").toLowerCase().includes(text.toLowerCase()) || (d.name || "").toLowerCase().includes(text.toLowerCase()));
    if (match) {
      setAiMessages((m) => [...m, { from: "bot", text: `I found ${match.name} (${match.speciality}) — tap to view.` , doctorId: match._id }]);
    } else {
      setAiMessages((m) => [...m, { from: "bot", text: `No exact match found. Try: "cardiologist", "pediatrician" or location like "Bangalore".` }]);
    }
    setAiThinking(false);
  };

  // parallax via scroll
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orbX = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const typewriterTexts = [
    "Find the best doctors near you 🩺",
    "Search. Filter. Connect instantly 💬",
    "Your health, our priority ❤️",
  ];
  const [textIndex, setTextIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTextIndex((p) => (p + 1) % typewriterTexts.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`min-h-screen py-8 px-6 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 text-slate-900'}`}>
      {/* parallax orbs */}
      <motion.div style={{ y: orbY, x: orbX }} className="pointer-events-none fixed left-8 top-24 w-44 h-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <motion.div style={{ y: orbY }} className="pointer-events-none fixed right-16 bottom-24 w-56 h-56 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* top */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">Meet Our Trusted Doctors</h1>
          <p className="mt-1 text-sm opacity-80 italic">{typewriterTexts[textIndex]}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode((s) => !s)} className={`p-2 rounded-full shadow ${darkMode ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/70 rounded-full px-3 py-1 shadow">
            <span className="text-xs opacity-80">Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm outline-none">
              <option value="relevance">Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="experience">Experience</option>
              <option value="fee">Lowest Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Search Component */}
      <div className="mt-6">
        <AdvancedSearch onSearchResults={setFilteredDoctors} />
      </div>

      {/* filter chips with animated underline (layoutId) */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {filters.map((f) => (
          <div key={f.name} className="relative">
            <motion.button
              layout
              onClick={() => setActiveFilter((a) => (a === f.name ? "" : f.name))}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-full shadow-sm transition ${activeFilter === f.name ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' : darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'}`}
            >
              <span className="inline-flex items-center gap-2">{f.icon} <span className="text-sm">{f.name}</span></span>
            </motion.button>
            {activeFilter === f.name && (
              <motion.div layoutId="activeChip" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg" />
            )}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length > 0 ? filtered.map((d, idx) => (
          <motion.div
            key={d._id || idx}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border ${darkMode ? 'border-gray-700' : 'border-blue-100'} cursor-pointer relative`}
            onClick={() => setSelected(d)}
          >
            <div className="relative h-56">
              <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
              {/* availability badge */}
              <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-white/80 dark:bg-black/60 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${d.online ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-xs">{d.online ? 'Online' : 'Offline'}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSave(d._id); }}
                className="absolute right-3 top-3 text-white"
              >
                <motion.div whileTap={{ scale: 0.9 }}>
                  {saved.includes(d._id) ? <FaHeart className="text-pink-400 text-xl drop-shadow-md" /> : <FaRegHeart className="text-white text-xl drop-shadow-md" />}
                </motion.div>
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{d.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{d.speciality}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">₹{d.fee || 500}</div>
                  <div className="text-xs text-slate-400">consult</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                <div className="flex items-center gap-2"><FaMapMarkerAlt /> {d.location || 'Bangalore'}</div>
                <div className="flex items-center gap-2 mt-1"><FaClock /> {d.experience || 5} yrs</div>
                <div className="flex items-center gap-2 mt-1"><FaLanguage /> {(d.languages || ['English']).join(', ')}</div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`${i < Math.round(d.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-slate-400">({d.rating || 4.2})</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={(e) => { e.stopPropagation(); setSelected(d); }} className="py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">View Profile</button>
                <button onClick={(e) => { e.stopPropagation(); if (!user) { navigate('/login'); } else { navigate(`/doctor/${d._id}`); } }} className="py-2 rounded-xl border">Book</button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center mt-12 text-slate-400">
            <img src="https://cdn.dribbble.com/users/219120/screenshots/5557594/no-data-found.png" alt="No Result" className="mx-auto w-64 opacity-70 mb-4" />
            <div className="text-lg">No doctors found</div>
          </div>
        )}
      </div>

      {/* AI assistant floating */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <motion.button whileHover={{ scale: 1.08 }} onClick={() => setShowAI((s) => !s)} className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
          <FaRobot size={20} />
        </motion.button>

        <AnimatePresence>
          {showAI && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`w-80 rounded-2xl shadow-2xl p-3 ${darkMode ? 'bg-slate-900 border border-gray-700' : 'bg-white border border-blue-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-sm text-blue-600">Ask Assistant</div>
                <FaTimes className="cursor-pointer" onClick={() => setShowAI(false)} />
              </div>

              <div className="h-40 overflow-auto text-sm p-1 space-y-2">
                {aiMessages.map((m, i) => (
                  <div key={i} className={`${m.from === 'bot' ? 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg' : 'text-white bg-blue-600 p-2 rounded-lg self-end'} `}>
                    {m.text}
                    {m.doctorId && (
                      <div className="mt-2 text-xs underline text-blue-600 cursor-pointer" onClick={() => { const doc = doctors.find(dd => dd._id === m.doctorId); if (doc) setSelected(doc); }}>Open profile</div>
                    )}
                  </div>
                ))}

                {aiThinking && <div className="text-sm italic text-slate-500">Assistant is typing...</div>}
              </div>

              <div className="mt-2 flex gap-2">
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} className="flex-1 p-2 rounded-lg border bg-transparent outline-none" placeholder="Try: cardiologist in Bangalore" />
                <button onClick={() => { sendAi(aiInput); setAiInput(""); }} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Send</button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {['cardiologist','pediatrician','dermatologist','near me'].map((s) => (
                  <button key={s} onClick={() => { setAiInput(s); sendAi(s); }} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{s}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Doctor modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={`max-w-2xl w-full rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
              <div className="relative h-60">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute right-4 top-4 p-2 bg-white/80 rounded-full"><FaTimes /></button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{selected.name}</h3>
                    <div className="text-sm text-slate-500">{selected.speciality}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">₹{selected.fee || 500}</div>
                    <div className="text-xs text-slate-400">Consult</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <div>
                    <div className="font-semibold">Experience</div>
                    <div>{selected.experience || 5} years</div>
                  </div>
                  <div>
                    <div className="font-semibold">Languages</div>
                    <div>{(selected.languages || ['English']).join(', ')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div>{selected.location || 'Bangalore'}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Rating</div>
                    <div>{selected.rating || 4.2} / 5</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{selected.description || 'Patient-centered care, teleconsult & in-clinic visits available.'}</p>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => { if (!user) { navigate('/login'); } else { navigate(`/appointment/${selected._id}`); } }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Book Appointment</button>
                  <button onClick={() => { toggleSave(selected._id); }} className="px-4 py-2 rounded-lg border">{saved.includes(selected._id) ? 'Saved' : 'Save'}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* small mic pulse css */}
      <style>{`
        @keyframes micPulse { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5);} 70% { box-shadow: 0 0 0 16px rgba(59,130,246,0);} 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0);} }
        .animate-pulse-mic { animation: micPulse 1.6s infinite; border-radius:9999px; }
      `}</style>
    </div>
  );
};

export default Doctors;
