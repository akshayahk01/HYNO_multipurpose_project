// src/pages/PaymentPage2.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PaymentPage2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan || "Custom Plan";

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [success, setSuccess] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI fields
  const [upiId, setUpiId] = useState("");
  const [upiOTP, setUpiOTP] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);

  // NetBanking fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleConfirm = () => {
    // Validate fields
    if (
      (paymentMethod === "Card" &&
        (!cardNumber || !cardName || !expiry || !cvv)) ||
      (paymentMethod === "UPI" && !upiVerified) ||
      (paymentMethod === "NetBanking" && (!bankName || !accountNumber || !ifsc))
    ) {
      alert("Please fill all required fields or complete verification!");
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate("/"), 4000);
  };

  const handleUpiVerify = () => {
    if (upiOTP === "1234") {
      setUpiVerified(true);
      alert("UPI Verified successfully!");
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  const downloadInvoice = () => {
    const invoiceText = `
      Hyno Health Services
      -------------------------
      Invoice
      Plan: ${plan}
      Payment Method: ${paymentMethod}
      ${
        paymentMethod === "Card"
          ? `Card: **** **** **** ${cardNumber.slice(-4)}\nName: ${cardName}`
          : paymentMethod === "UPI"
            ? `UPI ID: ${upiId}`
            : `Bank: ${bankName}\nAccount: ${accountNumber}\nIFSC: ${ifsc}`
      }
      Date: ${new Date().toLocaleString()}
      -------------------------
      Thank you for your payment!
    `;
    const blob = new Blob([invoiceText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Invoice.txt";
    link.click();
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.h1
          className="text-3xl font-bold text-purple-700 mb-6 text-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Payment for {plan}
        </motion.h1>

        {/* Payment Method Dropdown */}
        <motion.div className="mb-6 relative">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              // reset UPI verification when switching
              setUpiVerified(false);
              setUpiOTP("");
            }}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-sm"
          >
            <option>Card</option>
            <option>UPI</option>
            <option>NetBanking</option>
          </select>
        </motion.div>

        {/* Card Section */}
        <AnimatePresence mode="wait">
          {paymentMethod === "Card" && (
            <motion.div
              key="card"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg mb-4 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold">
                    {cardName || "Cardholder Name"}
                  </div>
                  <div className="text-sm">{expiry || "MM/YY"}</div>
                </div>
                <div className="text-2xl tracking-widest font-mono">
                  {cardNumber
                    ? cardNumber.replace(/\d{4}(?=.)/g, "**** ")
                    : "**** **** **** ****"}
                </div>
                <div className="absolute bottom-2 right-4 text-sm">
                  Hyno Bank
                </div>
              </motion.div>

              <input
                type="text"
                placeholder="Card Number"
                maxLength={16}
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  className="w-20 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPI Section */}
        <AnimatePresence mode="wait">
          {paymentMethod === "UPI" && (
            <motion.div
              key="upi"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {!upiVerified && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP (e.g., 1234)"
                    value={upiOTP}
                    onChange={(e) =>
                      setUpiOTP(e.target.value.replace(/\D/g, ""))
                    }
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleUpiVerify}
                    className="bg-indigo-600 text-white py-2 rounded-lg shadow-md font-semibold"
                  >
                    Verify UPI
                  </button>
                </>
              )}
              {upiVerified && (
                <motion.div
                  className="text-green-600 font-semibold text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✅ UPI Verified
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NetBanking Section */}
        <AnimatePresence mode="wait">
          {paymentMethod === "NetBanking" && (
            <motion.div
              key="netbanking"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          className="bg-purple-600 text-white py-3 rounded-lg shadow-md font-semibold mt-6 w-full relative overflow-hidden"
        >
          Confirm Payment
        </motion.button>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl text-center space-y-4 relative overflow-hidden"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {Array.from({ length: 50 }).map((_, idx) => (
                <motion.span
                  key={idx}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}vh`,
                  }}
                  animate={{ y: "120vh", rotate: 360 }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: 0,
                    ease: "linear",
                  }}
                >
                  🎉
                </motion.span>
              ))}
              <div className="text-5xl text-green-600 animate-bounce">✅</div>
              <p className="text-lg font-semibold">Payment Successful!</p>
              <p className="text-gray-600 text-sm">
                Thank you for choosing Hyno Health Services.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={downloadInvoice}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md mt-2"
              >
                Download Invoice
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentPage2;
