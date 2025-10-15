import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { FaHeartbeat, FaUserMd, FaHospitalAlt, FaStethoscope } from "react-icons/fa";

const specialties = ["Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "Neurology", "ENT"];
const liveBookings = [
  "Dr. Meera booked in Cardiology",
  "Dr. Raj booked in Pediatrics",
  "Dr. Anjali booked in Dermatology",
];

const Header = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(0);
  const [mode, setMode] = useState("elegant");

  const taglines = [
    "Your Health, Our Priority 💙",
    "Find Top Doctors Near You 👨‍⚕️",
    "Book Appointments Instantly 🕒",
    "Trusted Care for Every Patient ❤️",
  ];

  useEffect(() => {
    const taglineInterval = setInterval(
      () => setCurrentTagline((prev) => (prev + 1) % taglines.length),
      3000
    );
    const bookingInterval = setInterval(
      () => setCurrentBooking((prev) => (prev + 1) % liveBookings.length),
      3500
    );

    return () => {
      clearInterval(taglineInterval);
      clearInterval(bookingInterval);
    };
  }, []);

  // Animated counters
  const Counter = ({ value, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const step = value / (duration / 30);
      const counter = setInterval(() => {
        start += step;
        if (start >= value) {
          start = value;
          clearInterval(counter);
        }
        setCount(Math.floor(start));
      }, 30);
      return () => clearInterval(counter);
    }, [value]);

    return (
      <div className="flex flex-col items-center text-white/90">
        <span className="text-3xl font-bold">{count}+</span>
        <p className="text-sm font-light">{label}</p>
      </div>
    );
  };

  // Gradient color modes
  const gradientModes = {
    elegant: "from-blue-700 via-purple-700 to-indigo-800",
    luxury: "from-teal-600 via-emerald-500 to-cyan-700",
    vibrant: "from-fuchsia-600 via-indigo-600 to-blue-600",
  };

  // Handle mode switch
  const handleModeChange = () => {
    const modes = Object.keys(gradientModes);
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <div className="relative flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl px-6 md:px-10 lg:px-20 bg-black/20">
      {/* Background Gradient with Dynamic Mode */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradientModes[mode]} bg-[length:200%_200%] animate-gradient-flow transition-all duration-700`}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="relative md:w-1/2 flex flex-col justify-center gap-6 py-14 md:py-[8vw] text-white z-10"
      >
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          Book Appointment
          <br />
          With Trusted Doctors
        </motion.h1>

        <motion.p
          key={currentTagline}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-light text-white/80 italic"
        >
          {taglines[currentTagline]}
        </motion.p>

        {/* Live Booking Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 text-sm font-light shadow-md mb-4"
        >
          📢 {liveBookings[currentBooking]}
        </motion.div>



        {/* Specialties */}
        <div className="flex flex-wrap gap-3 mt-4">
          {specialties.map((spec) => (
            <motion.span
              key={spec}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 10px rgba(255,255,255,0.5)",
              }}
              className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm cursor-pointer backdrop-blur-md"
            >
              {spec}
            </motion.span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-6">
          <motion.a
            href="#appointment"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-indigo-700 bg-white shadow-md overflow-hidden"
          >
            <span className="relative z-10">Book Appointment</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400 opacity-60 blur-xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.a>

          <motion.a
            href="#doctors"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full border border-white/40 text-white/90 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            Meet Our Doctors
          </motion.a>
        </div>

        {/* Statistics Counters */}
        <motion.div className="flex gap-8 mt-6">
          <Counter value={1200} label="Appointments Booked" />
          <Counter value={500} label="Certified Doctors" />
          <Counter value={100} label="Hospitals Partnered" />
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="md:w-1/2 relative flex justify-center items-center z-10"
      >
        <motion.img
          src={assets.header_img}
          alt="Doctor illustration"
          className="w-full md:max-w-lg lg:max-w-xl rounded-2xl drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />

        {/* Floating Icons */}
        <motion.div className="absolute top-10 left-10 text-white/60 text-3xl" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <FaHeartbeat />
        </motion.div>
        <motion.div className="absolute bottom-10 left-20 text-white/70 text-2xl" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          <FaUserMd />
        </motion.div>
        <motion.div className="absolute top-20 right-16 text-white/60 text-3xl" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
          <FaHospitalAlt />
        </motion.div>
        <motion.div className="absolute bottom-14 right-10 text-white/70 text-2xl" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
          <FaStethoscope />
        </motion.div>
      </motion.div>

      {/* Mode Switch Button */}
      <motion.button
        onClick={handleModeChange}
        className="absolute bottom-5 left-5 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md hover:bg-white/20 transition"
        whileTap={{ scale: 0.9 }}
      >
        Switch to {mode === "elegant" ? "Luxury" : mode === "luxury" ? "Vibrant" : "Elegant"} Mode
      </motion.button>

      {/* Gradient Animation */}
      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 14s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Header;
