// src/components/Navbar.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "Doctors", href: "/doctors" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Appointments", href: "/appointment" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const currentItem = navItems.find((item) => item.href === location.pathname);
    if (currentItem) setActive(currentItem.name);

    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-gradient-to-r from-cyan-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-lg border-b border-cyan-400/30 shadow-lg"
          : "bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-10 py-3">
        {/* Left: Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            <span className="text-cyan-300">Medi</span>
            <span className="text-blue-400">Care+</span>
          </h1>
        </motion.div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/15 border border-white/25 rounded-full px-3 py-1 w-[280px] lg:w-[400px] backdrop-blur-md focus-within:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
        >
          <FaSearch className="text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search doctors, hospitals, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
          />
        </form>

        {/* Right: Menu Items */}
        <div className="hidden md:flex items-center gap-6 text-white font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setActive(item.name)}
              className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                active === item.name
                  ? "text-cyan-300 after:bg-cyan-400 after:scale-x-100"
                  : "text-gray-200 hover:text-white after:bg-cyan-400"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* User Dropdown */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:text-cyan-300"
              >
                <FaUser /> {user.name}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 bg-white rounded-xl shadow-lg w-44 text-gray-800 overflow-hidden"
                  >
                    <Link
                      to="/my-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 font-medium"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium text-red-500"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 rounded-full font-semibold hover:shadow-[0_0_12px_rgba(0,255,255,0.6)] transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/70 backdrop-blur-md border-t border-white/20 px-6 py-5 space-y-4"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1"
            >
              <FaSearch className="text-gray-300 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-white w-full placeholder-gray-300"
              />
            </form>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  setActive(item.name);
                  setMenuOpen(false);
                }}
                className={`block text-lg font-semibold text-white px-3 py-2 rounded-md transition ${
                  active === item.name
                    ? "bg-white/20 border border-cyan-400/40"
                    : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex justify-center pt-4">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-full text-white font-semibold"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-full font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
