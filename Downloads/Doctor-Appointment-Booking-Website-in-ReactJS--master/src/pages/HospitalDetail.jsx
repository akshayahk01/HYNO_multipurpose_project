import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaGlobe, FaStar, FaBed, FaUserMd, FaAmbulance, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const { hospitals } = useContext(AppContext);
  const hospital = hospitals.find((h) => String(h.id) === String(hospitalId));

  if (!hospital)
    return (
      <div className="text-center py-20 text-xl text-red-500 animate-fade-in">
        ❌ Hospital not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Hospital Banner */}
        <motion.div
          className="relative"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-4xl font-extrabold mb-2">{hospital.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold">{hospital.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBed />
                <span>{hospital.bedCount} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUserMd />
                <span>{hospital.doctorsCount} doctors</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{hospital.about}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Departments</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {hospital.departments.map((dept, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {dept}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Services</h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {hospital.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <FaAmbulance className="text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>

                {/* Reviews */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Patient Reviews</h3>
                <div className="space-y-4">
                  {hospital.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                className="bg-gray-50 p-6 rounded-lg"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="text-gray-600">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-500" />
                    <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">
                      {hospital.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-red-500" />
                    <a href={`mailto:${hospital.email}`} className="text-blue-600 hover:underline">
                      {hospital.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-purple-500" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-500" />
                    <span className="text-gray-600">24/7 Emergency: {hospital.emergencyContact}</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/hospitals/${hospital.id}/book`}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-4 rounded-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 text-center block"
                >
                  🚑 Book Appointment
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalDetail;
