// src/pages/DoctorDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DoctorDetail = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, user } = useContext(AppContext);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const doc = doctors.find((d) => d._id === docId);
    setDoctor(doc);
  }, [docId, doctors]);

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-48 h-48 object-cover rounded-lg bg-blue-50"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
          <p className="text-gray-600 text-lg mt-1">{doctor.speciality}</p>
          {doctor.about && <p className="text-gray-500 mt-4">{doctor.about}</p>}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => { if (!user) { navigate('/login'); } else { navigate(`/appointment/${doctor._id}`); } }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate("/doctors")}
              className="bg-gray-200 px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorDetail;
