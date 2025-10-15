import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Initial sample testimonials
const sampleTestimonials = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    role: "Cardiologist",
    feedback:
      "This hospital provides exceptional care. Staff are friendly and highly professional!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Patient",
    feedback:
      "I felt very comfortable and safe throughout my treatment. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 4,
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    feedback: "",
    image: "",
    rating: 5,
  });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setTestimonials(sampleTestimonials);
    }, 500);
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit testimonial
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTestimonial = { ...formData, id: Date.now() };
    setTestimonials([newTestimonial, ...testimonials]);
    setFormData({ name: "", role: "", feedback: "", image: "", rating: 5 });
    setSuccess("✅ Testimonial submitted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-800 py-16 px-6 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-cyan-500/20 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 blur-[200px] rounded-full animate-pulse delay-200"></div>

      <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 drop-shadow-lg animate-fade-in">
        What People Are Saying
      </h1>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 mb-16">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.2,
              duration: 0.7,
              type: "spring",
              stiffness: 120,
            }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={t.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
              alt={t.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-cyan-400 shadow-md"
            />
            <h2 className="text-xl font-semibold text-cyan-300 mb-1">
              {t.name}
            </h2>
            <p className="text-sm text-gray-300 mb-3 italic">{t.role}</p>
            <p className="text-gray-200 mb-4">"{t.feedback}"</p>
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
              {Array.from({ length: 5 - t.rating }).map((_, i) => (
                <span key={i} className="text-gray-500 text-lg">
                  ★
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Testimonial Form */}
      <motion.div
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
          Share Your Experience
        </h2>
        {success && (
          <p className="text-green-400 text-center font-semibold mb-4 animate-pop-in">
            {success}
          </p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Your Role (Patient / Doctor)"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <textarea
            name="feedback"
            placeholder="Your Feedback"
            value={formData.feedback}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="py-2"
          />
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transition-transform duration-300"
          >
            Submit Testimonial
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Testimonials;
