import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Decorative glowing orbs */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Heading */}
      <motion.div
        className="text-center text-3xl md:text-4xl font-extrabold text-white relative z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p>
          CONTACT <span className="text-cyan-400">US</span>
        </p>
      </motion.div>

      {/* Content Section */}
      <div className="my-14 flex flex-col md:flex-row items-center gap-12 text-base relative z-10">
        {/* Image */}
        <motion.img
          className="w-full md:max-w-[360px] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.7)]"
          src={assets.contact_image}
          alt="Contact"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        />

        {/* Glassy Info Section */}
        <motion.div
          className="flex flex-col justify-center items-start gap-6 bg-white/10 backdrop-blur-xl border border-white/20 text-gray-200 p-8 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="font-semibold text-lg text-white">OUR OFFICE</p>
          <p className="text-gray-300 leading-relaxed">
            Ris International
            <br />
            Whitefield, 10th Cross, opposite Mercedes, Bengaluru, Karnataka
            560002
          </p>

          <p className="text-gray-300">
            📞 Tel: <span className="font-medium text-white">6362243163</span>
            <br />
            📧 Email:{" "}
            <span className="font-medium text-white">akhk4639@gmail.com</span>
          </p>

          <p className="font-semibold text-lg text-white">About HYNO</p>
          <p className="text-gray-300">Learn more about HYNO.</p>

          <motion.button
            className="px-8 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-2xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HYNO Management
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
