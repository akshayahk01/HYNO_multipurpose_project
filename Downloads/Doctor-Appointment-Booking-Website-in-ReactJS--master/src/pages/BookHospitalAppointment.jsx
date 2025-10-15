import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaCreditCard, FaCheck } from "react-icons/fa";

const BookHospitalAppointment = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { hospitals, user, bookAppointment } = useContext(AppContext);
  const hospital = hospitals.find((h) => String(h.id) === String(hospitalId));

  const [step, setStep] = useState(1);
  const [showOTP, setShowOTP] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    age: "",
    contact: user?.phone || "",
    email: user?.email || "",
    symptoms: "",
    department: "",
    paymentMethod: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
  });

  // Generate available time slots
  useEffect(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    setAvailableSlots(slots);
  }, []);

  if (!hospital) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-800 text-2xl font-semibold text-red-400">
        ❌ Hospital not found.
      </div>
    );
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleNext = () => {
    if (step === 1 && !selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    if (step === 3 && formData.paymentMethod) {
      setShowOTP(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleConfirmOTP = async () => {
    if (enteredOTP === "1234") {
      setShowOTP(false);

      try {
        if (!user?.id) {
          alert("❌ Please login before booking an appointment.");
          return;
        }

        const payload = {
          hospitalId,
          hospitalName: hospital.name,
          patientName: formData.patientName,
          age: Number(formData.age),
          contact: formData.contact,
          email: formData.email,
          date: selectedSlot.date,
          time: selectedSlot.time,
          symptoms: formData.symptoms,
          department: formData.department,
          paymentMethod: formData.paymentMethod,
          amount: 500, // Fixed consultation fee
        };

        await bookAppointment(user.id, payload);
        setStep(4);
      } catch (err) {
        console.error("Error booking appointment:", err);
        alert(`❌ Booking failed: ${err.message}`);
      }
    } else {
      alert("❌ Invalid OTP! Please try again.");
    }
  };

  const handleInvoiceDownload = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(18);
    doc.text("Hospital Appointment Invoice", 20, 25);

    // Hospital & Patient Info
    doc.setTextColor("#000");
    doc.setFontSize(12);
    doc.autoTable({
      startY: 50,
      head: [["Field", "Details"]],
      body: [
        ["Hospital", hospital.name],
        ["Patient Name", formData.patientName],
        ["Age", formData.age],
        ["Contact", formData.contact],
        ["Email", formData.email],
        ["Date", selectedSlot?.date],
        ["Time", selectedSlot?.time],
        ["Department", formData.department],
        ["Symptoms", formData.symptoms],
        ["Payment Method", formData.paymentMethod],
        ["Amount", "₹500"],
      ],
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text(
      "✅ Thank you for booking with Hyno Health. Wishing you good health!",
      20,
      doc.internal.pageSize.height - 20,
    );

    doc.save(`Invoice_${formData.patientName}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-800">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full animate-pulse delay-200"></div>

      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">
          Book Appointment at{" "}
          <span className="text-white">{hospital.name}</span>
        </h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 relative">
              <div
                className={`h-1 rounded-full ${
                  s <= step ? "bg-cyan-400" : "bg-gray-400/40"
                }`}
              ></div>
              <span
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  s <= step
                    ? "bg-cyan-400 text-white"
                    : "bg-gray-400/40 text-gray-800"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 - Select Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-cyan-300 mb-2 font-semibold">
                <FaCalendarAlt className="inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                onChange={(e) => setSelectedSlot(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {selectedSlot?.date && (
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">
                  <FaClock className="inline mr-2" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(prev => ({ ...prev, time: slot }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedSlot?.time === slot
                          ? "bg-cyan-500 text-white"
                          : "bg-white/20 text-cyan-200 hover:bg-cyan-500/30"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!selectedSlot?.date || !selectedSlot?.time}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 - Patient Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-300 mb-1 font-semibold">
                  <FaUser className="inline mr-2" />
                  Patient Name
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1 font-semibold">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-300 mb-1 font-semibold">
                  <FaPhone className="inline mr-2" />
                  Contact
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1 font-semibold">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cyan-300 mb-1 font-semibold">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                required
              >
                <option value="">Select Department</option>
                {hospital.departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-cyan-300 mb-1 font-semibold">Symptoms/Reason for Visit</label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                rows="3"
                placeholder="Describe your symptoms or reason for visit..."
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-cyan-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-cyan-300 font-semibold mb-4">Consultation Fee: ₹500</h3>
              <label className="block text-cyan-300 mb-2 font-semibold">
                <FaCreditCard className="inline mr-2" />
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["Card", "UPI", "Netbanking"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`px-4 py-3 rounded-lg border transition ${
                      formData.paymentMethod === method
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "bg-white/20 text-cyan-200 border-white/30 hover:bg-cyan-500/30"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {formData.paymentMethod === "Card" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    className="px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  />
                </div>
              </div>
            )}

            {formData.paymentMethod === "UPI" && (
              <input
                type="text"
                placeholder="UPI ID"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-white/80 focus:ring-2 focus:ring-cyan-400 text-gray-800"
              />
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.paymentMethod}
                className="bg-cyan-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay & Confirm
              </button>
            </div>
          </div>
        )}

        {/* OTP Modal */}
        {showOTP && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
              <h2 className="text-xl font-bold mb-3 text-gray-800">Enter OTP</h2>
              <p className="text-gray-600 mb-2">
                Use <b>1234</b> for demo
              </p>
              <input
                type="text"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value)}
                className="px-4 py-2 rounded-lg border w-full text-center mb-3 text-gray-800"
              />
              <button
                onClick={handleConfirmOTP}
                className="bg-cyan-500 text-white py-2 px-6 rounded-lg w-full hover:bg-cyan-600"
              >
                Confirm OTP
              </button>
              <button
                onClick={() => setShowOTP(false)}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Confirmed */}
        {step === 4 && (
          <div className="text-center text-white">
            <div className="mb-6">
              <FaCheck className="text-6xl text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400">
                Appointment Confirmed!
              </h2>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4 text-cyan-300">Appointment Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Hospital:</strong> {hospital.name}</p>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                <p><strong>Date:</strong> {selectedSlot?.date}</p>
                <p><strong>Time:</strong> {selectedSlot?.time}</p>
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Payment:</strong> {formData.paymentMethod} - ₹500</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleInvoiceDownload}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                📄 Download Invoice
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                View My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHospitalAppointment;
