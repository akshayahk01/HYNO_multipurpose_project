import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative rounded-t-2xl mt-20 text-white overflow-hidden">
      {/* Background with doctor photo */}
      <div className="absolute inset-0">
        <img
          src="/assets/contact_image.png"
          alt="Doctor with patient"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-800/80 to-purple-800/80" />
      </div>

      {/* Content */}
      <div className="relative md:mx-10 px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-10 py-12 text-sm"
        >
          {/* Left Section */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-4"
          >
            <motion.img
              className="w-36 drop-shadow-xl cursor-pointer"
              src={assets.logo}
              alt="HYNO Logo"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              onClick={() => handleNavigation("/")}
            />
            <p className="text-gray-200 leading-6">
              <span className="font-bold text-white">
                © 2025 HYNO — Healthcare Made Easy.
              </span>{" "}
              Book appointments anytime, anywhere 🚑.
            </p>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg font-semibold mb-4 text-yellow-300 drop-shadow-md animate-pulse">
              COMPANY
            </p>
            <ul className="flex flex-col gap-2 text-gray-200">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy-policy" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{
                    x: 6,
                    scale: 1.05,
                    color: "#facc15",
                    textShadow: "0px 0px 10px #fde047",
                  }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="cursor-pointer"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Get in Touch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg font-semibold mb-4 text-yellow-300 drop-shadow-md animate-pulse">
              GET IN TOUCH
            </p>
            <ul className="flex flex-col gap-3 text-gray-200">
              <motion.li
                whileHover={{
                  scale: 1.15,
                  color: "#fde047",
                  textShadow: "0px 0px 15px #fde047",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="cursor-pointer"
              >
                📞 6362243163
              </motion.li>
              <motion.li
                whileHover={{
                  scale: 1.15,
                  color: "#fde047",
                  textShadow: "0px 0px 15px #fde047",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="cursor-pointer"
              >
                📧 akhk4639@gmail.com
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative text-center pb-6"
        >
          <hr className="border-gray-300/40 mb-4" />
          <p className="text-xs text-gray-200 tracking-wide">
            🚀 Copyright 2025 @{" "}
            <span className="font-semibold text-yellow-300 drop-shadow-md">
              HYNO_MANAGEMENT
            </span>{" "}
            | All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
