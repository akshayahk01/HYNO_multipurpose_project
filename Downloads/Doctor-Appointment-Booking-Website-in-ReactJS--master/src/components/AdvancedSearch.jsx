import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaSort, FaMicrophone, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdvancedSearch = ({ onSearchResults }) => {
  const { doctors = [] } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [filters, setFilters] = useState({
    availability: "",
    rating: "",
    priceRange: "",
    gender: "",
    experience: "",
    insurance: ""
  });
  const [sortBy, setSortBy] = useState("rating");
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Voice search
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };

    recognition.start();
  };

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Reverse geocode to get location name
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            .then(res => res.json())
            .then(data => {
              setLocation(`${data.city}, ${data.countryName}`);
            });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Filter and sort doctors
  const filterDoctors = () => {
    let filtered = [...doctors];

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.about && doctor.about.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(doctor =>
        doctor.location && doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Speciality filter
    if (speciality) {
      filtered = filtered.filter(doctor =>
        doctor.speciality.toLowerCase() === speciality.toLowerCase()
      );
    }

    // Advanced filters
    if (filters.rating) {
      filtered = filtered.filter(doctor => (doctor.rating || 0) >= parseFloat(filters.rating));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      filtered = filtered.filter(doctor => {
        const fee = doctor.fee || 500;
        return fee >= min && (max ? fee <= max : true);
      });
    }

    if (filters.experience) {
      filtered = filtered.filter(doctor => (doctor.experience || 0) >= parseInt(filters.experience));
    }

    if (filters.gender) {
      filtered = filtered.filter(doctor => doctor.gender === filters.gender);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.fee || 500) - (b.fee || 500);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'distance':
          // Simple distance calculation if coordinates available
          return 0; // Placeholder
        default:
          return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    const results = filterDoctors();
    onSearchResults && onSearchResults(results);
  }, [searchTerm, location, speciality, filters, sortBy, doctors]);

  const specialities = [...new Set(doctors.map(d => d.speciality))];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors, specialties, or conditions..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={startVoiceSearch}
            className={`absolute right-3 top-3 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <FaMicrophone />
          </button>
        </div>

        <div className="flex-1 relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Location (city, area)"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={getCurrentLocation}
            className="absolute right-3 top-3 text-gray-400 hover:text-blue-500"
            title="Use current location"
          >
            📍
          </button>
        </div>

        <select
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
        >
          <option value="">All Specialities</option>
          {specialities.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
        <select
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="rating">Highest Rated</option>
          <option value="price">Lowest Price</option>
          <option value="experience">Most Experienced</option>
          <option value="distance">Nearest</option>
        </select>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Rating
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Range (₹)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                >
                  <option value="">Any Price</option>
                  <option value="0-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="2000">Above ₹2000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience (Years)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                >
                  <option value="">Any Experience</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                  <option value="20">20+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={filters.gender}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Insurance Accepted
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={filters.insurance}
                  onChange={(e) => setFilters({...filters, insurance: e.target.value})}
                >
                  <option value="">Any Insurance</option>
                  <option value="yes">Insurance Accepted</option>
                  <option value="no">Self Pay Only</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    availability: "",
                    rating: "",
                    priceRange: "",
                    gender: "",
                    experience: "",
                    insurance: ""
                  })}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
