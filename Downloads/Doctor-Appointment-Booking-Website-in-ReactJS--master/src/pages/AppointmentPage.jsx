import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";

const AppointmentPage = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    reason: "",
  });
  const [success, setSuccess] = useState(false);

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

  const timeSlots = [
    { time: "09:00 AM", booked: false },
    { time: "10:00 AM", booked: true },
    { time: "11:00 AM", booked: false },
    { time: "02:00 PM", booked: true },
    { time: "03:00 PM", booked: false },
  ];

  const handleNext = () => {
    if (step === 5) {
      // Validate payment fields
      if (
        paymentMethod === "Card" &&
        (!cardDetails.number ||
          !cardDetails.expiry ||
          !cardDetails.cvv ||
          !cardDetails.name)
      )
        return;
      if (paymentMethod === "UPI" && (!upiId || !upiOtp)) return;
      if (paymentMethod === "Wallet" && !walletProvider) return;

      setSuccess(true);
      setTimeout(() => navigate("/my-appointments"), 3000);
    } else setStep((prev) => prev + 1);
  };

  const handleChange = (e) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-200 p-4 relative">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Book Your Appointment
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {["Doctor", "Date & Slot", "Details", "Summary", "Payment"].map(
            (label, idx) => (
              <div key={idx} className="flex-1 text-center relative">
                <div
                  className={`w-8 h-8 mx-auto rounded-full ${
                    step - 1 >= idx
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  } flex items-center justify-center font-bold`}
                >
                  {idx + 1}
                </div>
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
              <p className="text-gray-600 font-semibold">Select a doctor:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <motion.div
                    key={doc._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-xl hover:bg-purple-50 ${selectedDoctor?._id === doc._id ? "bg-purple-100 border-purple-500" : ""}`}
                    onClick={() => setSelectedDoctor(doc)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-gray-500 text-sm">{doc.speciality}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && selectedDoctor && (
            <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="space-y-4"
            >
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-2 text-center border rounded cursor-pointer transition-all ${
                      slot.booked
                        ? "bg-gray-200 cursor-not-allowed text-gray-400"
                        : selectedSlot === slot.time
                          ? "bg-purple-200 border-purple-500 font-semibold"
                          : "hover:bg-purple-50"
                    }`}
                    onClick={() => !slot.booked && setSelectedSlot(slot.time)}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
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
                <strong>Doctor:</strong> {selectedDoctor?.name}
              </p>
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedSlot}
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

              {/* Card UI */}
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

              {/* UPI */}
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

              {/* Wallet */}
              {paymentMethod === "Wallet" && (
                <div className="flex gap-2">
                  {["Paytm", "PhonePe", "GooglePay"].map((w) => (
                    <div
                      key={w}
                      className={`p-4 border rounded-lg cursor-pointer ${walletProvider === w ? "bg-purple-200" : ""}`}
                      onClick={() => setWalletProvider(w)}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg mt-6 w-full"
          onClick={handleNext}
        >
          {step === 5 ? "Confirm & Pay" : "Next"}
        </motion.button>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl text-center space-y-3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="text-5xl text-green-600">✅</div>
              <p className="text-lg font-semibold">
                Appointment Booked Successfully!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentPage;
