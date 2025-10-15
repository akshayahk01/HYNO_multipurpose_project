import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

// Particle generator
const generateParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 + "vw",
    y: Math.random() * 100 + "vh",
    size: Math.random() * 6 + 2 + "px",
    color: `rgba(255,255,255,${Math.random() * 0.08})`,
    speedX: (Math.random() - 0.5) / 3,
    speedY: (Math.random() - 0.5) / 3,
  }));

const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState(generateParticles(50));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: `calc(${parseFloat(p.x)}vw + ${p.speedX}px)`,
          y: `calc(${parseFloat(p.y)}vh + ${p.speedY}px)`,
        })),
      );
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (state === "Sign Up") {
        const res = await axios.post(`${API_BASE}/signup`, {
          name,
          email,
          phone,
          password,
        });
        setSuccess(res.data?.message || "Account created successfully!");
        setState("Login");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      } else {
        const res = await axios.post(`${API_BASE}/login`, { email, password });
        if (res.status === 200) {
          const userData = res.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/my-profile");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again.",
      );
    }
  };

  // Dynamic advertisement content
  const adContent =
    state === "Login"
      ? {
          title: "Welcome Back!",
          subtitle: "Login to manage your appointments and track your health.",
          boxes: [
            {
              text: "Access Medical Records",
              gradient: "from-blue-400 to-indigo-500",
            },
            {
              text: "Book Trusted Doctors",
              gradient: "from-green-400 to-teal-500",
            },
            { text: "24/7 Support", gradient: "from-pink-400 to-purple-500" },
          ],
          bg: "from-blue-500 via-purple-600 to-indigo-700",
        }
      : {
          title: "Join Us Today!",
          subtitle:
            "Sign up to access our platform and start managing appointments easily.",
          boxes: [
            {
              text: "Secure Registration",
              gradient: "from-yellow-400 to-orange-500",
            },
            {
              text: "Verified Specialists",
              gradient: "from-pink-400 to-red-500",
            },
            {
              text: "Instant Notifications",
              gradient: "from-green-400 to-lime-500",
            },
          ],
          bg: "from-purple-500 via-pink-500 to-red-600",
        };

  return (
    <motion.div
      className="relative min-h-screen flex overflow-hidden bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Particles */}
      {particles.map((p) => (
        <div
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

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <AnimatePresence mode="wait">
          <motion.form
            key={state}
            onSubmit={onSubmitHandler}
            initial={{ x: state === "Login" ? -200 : 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: state === "Login" ? 200 : -200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 flex flex-col gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
          >
            <h2 className="text-3xl font-semibold text-center">
              {state === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-center text-gray-300 text-sm mb-3">
              {state === "Sign Up"
                ? "Join us and start managing your appointments easily."
                : "Login to continue to your dashboard."}
            </p>

            {error && (
              <p className="text-red-400 text-center text-sm font-medium">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-400 text-center text-sm font-medium">
                {success}
              </p>
            )}

            <AnimatePresence>
              {state === "Sign Up" && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Full Name"
                      className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Phone Number"
                      className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-blue-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-blue-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-md font-semibold shadow-lg hover:shadow-blue-500/40 transition duration-300"
            >
              {state === "Sign Up" ? "Create Account" : "Login"}
            </motion.button>

            {state === "Login" && (
              <div className="text-center mt-2">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-400 underline cursor-pointer text-sm font-medium"
                >
                  Forgot Password?
                </span>
              </div>
            )}

            <div className="text-center text-gray-300 text-sm mt-3">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => setState("Login")}
                    className="text-blue-400 underline cursor-pointer font-medium"
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setState("Sign Up")}
                    className="text-blue-400 underline cursor-pointer font-medium"
                  >
                    Create one
                  </span>
                </p>
              )}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>

      {/* Right side - Animated Advertisement */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col justify-center items-center p-10 rounded-2xl overflow-hidden"
          >
            {/* Animated Gradient Background */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${adContent.bg} blur-3xl opacity-60`}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Glow Orbs */}
            {Array.from({ length: 8 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(10px)",
                }}
                animate={{
                  x: [0, 30, -30, 0],
                  y: [0, -20, 20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10 + Math.random() * 6,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

            {/* Text & Feature Boxes */}
            <motion.div
              className="relative z-10 space-y-6 text-center max-w-md"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.h2
                className="text-5xl font-extrabold text-white drop-shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {adContent.title}
              </motion.h2>

              <motion.p
                className="text-lg text-white/90"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {adContent.subtitle}
              </motion.p>

              <motion.div
                className="space-y-4 mt-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.2, delayChildren: 0.6 },
                  },
                }}
              >
                {adContent.boxes.map((box, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 30, rotateX: 90 },
                      visible: { opacity: 1, y: 0, rotateX: 0 },
                    }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.07,
                      rotate: 1,
                      boxShadow: "0 0 25px rgba(255,255,255,0.4)",
                    }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${box.gradient} shadow-lg text-white font-semibold cursor-pointer`}
                  >
                    {box.text}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Login;
