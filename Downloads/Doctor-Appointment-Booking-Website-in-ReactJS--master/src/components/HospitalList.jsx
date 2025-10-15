// src/pages/HospitalList.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaHeart, FaRegHeart, FaMap, FaListUl, FaStar, FaSearch, FaCrosshairs } from "react-icons/fa";

// Leaflet icons fix
import markerIcon2xPngUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconPngUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowPngUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xPngUrl,
  iconUrl: markerIconPngUrl,
  shadowUrl: markerShadowPngUrl,
});

// Haversine formula to calculate distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Locate user component
const LocateUser = ({ setUserPos }) => {
  const map = useMap();
  const handleLocate = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        map.setView([latitude, longitude], 13);
      },
      () => alert("Unable to retrieve your location")
    );
  };

  return (
    <button
      onClick={handleLocate}
      className="absolute top-3 right-3 z-50 px-3 py-2 rounded-full bg-white dark:bg-slate-800 shadow flex items-center gap-2 hover:bg-cyan-500 hover:text-white transition"
    >
      <FaCrosshairs /> Locate Me
    </button>
  );
};

const HospitalList = () => {
  const { hospitals = [] } = useContext(AppContext);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [mapView, setMapView] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("savedHospitals") || "[]"); } catch { return []; }
  });
  const [userPos, setUserPos] = useState(null); 
  const mapRef = useRef();

  const allDepartments = Array.from(new Set(hospitals.flatMap(h => h.departments)));

  const filteredHospitals = hospitals.filter(h => {
    const matchFilter = filter ? h.departments.includes(filter) : true;
    const matchSearch = search
      ? h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.departments.join(", ").toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  const toggleSave = (id) => {
    const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem("savedHospitals", JSON.stringify(next));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orbX = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    if (mapView && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [mapView]);

  return (
    <div className={`min-h-screen relative p-6 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gradient-to-br from-blue-50 to-cyan-50 text-slate-900'}`}>
      
      {/* Parallax Orbs */}
      <motion.div style={{ y: orbY, x: orbX }} className="pointer-events-none fixed left-8 top-28 w-44 h-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <motion.div style={{ y: orbY }} className="pointer-events-none fixed right-16 bottom-24 w-56 h-56 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">Hospitals Portal</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full shadow ${darkMode ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setMapView(!mapView)} className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 shadow flex items-center gap-2">
            {mapView ? <><FaListUl/> List</> : <><FaMap/> Map</>}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className={`flex items-center w-full md:w-2/3 rounded-full shadow-md border ${darkMode ? 'bg-slate-800/70 border-gray-700' : 'bg-white/90 border-blue-100'} px-3`}>
          <FaSearch className={`text-gray-400 ${darkMode ? 'text-gray-300' : ''}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hospitals, departments, city..." className={`flex-1 px-4 py-3 bg-transparent focus:outline-none ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full transition ${filter === "" ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105' : 'bg-white/20 text-cyan-200 border border-cyan-400 hover:bg-cyan-500/30 hover:text-white'}`}
            onClick={() => setFilter("")}
          >
            All
          </button>
          {allDepartments.map(dep => (
            <button
              key={dep}
              className={`px-4 py-2 rounded-full transition ${filter === dep ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105' : 'bg-white/20 text-cyan-200 border border-cyan-400 hover:bg-cyan-500/30 hover:text-white'}`}
              onClick={() => setFilter(dep)}
            >
              {dep}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {mapView ? (
        <div className="h-96 relative rounded-lg overflow-hidden border">
          <MapContainer ref={mapRef} center={userPos || [12.97, 77.59]} zoom={13} className="h-full w-full">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocateUser setUserPos={setUserPos} />
            {userPos && <Marker position={userPos}><Popup>Your Location</Popup></Marker>}
            {filteredHospitals.map(h => {
              const lat = Number(h.coords?.[0] || 12.97 + Math.random() * 0.05);
              const lng = Number(h.coords?.[1] || 77.59 + Math.random() * 0.05);
              return (
                <Marker key={h.id} position={[lat, lng]}>
                  <Popup>
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs">{h.departments.join(", ")}</div>
                    {userPos && <div className="text-xs mt-1 text-slate-700 dark:text-slate-200">
                      Distance: {getDistance(userPos[0], userPos[1], lat, lng).toFixed(1)} km
                    </div>}
                    <div className="mt-2">
                      <Link to={`/hospitals/${h.id}`} className="px-2 py-1 bg-blue-600 text-white rounded">View</Link>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredHospitals.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 mt-12">No hospitals found</div>
            ) : (
              filteredHospitals.map((h, i) => {
                const distance = userPos ? getDistance(userPos[0], userPos[1], h.coords?.[0] || 12.97, h.coords?.[1] || 77.59).toFixed(1) : null;
                return (
                  <motion.div
                    key={h.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white/10 dark:bg-slate-800 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 hover:scale-105 hover:shadow-cyan-400/30 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img src={h.image} alt={h.name} className="w-full h-44 object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" />
                      <button onClick={() => toggleSave(h.id)} className="absolute top-3 right-3 text-white">
                        {saved.includes(h.id) ? <FaHeart className="text-pink-400 text-xl animate-pulse" /> : <FaRegHeart className="text-white text-xl" />}
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-cyan-300 mb-1">{h.name}</h2>
                    <p className="text-gray-300 mb-1">{h.address}</p>
                    <p className="text-gray-400 text-sm mb-2">Departments: <span className="text-cyan-200">{h.departments.join(", ")}</span></p>
                    {distance && <p className="text-green-400 font-semibold mb-2">{distance} km away</p>}
                    <div className="flex items-center mb-3 gap-2">
                      {[...Array(5)].map((_, idx) => <FaStar key={idx} className={idx < Math.round(h.rating) ? 'text-yellow-400' : 'text-gray-500'} />)}
                      <span className="text-sm text-gray-400 ml-1">{h.rating}</span>
                    </div>
                    <Link to={`/hospitals/${h.id}`} className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-cyan-400/40 hover:scale-105 transition-transform duration-300">View Details</Link>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default HospitalList;
