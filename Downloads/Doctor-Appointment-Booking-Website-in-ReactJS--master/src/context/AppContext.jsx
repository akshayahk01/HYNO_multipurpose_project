// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { doctors as staticDoctors } from "../assets/assets.js";
import hospitals from "../assets/hospitals.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState(staticDoctors);
  const [appointments, setAppointments] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const currencySymbol = "₹";

  // ✅ Fetch logged-in user info from localStorage or API
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // ✅ Load appointments from localStorage
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
    if (storedAppointments) setAppointments(storedAppointments);
  }, []);

  AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // ✅ Fetch doctors from backend (fallback to static if API fails)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // Keep static doctors
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Book appointment function (local mock)
  const bookAppointment = async (userId, payload) => {
    try {
      // Mock API call - create appointment locally
      const newAppt = {
        _id: Date.now().toString(),
        userId,
        ...payload,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      setAppointments((prev) => {
        const updated = [...prev, newAppt];
        localStorage.setItem("appointments", JSON.stringify(updated));
        return updated;
      }); // update context state and persist
      return newAppt;
    } catch (err) {
      console.error("Booking error:", err);
      throw err;
    }
  };

  // ✅ Fetch appointments for logged-in user (local mock)
  const fetchUserAppointments = async (userId) => {
    try {
      // Mock API call - return local appointments for the user
      const userAppts = appointments.filter((appt) => appt.userId === userId);
      setAppointments(userAppts);
    } catch (err) {
      console.error("Error fetching user appointments:", err);
    }
  };

  // ✅ Toggle Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        doctors,
        hospitals,
        currencySymbol,
        appointments,
        setAppointments,
        bookAppointment,
        fetchUserAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
   );
};
