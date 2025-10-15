// LandingPage.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import LandingChat from "../components/LandingChat";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  FaHeartbeat,
  FaDumbbell,
  FaAppleAlt,
  FaPills,
  FaUserMd,
  FaStar,
  FaUsers,
  FaAward,
  FaShieldAlt,
  FaChevronUp,
} from "react-icons/fa";

/**
 * Advanced realistic Landing Page for HYNO
 * - Requires: Tailwind CSS + Framer Motion installed
 * - Expects: assets.logo, assets.doc1..doc5, assets.team1 in assets
 */

/* -------------------- Helper: smooth counter hook -------------------- */
function useCountTo(target, duration = 1200, start = 0, trigger = true) {
  const [value, setValue] = useState(start);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!trigger) return () => {};
    const startTime = performance.now();
    const diff = target - start;
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      // easing out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + diff * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start, trigger]);
  return value;
}

/* -------------------- Floating shapes for hero (parallax) -------------------- */
const FloatingShapes = ({ mouseX, mouseY }) => {
  // mouseX, mouseY are -1..1
  return (
    <>
      <motion.div
        style={{ transform: `translate(${mouseX * -10}px, ${mouseY * -6}px)` }}
        className="absolute -left-16 -top-24 w-72 h-72 rounded-full dark:bg-gradient-to-tr dark:from-cyan-900 dark:to-blue-900 bg-gradient-to-tr from-indigo-600 to-teal-400 opacity-20 dark:opacity-30 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ transform: `translate(${mouseX * 8}px, ${mouseY * 10}px)` }}
        className="absolute right-10 top-36 w-96 h-96 rounded-full dark:bg-gradient-to-tr dark:from-blue-900 dark:to-cyan-900 bg-gradient-to-tr from-violet-500 to-cyan-300 opacity-16 dark:opacity-25 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ transform: `translate(${mouseX * -4}px, ${mouseY * 16}px)` }}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 w-60 h-60 rounded-full dark:bg-gradient-to-br dark:from-slate-700 dark:to-gray-800 bg-gradient-to-br from-emerald-200 to-indigo-200 opacity-10 dark:opacity-20 blur-2xl pointer-events-none"
      />
    </>
  );
};

/* -------------------- Doctor card (3D flip) -------------------- */
const DoctorCard = ({ doc, onBook }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="perspective" style={{ perspective: 1100 }}>
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}
        // tailwind doesn't have rotate-y by default; we use inline style below to keep classes semantics
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* front */}
        <div
          className="absolute inset-0 rounded-2xl dark:bg-slate-800 bg-white p-5 shadow-xl backface-hidden dark:shadow-gray-600/50"
          style={{
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center gap-4">
            <img
              src={doc.image}
              alt={doc.name}
              className="w-16 h-16 rounded-full object-cover border-2 dark:border-slate-600 border-indigo-50 shadow"
            />
            <div>
              <h4 className="text-lg font-semibold dark:text-white text-slate-900">
                {doc.name}
              </h4>
              <div className="text-sm dark:text-gray-400 text-slate-500">{doc.specialty}</div>
            </div>
          </div>
          <p className="mt-3 text-sm dark:text-gray-300 text-slate-600">
            10+ years experience • MBBS, MD
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 dark:bg-slate-700/50 bg-indigo-50 px-3 py-2 rounded-full text-sm dark:text-cyan-300 text-indigo-700">
              <FaStar /> 4.8
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onBook(doc)}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white text-sm shadow-sm hover:bg-teal-600"
              >
                Book
              </button>
              <button
                onClick={() => setFlipped(true)}
                className="px-3 py-2 rounded-lg border dark:border-gray-600 border-slate-200 text-sm dark:text-gray-200"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        {/* back */}
        <div
          className="absolute inset-0 rounded-2xl dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 bg-gradient-to-br from-slate-50 to-white p-5 shadow-xl backface-hidden dark:shadow-gray-600/50"
          style={{
            transform: "rotateY(180deg)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold dark:text-white text-slate-900">
                {doc.name}
              </h4>
              <div className="text-sm dark:text-gray-400 text-slate-500">{doc.specialty}</div>
            </div>
            <button
              onClick={() => setFlipped(false)}
              className="text-sm dark:text-cyan-400 text-indigo-600 underline"
            >
              Back
            </button>
          </div>
          <p className="mt-3 text-sm dark:text-gray-300 text-slate-600">
            Specializes in patient-centered care, clinical diagnosis, and
            follow-up plans. Consults in clinic & video.
          </p>
          <ul className="mt-3 text-sm dark:text-gray-300 text-slate-600 space-y-1">
            <li>• Clinic: Mon - Sat, 9AM - 1PM</li>
            <li>• Video Consult: Daily 3PM - 8PM</li>
            <li>• Languages: English, Kannada, Hindi</li>
          </ul>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => onBook(doc)}
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white"
            >
              Book Appointment
            </button>
            <button
              onClick={() => alert("Profile coming soon")}
              className="px-3 py-2 rounded-lg border dark:border-gray-600"
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Animated Counter component -------------------- */
const Counter = ({ to, label, active }) => {
  const val = useCountTo(to, 1400, 0, active);
  return (
    <div className="text-center">
      <div className="text-3xl font-bold dark:text-white text-slate-900">
        {val.toLocaleString()}
      </div>
      <div className="text-sm dark:text-gray-300 text-slate-600 mt-1">{label}</div>
    </div>
  );
};

/* -------------------- ScrollToTop Button -------------------- */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white shadow-lg hover:scale-105 transition"
      aria-label="Scroll to top"
    >
      <FaChevronUp />
    </button>
  );
};

/* -------------------- Main Landing Page -------------------- */
const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  // for mouse parallax (range -1..1)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    symptoms: "",
    preferredDoctor: "",
    appointmentDate: "",
    appointmentTime: "",
    preferredContact: "",
    referralSource: "",
    insuranceProvider: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [newsletter, setNewsletter] = useState("");

  // intersection observers for counters
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  const [doctors] = useState([
    {
      name: "Dr. Akshay Hiremath",
      specialty: "General Physician",
      image: assets.doc1,
    },
    { name: "Dr. Sanjana", specialty: "Gynecologist", image: assets.doc2 },
    { name: "Dr. Madhu M", specialty: "Dermatologist", image: assets.doc3 },
    {
      name: "Dr. Abhishek Patil",
      specialty: "Pediatrician",
      image: assets.doc4,
    },
    { name: "Dr. Rakshatha", specialty: "Neurologist", image: assets.doc5 },
    { name: "Dr. Linda Brown", specialty: "Psychiatrist", image: assets.team1 },
  ]);

  const services = [
    {
      title: "Book Consults",
      icon: <FaHeartbeat />,
      desc: "Verified doctors & fast booking",
    },
    {
      title: "Wellness Plans",
      icon: <FaDumbbell />,
      desc: "Personalized fitness & diet",
    },
    {
      title: "Nutrition",
      icon: <FaAppleAlt />,
      desc: "Diet plans & counseling",
    },
    { title: "Pharmacy", icon: <FaPills />, desc: "Fast medicine delivery" },
  ];

  const testimonials = [
    { name: "John Doe", text: "Easy booking, reliable doctors.", rating: 5 },
    { name: "Jane Smith", text: "Good follow-up & teleconsult.", rating: 5 },
    { name: "Mike Johnson", text: "Pharmacy delivered quickly.", rating: 4 },
    { name: "Sarah Lee", text: "Amazing wellness plans, lost 10kg!", rating: 5 },
    { name: "David Kim", text: "24/7 support, always there when needed.", rating: 5 },
    { name: "Emily Chen", text: "Verified doctors, no scams. Highly recommend.", rating: 5 },
    { name: "Robert Taylor", text: "Fast medicine delivery, saved my time.", rating: 4 },
    { name: "Lisa Wong", text: "Personalized care, feels like family.", rating: 5 },
  ];

  const controls = useAnimation();

  /* form handlers */
  const submitContact = (e) => {
    e.preventDefault();
    // simple client-validation example
    if (!formData.name || !formData.email)
      return alert("Please fill your name and email.");
    // placeholder: integrate API here
    alert("Appointment requested — we'll contact you soon!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      symptoms: "",
      preferredDoctor: "",
      appointmentDate: "",
      appointmentTime: "",
      preferredContact: "",
      referralSource: "",
      insuranceProvider: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    });
  };

  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletter) return;
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: newsletter,
          subject: "Welcome to HYNO Healthcare Newsletter!",
          text: `Dear Valued Subscriber,

Thank you for subscribing to HYNO Healthcare updates!

We're excited to have you join our community dedicated to providing top-quality healthcare solutions. Here's what you can expect:

• Latest health tips and wellness advice
• Updates on new services and features
• Exclusive offers for subscribers
• Stories from our patients and doctors

HYNO offers:
- Video & clinic consultations with verified doctors
- Personalized wellness and nutrition plans
- Fast medicine delivery
- 24/7 support

Visit our website at http://localhost:5173 to book your first appointment or explore our services.

If you have any questions, feel free to reply to this email.

Stay healthy!
Best regards,
HYNO Healthcare Team
support@hyno.com`,
        }),
      });
      if (response.ok) {
        alert(
          "Successfully subscribed! Check your email for a welcome message.",
        );
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      alert("Error sending email. Please try again.");
    }
    setNewsletter("");
  };

  const handleBook = (doc) => {
    // navigate to a booking page with doc param (if available)
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/appointment/${doc._id}`);
    }
  };

  /* hero animation on mount */
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
  }, [controls]);

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 bg-gradient-to-b from-slate-50 to-white dark:text-gray-100 text-slate-800 antialiased">
      {/* HERO */}
      <header className="relative overflow-hidden dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
        {/* floating shapes */}
        <FloatingShapes mouseX={mouse.x} mouseY={mouse.y} />

        {/* Big Logo at the top */}
        <div className="flex justify-center mt-6 mb-4">
          <img
            src={assets.logo}
            alt="HYNO Logo"
            className="w-40 h-40 object-contain drop-shadow-2xl dark:drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={controls}>
              <p className="inline-block text-sm font-medium px-3 py-1 rounded-full dark:bg-cyan-900/50 bg-emerald-100 dark:text-cyan-200 text-emerald-700">
                Trusted Healthcare • 24/7 support
              </p>

              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight dark:text-white">
                Care that fits your life —{" "}
                <span className="bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-400 bg-gradient-to-r from-teal-500 to-indigo-600">
                  easy, instant, trusted.
                </span>
              </h1>

              <p className="mt-4 dark:text-gray-300 text-slate-600 max-w-xl">
                Book in-clinic & video consultations, follow personalized
                wellness plans, and get medicines delivered — all from HYNO.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => { if (!user) { navigate('/login'); } else { navigate("/home"); } }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="px-6 py-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:text-gray-200 text-slate-700 dark:bg-slate-800 bg-white hover:shadow-md transition"
                >
                  Explore Services
                </button>
              </div>

              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-3 dark:bg-slate-800/80 bg-white rounded-full px-4 py-2 shadow dark:shadow-gray-700/50">
                  <FaUsers className="dark:text-cyan-300 text-teal-500" />
                  <div>
                    <div className="text-xs dark:text-gray-400 text-slate-500">Trusted by</div>
                    <div className="font-semibold dark:text-white">10,000+ patients</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 dark:bg-slate-800/80 bg-white rounded-full px-4 py-2 shadow dark:shadow-gray-700/50">
                  <FaUserMd className="dark:text-blue-300 text-indigo-500" />
                  <div>
                    <div className="text-xs dark:text-gray-400 text-slate-500">Verified</div>
                    <div className="font-semibold dark:text-white">500+ doctors</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side card (call to action / immediate info) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div
                className="relative rounded-3xl dark:bg-slate-800/80 bg-white/80 backdrop-blur-md shadow-2xl p-6 dark:shadow-gray-700/50"
                style={{
                  transform: `translateY(${mouse.y * -8}px) translateX(${mouse.x * 8}px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={assets.logo}
                    alt="HYNO"
                    className="w-20 h-20 rounded-lg object-cover border dark:border-gray-600"
                  />
                  <div>
                    <div className="text-xs dark:text-gray-400 text-slate-500">Instant Care</div>
                    <div className="font-semibold dark:text-white text-slate-900">
                      Video & Clinic Appointments
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg dark:bg-slate-700/50 bg-slate-50 p-3">
                    <div className="text-xs dark:text-gray-400 text-slate-500">Next available</div>
                    <div className="text-sm font-semibold dark:text-white">
                      Dr. Akshay • Today 4:30 PM
                    </div>
                  </div>
                  <div className="rounded-lg dark:bg-slate-700/50 bg-slate-50 p-3">
                    <div className="text-xs dark:text-gray-400 text-slate-500">Pharmacy</div>
                    <div className="text-sm font-semibold dark:text-white">
                      Delivery in 2 hours
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { if (!user) { navigate('/login'); } else { navigate("/home"); } }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Book Now
                </button>
                  <button
                    onClick={() => navigate("/doctors")}
                    className="flex-1 dark:bg-slate-700 bg-white border dark:border-gray-600 border-slate-200 px-4 py-2 rounded-lg dark:text-gray-200"
                  >
                    See Doctors
                  </button>
                </div>

                {/* avatars */}
                <div className="absolute -bottom-6 right-6 flex -space-x-3">
                  {doctors.slice(0, 4).map((d, i) => (
                    <img
                      key={i}
                      src={d.image}
                      alt={d.name}
                      className="w-12 h-12 rounded-full border-2 dark:border-slate-700 border-white shadow"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* angled SVG divider */}
        <div className="-mt-8">
          <svg viewBox="0 0 1440 80" className="w-full h-20">
            <path
              fill="currentColor"
              className="dark:fill-slate-800 fill-[#f8fafc]"
              d="M0,0 C300,80 1140,-40 1440,40 L1440,80 L0,80 Z"
            ></path>
          </svg>
        </div>

        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          animate={{
            background: [
              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
              "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
              "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </header>

      {/* SERVICES */}
      <main>
        <section className="py-14 dark:bg-slate-800 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 text-center"
              >
                Our Services
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="mt-3 text-center dark:text-gray-300 text-slate-600 max-w-2xl mx-auto"
              >
                Complete healthcare solutions for the whole family.
              </motion.p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="dark:bg-slate-700 bg-white rounded-2xl p-6 shadow-md dark:shadow-gray-600/50 hover:shadow-xl dark:hover:shadow-cyan-500/20 transition cursor-default"
              >
                    <div className="w-12 h-12 rounded-lg dark:bg-slate-600/50 bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center dark:text-cyan-300 text-teal-600 mb-4 text-xl">
                      {s.icon}
                    </div>
                    <h4 className="font-semibold dark:text-white text-slate-900">{s.title}</h4>
                    <p className="text-sm dark:text-gray-300 text-slate-600 mt-2">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-14 dark:bg-slate-900 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 text-center"
              >
                Why Choose HYNO?
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="mt-3 text-center dark:text-gray-300 text-slate-600 max-w-2xl mx-auto"
              >
                Experience healthcare that puts you first with cutting-edge technology and compassionate care.
              </motion.p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <FaShieldAlt className="text-3xl" />,
                    title: "Verified & Trusted",
                    desc: "All doctors are licensed and verified for your safety.",
                  },
                  {
                    icon: <FaAward className="text-3xl" />,
                    title: "Award-Winning Care",
                    desc: "Recognized for excellence in patient satisfaction.",
                  },
                  {
                    icon: <FaUsers className="text-3xl" />,
                    title: "24/7 Support",
                    desc: "Round-the-clock assistance whenever you need it.",
                  },
                  {
                    icon: <FaHeartbeat className="text-3xl" />,
                    title: "Holistic Wellness",
                    desc: "Comprehensive plans for body and mind.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="dark:bg-slate-800 bg-white rounded-2xl p-6 shadow-lg dark:shadow-gray-600/50 hover:shadow-xl dark:hover:shadow-cyan-500/20 transition group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full dark:bg-slate-700/50 bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center dark:text-cyan-300 text-teal-600 group-hover:scale-110 transition">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold dark:text-white text-slate-900 text-lg">
                        {item.title}
                      </h4>
                      <p className="text-sm dark:text-gray-300 text-slate-600 mt-2">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROMOTIONAL OFFERS */}
        <section className="py-14 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 text-center"
              >
                Special Offers & Promotions
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="mt-3 text-center dark:text-gray-300 text-slate-600 max-w-2xl mx-auto"
              >
                Take advantage of our limited-time offers to get the best healthcare at affordable prices.
              </motion.p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Free First Consultation",
                    desc: "Get your first video consultation absolutely free!",
                    icon: "🎁",
                    cta: "Claim Now",
                  },
                  {
                    title: "20% Off Wellness Plans",
                    desc: "Discount on personalized fitness and nutrition plans.",
                    icon: "💪",
                    cta: "Get Plan",
                  },
                  {
                    title: "COVID-19 Vaccination",
                    desc: "Available at all centers with priority booking.",
                    icon: "💉",
                    cta: "Book Slot",
                  },
                  {
                    title: "Nutrition Consultation - 50% Off",
                    desc: "Expert diet advice from certified nutritionists.",
                    icon: "🥗",
                    cta: "Consult Now",
                  },
                ].map((offer, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="dark:bg-slate-700 bg-white rounded-2xl p-6 shadow-lg dark:shadow-gray-600/50 hover:shadow-xl dark:hover:shadow-cyan-500/20 transition group"
                  >
                    <div className="text-4xl mb-4">{offer.icon}</div>
                    <h4 className="font-semibold dark:text-white text-slate-900 text-lg">
                      {offer.title}
                    </h4>
                    <p className="text-sm dark:text-gray-300 text-slate-600 mt-2">{offer.desc}</p>
                    <button className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition">
                      {offer.cta}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-14 dark:bg-slate-800 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 text-center"
              >
                How It Works
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="mt-3 text-center dark:text-gray-300 text-slate-600 max-w-2xl mx-auto"
              >
                Simple steps to get the care you need, from booking to recovery.
              </motion.p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: "01",
                    title: "Choose Your Doctor",
                    desc: "Browse verified doctors by specialty and availability.",
                    icon: <FaUserMd className="text-2xl" />,
                  },
                  {
                    step: "02",
                    title: "Book Appointment",
                    desc: "Select date, time, and consultation type (clinic/video).",
                    icon: <FaHeartbeat className="text-2xl" />,
                  },
                  {
                    step: "03",
                    title: "Consult & Get Prescriptions",
                    desc: "Meet your doctor virtually or in-person, receive care.",
                    icon: <FaPills className="text-2xl" />,
                  },
                  {
                    step: "04",
                    title: "Follow-Up & Wellness",
                    desc: "Track progress with personalized wellness plans.",
                    icon: <FaDumbbell className="text-2xl" />,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-center dark:bg-slate-700 bg-white rounded-2xl p-6 shadow-lg dark:shadow-gray-600/50 hover:shadow-xl dark:hover:shadow-cyan-500/20 transition group"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full dark:bg-slate-600/50 bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center dark:text-cyan-300 text-teal-600 group-hover:scale-110 transition">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full dark:bg-cyan-500 bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <h4 className="font-semibold dark:text-white text-slate-900 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-sm dark:text-gray-300 text-slate-600 mt-2">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section
          ref={statsRef}
          className="py-12 dark:bg-gradient-to-r dark:from-indigo-900 dark:to-violet-900 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="dark:bg-white/10 bg-white/10 p-6 rounded-2xl text-center">
                <FaUsers className="text-3xl mb-2" />
                <div className="text-2xl font-bold">
                  {useCountTo(10000, 1400, 0, statsInView).toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Happy Patients</div>
                <button
                  onClick={() => navigate("/home")}
                  className="mt-4 dark:bg-white/20 hover:bg-white/30 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  Join Us
                </button>
              </div>
              <div className="dark:bg-white/10 bg-white/10 p-6 rounded-2xl text-center">
                <FaUserMd className="text-3xl mb-2" />
                <div className="text-2xl font-bold">
                  {useCountTo(500, 1400, 0, statsInView)}
                </div>
                <div className="text-sm opacity-90">Expert Doctors</div>
                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-4 dark:bg-white/20 hover:bg-white/30 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  Meet Doctors
                </button>
              </div>
              <div className="dark:bg-white/10 bg-white/10 p-6 rounded-2xl text-center">
                <FaAward className="text-3xl mb-2" />
                <div className="text-2xl font-bold">
                  {useCountTo(50, 1400, 0, statsInView)}
                </div>
                <div className="text-sm opacity-90">Awards</div>
                <button
                  onClick={() => navigate("/about")}
                  className="mt-4 dark:bg-white/20 hover:bg-white/30 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  Learn More
                </button>
              </div>
              <div className="dark:bg-white/10 bg-white/10 p-6 rounded-2xl text-center">
                <FaShieldAlt className="text-3xl mb-2" />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm opacity-90">Success Rate</div>
                <button
                  onClick={() => navigate("/home")}
                  className="mt-4 dark:bg-white/20 hover:bg-white/30 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-14 dark:bg-slate-900 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 text-center"
              >
                Advanced Features
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="mt-3 text-center dark:text-gray-300 text-slate-600 max-w-2xl mx-auto"
              >
                Cutting-edge tools and services designed for modern healthcare.
              </motion.p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <FaHeartbeat className="text-3xl" />,
                    title: "AI-Powered Diagnostics",
                    desc: "Preliminary diagnosis assistance using advanced AI algorithms.",
                  },
                  {
                    icon: <FaShieldAlt className="text-3xl" />,
                    title: "Secure & Encrypted",
                    desc: "End-to-end encryption for all consultations and data.",
                  },
                  {
                    icon: <FaUsers className="text-3xl" />,
                    title: "Family Health Records",
                    desc: "Centralized health records for the entire family.",
                  },
                  {
                    icon: <FaAward className="text-3xl" />,
                    title: "Instant Prescriptions",
                    desc: "Digital prescriptions sent directly to pharmacies.",
                  },
                  {
                    icon: <FaAppleAlt className="text-3xl" />,
                    title: "Nutrition Tracking",
                    desc: "Integrated diet and nutrition monitoring tools.",
                  },
                  {
                    icon: <FaPills className="text-3xl" />,
                    title: "Auto-Refill Reminders",
                    desc: "Never miss a dose with smart medication reminders.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="dark:bg-slate-800 bg-white rounded-2xl p-6 shadow-lg dark:shadow-gray-600/50 hover:shadow-xl dark:hover:shadow-cyan-500/20 transition group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg dark:bg-slate-700/50 bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center dark:text-cyan-300 text-teal-600 group-hover:scale-110 transition">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold dark:text-white text-slate-900 text-lg">
                          {item.title}
                        </h4>
                        <p className="text-sm dark:text-gray-300 text-slate-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* DOCTORS (Slick Carousel) */}
        <section className="py-16 dark:bg-slate-900 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold dark:text-white text-slate-900 text-center">
              Meet Our Doctors
            </h3>
            <p className="text-center dark:text-gray-300 text-slate-600 mt-2">
              Experienced professionals across specialties
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
              {doctors.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="px-2 transform hover:scale-[1.01] transition min-h-[400px] flex-shrink-0 w-full lg:w-auto"
                >
                  <DoctorCard doc={d} onBook={handleBook} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS + CONTACT */}
        <section className="py-16 dark:bg-slate-800 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold dark:text-white text-slate-900">
                What patients say
              </h3>
              <p className="dark:text-gray-300 text-slate-600 mt-2">
                Real reviews from real users.
              </p>

              <div className="mt-6 space-y-4">
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="dark:bg-slate-700 bg-white rounded-2xl p-4 shadow dark:shadow-gray-600/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold dark:text-white">{t.name}</div>
                        <div className="text-sm dark:text-gray-400 text-slate-500">
                          {[...Array(t.rating)].map((_, i) => (
                            <FaStar
                              key={i}
                              className="inline text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 dark:text-gray-200 text-slate-700">{t.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="dark:bg-slate-700/60 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg dark:shadow-gray-600/50">
                <h3 className="text-xl font-semibold dark:text-white text-slate-900">
                  Request an Appointment
                </h3>
                <p className="text-sm dark:text-gray-300 text-slate-600 mt-1">
                  Fill details and we'll contact you to confirm.
                </p>

                <form
                  onSubmit={submitContact}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <label className="sr-only" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    required
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Age"
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />

                  <select
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Preferred Doctor (optional)"
                    value={formData.preferredDoctor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDoctor: e.target.value,
                      })
                    }
                  />

                  <input
                    type="date"
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white sm:col-span-1"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentDate: e.target.value,
                      })
                    }
                  />
                  <input
                    type="time"
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white sm:col-span-1"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentTime: e.target.value,
                      })
                    }
                  />

                  <textarea
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white sm:col-span-2"
                    rows="3"
                    placeholder="Describe symptoms"
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                  />

                  <select
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    value={formData.preferredContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContact: e.target.value,
                      })
                    }
                  >
                    <option value="">Preferred contact</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                  </select>

                  <select
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    value={formData.referralSource}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referralSource: e.target.value,
                      })
                    }
                  >
                    <option value="">How did you hear about us?</option>
                    <option value="google">Google</option>
                    <option value="social">Social</option>
                    <option value="friend">Friend</option>
                  </select>

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Insurance Provider (optional)"
                    value={formData.insuranceProvider}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insuranceProvider: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Emergency Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactName: e.target.value,
                      })
                    }
                  />

                  <input
                    className="p-3 rounded-lg border dark:border-gray-600 border-slate-200 dark:bg-slate-700 dark:text-white"
                    placeholder="Emergency Contact Phone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                  />

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white font-semibold hover:opacity-95"
                    >
                      Request Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER with animated SVG wave */}
      <footer className="relative dark:bg-slate-900 bg-slate-900 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <img src={assets.logo} alt="HYNO logo" className="w-28 mb-4" />
            <p className="text-sm text-slate-400 max-w-sm">
              HYNO — trusted healthcare at your fingertips. Book, consult, and
              get meds delivered with care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>About us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Newsletter</h4>
            <form onSubmit={submitNewsletter} className="flex gap-2">
              <input
                className="flex-1 p-3 rounded-lg text-slate-900"
                placeholder="Your email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-lg bg-emerald-400 text-slate-900 font-semibold"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-3">
              © {new Date().getFullYear()} HYNO. All rights reserved.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t dark:border-slate-700 border-slate-300">
          <div className="flex flex-wrap justify-center gap-6 opacity-70">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FaShieldAlt /> HIPAA Compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FaAward /> ISO Certified
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FaUsers /> 500+ Doctors
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FaHeartbeat /> 99.9% Uptime
            </div>
          </div>
        </div>

        <svg
          className="absolute left-0 bottom-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C300,0 1140,180 1440,20 L1440,100 L0,100 Z"
            fill="#111827"
            opacity="0.12"
          />
        </svg>
      </footer>

      {/* Floating Chat + ScrollToTop */}
      <div className="fixed right-6 bottom-24 z-50">
        <div className="animate-bounce p-2 bg-teal-500 rounded-full shadow-lg text-white">
          <LandingChat />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default LandingPage;

/* -------------------- Notes --------------------
1. Tailwind: some custom utilities (rotateY, backface-hidden) are implemented via inline styles above.
   If you want to make rotateY classes via plugin, we can add them to tailwind.config.js.
2. Framer Motion is used for entrance animations and `useInView`.
3. Replace asset paths in assets.* if names differ.
4. To wire backend: I can add axios/fetch for appointment POST in next step.
----------------------------------------------------------------- */
