import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveDashboard from "../components/InteractiveDashboard";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaClipboardList,
  FaBell,
  FaBookMedical,
} from "react-icons/fa";
import { assets } from "../assets/assets";

// Particle generator
const generateParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 + "vw",
    y: Math.random() * 100 + "vh",
    size: Math.random() * 6 + 3 + "px",
    color: `rgba(59,130,246,${Math.random() * 0.2 + 0.05})`,
    speedX: (Math.random() - 0.5) / 3,
    speedY: (Math.random() - 0.5) / 3,
  }));

const carouselItems = [
  { title: "Book a Doctor", description: "Schedule your appointment instantly.", gradient: "from-blue-400 to-indigo-500", icon: <FaHeartbeat /> },
  { title: "View Reports", description: "Check your medical history anytime.", gradient: "from-green-400 to-teal-500", icon: <FaClipboardList /> },
  { title: "Get Notifications", description: "Never miss any updates or reminders.", gradient: "from-pink-400 to-purple-500", icon: <FaBell /> },
];

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "Daungere, Karnataka",
    dob: user?.dob || "",
    image: user?.image || assets.profile_pic,
  });
  const [particles, setParticles] = useState(generateParticles(40));

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: `calc(${parseFloat(p.x)}vw + ${p.speedX}px)`,
          y: `calc(${parseFloat(p.y)}vh + ${p.speedY}px)`,
        }))
      );
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(carouselInterval);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser(formData);
    setIsEdit(false);
  };

  // Profile Completion
  const completionPercent = Math.round(
    (["name", "email", "phone", "dob", "image"].filter((key) => formData[key]).length / 5) * 100
  );
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionPercent / 100) * circumference;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            top: p.y,
            left: p.x,
            filter: "blur(2px)",
          }}
        />
      ))}

      <div className="container mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row gap-10">
        {/* Left: Profile Card */}
        <motion.div
          className="relative bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-10 flex-1 shadow-2xl"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Image + Progress */}
          <div className="flex flex-col items-center relative mb-8">
            <motion.svg className="absolute -z-10" width="140" height="140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#0d6efd"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1 }}
              />
            </motion.svg>
            <motion.img
              src={formData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg shadow-blue-200/50"
              whileHover={{ scale: 1.1 }}
            />
            {isEdit && (
              <label className="mt-3 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                Upload
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
            <p className="mt-2 text-gray-700 font-semibold">{completionPercent}% Profile Complete</p>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {["name", "email", "phone", "dob", "location"].map((field) => (
              <div key={field} className="flex items-center gap-3">
                <div className="text-blue-500">
                  {field === "name" && <FaUser />}
                  {field === "email" && <FaEnvelope />}
                  {field === "phone" && <FaPhone />}
                  {field === "dob" && <FaCalendarAlt />}
                  {field === "location" && <FaMapMarkerAlt />}
                </div>
                {isEdit ? (
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : (
                  <p className="flex-1 bg-blue-50 px-3 py-2 rounded-lg">{formData[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            {isEdit ? (
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-600"
              >
                Save
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setIsEdit(true)}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-400 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-500"
              >
                Edit
              </motion.button>
            )}
          </div>
        </motion.div>

       {/* Right: Interactive Dashboard */}
<motion.div
  className="flex-1 relative rounded-3xl shadow-xl overflow-hidden"
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <InteractiveDashboard />
</motion.div>

      </div>
    </div>
  );
};

export default MyProfile;
