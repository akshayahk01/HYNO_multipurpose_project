// src/pages/SubscribePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Monthly",
    price: "₹499",
    features: [
      "Unlimited Video Consultations",
      "Yoga & Fitness Plans",
      "Nutrition Guidance",
      "Priority Support",
    ],
    bg: "bg-blue-500",
  },
  {
    name: "Yearly",
    price: "₹3999",
    features: [
      "All Monthly Features",
      "2 Months Free",
      "Exclusive Diet Plans",
      "Early Access to New Services",
    ],
    bg: "bg-blue-700",
  },
];

const testimonials = [
  { name: "Pavithra", review: "Amazing consultations, highly recommend!" },
  { name: "Akshay", review: "Yoga & fitness plans changed my routine!" },
  { name: "John", review: "Nutrition guidance is top-notch!" },
];

const TRIAL_SECONDS = 60;

const SubscribePage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(TRIAL_SECONDS);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0",
    )}`;

  const handlePayment = (plan) => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
    navigate("/payment", { state: { plan } });
  };

  const progressPercent = Math.min(
    100,
    Math.round(((TRIAL_SECONDS - timeLeft) / TRIAL_SECONDS) * 100),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-start p-4">
      {/* Confetti simulation using emojis */}
      {confetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
        >
          {Array.from({ length: 50 }).map((_, idx) => (
            <motion.span
              key={idx}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}vh`,
              }}
              animate={{ y: "120vh", rotate: 360 }}
              transition={{
                duration: 2 + Math.random() * 1,
                repeat: 0,
                ease: "linear",
              }}
            >
              🎉
            </motion.span>
          ))}
        </motion.div>
      )}

      <motion.h1
        className="text-5xl font-bold text-blue-700 my-6 animate-pulse"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Upgrade to Premium
      </motion.h1>

      {/* Free Trial Timer */}
      <motion.div
        className="w-full max-w-xl bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full text-center mb-6 shadow-md animate-bounce"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Free Trial Ends in: {formatTime(timeLeft)}
        <div className="w-full h-2 bg-yellow-200 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-2xl shadow-xl flex flex-col justify-between border-l-4 border-blue-500 hover:scale-105 transition-transform bg-white relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{plan.name}</h2>
              <p className="text-4xl font-extrabold text-gray-900 mt-2">
                {plan.price}
              </p>
              <span className="absolute top-2 right-2 text-sm text-white bg-green-500 px-2 py-1 rounded-full animate-pulse">
                Best Value
              </span>
            </div>

            <ul className="flex flex-col gap-2 mb-4">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500 font-bold animate-bounce">
                    ✔
                  </span>{" "}
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePayment(`${plan.name} ${plan.price}`)}
              className={`${plan.bg} text-white px-6 py-3 rounded-lg shadow-md font-semibold relative overflow-hidden`}
            >
              Subscribe Now
              <motion.span
                className="absolute top-0 left-0 w-full h-full bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <motion.div
        className="w-full max-w-4xl flex flex-col md:flex-row gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-lg flex-1 hover:scale-105 transition-transform relative"
          >
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <span key={starIdx} className="text-yellow-400 text-sm">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 italic">"{t.review}"</p>
            <p className="text-gray-500 font-semibold mt-2">- {t.name}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center text-gray-500 text-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Cancel anytime. Secure payments. No hidden fees.
      </motion.div>
    </div>
  );
};

export default SubscribePage;
