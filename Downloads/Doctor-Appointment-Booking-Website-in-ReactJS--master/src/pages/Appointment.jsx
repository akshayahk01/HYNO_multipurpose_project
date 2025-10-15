
// src/pages/Appointment.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentSuccess from "../components/AppointmentSuccess";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, user, bookAppointment } =
    useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || "",
    age: user?.age || "",
    contact: user?.phone || "",
    email: user?.email || "",
    reason: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [upiOtp, setUpiOtp] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSMSSuccess, setShowSMSSuccess] = useState(false);

  // Load doctor info from context
  useEffect(() => {
    if (!doctors.length) return;
    const doc = doctors.find((d) => d._id === docId);
    setDocInfo(doc);
  }, [docId, doctors]);

  // Generate next 7 days slots
  useEffect(() => {
    if (!docInfo) return;

    const slots = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const daySlots = [];
      let hour = 10;
      let minute = 0;
      while (hour < 21) {
        const slotTime = new Date(currentDate);
        slotTime.setHours(hour, minute, 0, 0);
        daySlots.push({
          datetime: new Date(slotTime),
          time: slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        minute += 30;
        if (minute === 60) {
          minute = 0;
          hour += 1;
        }
      }
      slots.push(daySlots);
    }
    setDocSlots(slots);
  }, [docInfo]);

  // Send SMS confirmation
  const sendSMS = async () => {
    if (!user?.phone || !selectedSlot) return;
    try {
      await fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.phone,
          message: `Your appointment with Dr. ${docInfo.name} on ${selectedSlot.datetime.toDateString()} at ${selectedSlot.time} is confirmed!`,
        }),
      });
      setShowSMSSuccess(true);
    } catch (err) {
      console.error("SMS failed", err);
    }
  };

  // Handle Next / Confirm button
  const handleNext = async () => {
    if (step === 5) {
      // Payment validation
      if (
        paymentMethod === "Card" &&
        (!cardDetails.number ||
          !cardDetails.name ||
          !cardDetails.expiry ||
          !cardDetails.cvv)
      )
        return;
      if (paymentMethod === "UPI" && (!upiId || !upiOtp)) return;
      if (paymentMethod === "Wallet" && !walletProvider) return;

      if (!user?.id) {
        navigate('/login');
        return;
      }

      const payload = {
        doctorId: docInfo._id,
        hospitalId: docInfo.hospitalId || null,
        appointmentDate: selectedSlot.datetime.toISOString(),
        patientName: patientDetails.name,
        patientAge: Number(patientDetails.age),
        patientContact: patientDetails.contact,
        patientEmail: patientDetails.email,
        reason: patientDetails.reason,
        paymentMethod,
        paid: true,
      };

      try {
        await bookAppointment(user.id, payload);
        setSuccess(true);
        await sendSMS();
        setTimeout(() => navigate("/my-appointments"), 3000);
      } catch (err) {
        console.error("Booking failed:", err);
        alert(`❌ Booking failed: ${err.message}`);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleChange = (e) =>
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });

  if (!docInfo)
    return (
      <p className="text-center mt-10 text-purple-700 font-semibold">
        Loading doctor info...
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-200 p-4">
      <motion.div
        className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center animate-pulse">
          Book Your Appointment
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {["Doctor", "Slot", "Details", "Summary", "Payment"].map(
            (label, idx) => (
              <div key={idx} className="flex-1 text-center relative">
                <motion.div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                    step - 1 >= idx
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.2 }}
                >
                  {idx + 1}
                </motion.div>
                <p className="text-xs mt-1">{label}</p>
              </div>
            ),
          )}
        </div>

        {/* Step Content */}
        <AnimatePresence exitBeforeEnter>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-4 items-center">
                <motion.img
                  src={docInfo.image || "https://via.placeholder.com/150"}
                  alt={docInfo.name}
                  className="w-28 h-28 rounded-lg object-cover"
                  whileHover={{ scale: 1.05 }}
                />
                <div>
                  <p className="text-xl font-semibold">{docInfo.name}</p>
                  <p className="text-gray-600">
                    {docInfo.degree} - {docInfo.speciality}
                  </p>
                  <p className="text-gray-500 mt-1">{docInfo.about}</p>
                  <p className="text-gray-700 mt-2 font-medium">
                    Fee: {currencySymbol}
                    {docInfo.fees}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
            >
              <p className="mb-2 font-semibold text-gray-600">Select a date:</p>
              <div className="flex gap-3 overflow-x-scroll mb-4">
                {docSlots.map((daySlots, idx) => (
                  <motion.div
                    key={idx}
                    className={`text-center py-4 px-2 rounded-lg cursor-pointer ${
                      selectedDateIndex === idx
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedDateIndex(idx);
                      setSelectedSlot(null);
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                    <p>{daySlots[0].datetime.getDate()}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mb-2 font-semibold text-gray-600">
                Select a time slot:
              </p>
              <div className="flex gap-2 flex-wrap">
                {docSlots[selectedDateIndex]?.map((slot, idx) => (
                  <motion.div
                    key={idx}
                    className={`px-4 py-2 rounded-full cursor-pointer border ${
                      selectedSlot?.time === slot.time
                        ? "bg-purple-600 text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {slot.time}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border p-2 rounded w-full"
                value={patientDetails.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="border p-2 rounded w-full"
                value={patientDetails.age}
                onChange={handleChange}
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                className="border p-2 rounded w-full"
                value={patientDetails.contact}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 rounded w-full"
                value={patientDetails.email}
                onChange={handleChange}
              />
              <textarea
                name="reason"
                placeholder="Reason"
                className="border p-2 rounded w-full"
                value={patientDetails.reason}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="space-y-4 p-4 border rounded-xl shadow-lg bg-purple-50"
            >
              <h2 className="text-purple-700 font-semibold text-lg">Summary</h2>
              <p>
                <strong>Doctor:</strong> {docInfo.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedSlot?.datetime.toDateString() || "-"}
              </p>
              <p>
                <strong>Time:</strong> {selectedSlot?.time || "-"}
              </p>
              <p>
                <strong>Patient:</strong> {patientDetails.name}
              </p>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-600 font-semibold">
                Choose Payment Method:
              </p>
              <select
                className="border p-2 rounded w-full"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
              </select>
              {paymentMethod === "Card" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="border p-2 rounded w-full"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="border p-2 rounded w-full"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, name: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="border p-2 rounded flex-1"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiry: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="border p-2 rounded flex-1"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "UPI" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    className="border p-2 rounded w-full"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border p-2 rounded w-full"
                    value={upiOtp}
                    onChange={(e) => setUpiOtp(e.target.value)}
                  />
                </div>
              )}
              {paymentMethod === "Wallet" && (
                <input
                  type="text"
                  placeholder="Wallet Provider"
                  className="border p-2 rounded w-full"
                  value={walletProvider}
                  onChange={(e) => setWalletProvider(e.target.value)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next / Confirm Button */}
        {!success && (
          <button
            className="mt-6 w-full bg-purple-600 text-white p-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            onClick={handleNext}
          >
            {step === 5 ? "Confirm Appointment" : "Next"}
          </button>
        )}

        {/* Success Message */}
        {success && <AppointmentSuccess showSMSSuccess={showSMSSuccess} />}
      </motion.div>
    </div>
  );
};

export default Appointment;
