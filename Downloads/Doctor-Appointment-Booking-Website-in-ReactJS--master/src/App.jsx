// src/App.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Hospitals from "./pages/Hospitals";
import HospitalDetail from "./pages/HospitalDetail";
import BookHospitalAppointment from "./pages/BookHospitalAppointment";
import AdminPage from "./pages/AdminPage";
import SubscribePage from "./pages/SubscribePage";
import PaymentPage2 from "./pages/PaymentPage2";
import HealthJournal from "./pages/HealthJournal";

import OnlineAppointment from "./components/OnlineAppointment";
import CallRoom from "./components/CallRoom";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smoother feel
  duration: 0.8,
};

const App = () => {
  const location = useLocation();

  const isFullScreenPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <div className="w-full min-w-full max-w-full overflow-x-hidden">
      {!isFullScreenPage && <Navbar />}
      <AnimatePresence exitBeforeEnter>
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className={`w-full max-w-7xl mx-auto px-4 pb-8 ${!isFullScreenPage ? 'pt-20' : ''}`}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/doctor/:docId" element={<DoctorDetail />} />

            <Route path="/appointment" element={<OnlineAppointment />} />
            <Route path="/appointment/:docId" element={<Appointment />} />

            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:hospitalId" element={<HospitalDetail />} />
            <Route
              path="/hospitals/:hospitalId/book"
              element={<BookHospitalAppointment />}
            />

            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />

            <Route path="/admin" element={<AdminPage />} />
            <Route path="/call" element={<CallRoom roomId="room1" />} />

            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/payment" element={<PaymentPage2 />} />
            <Route path="/health-journal" element={<HealthJournal />} />

            <Route
              path="*"
              element={
                <h1 className="text-center mt-20 text-2xl">
                  404 - Page Not Found
                </h1>
              }
            />
          </Routes>
        </motion.main>
      </AnimatePresence>
      {!isFullScreenPage && <Footer />}
    </div>
  );
};

export default App;
