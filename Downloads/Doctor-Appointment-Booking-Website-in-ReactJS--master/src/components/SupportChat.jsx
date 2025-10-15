import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "Support",
          text: "👋 Hi! Welcome to our Doctor Appointment Booking service. How can I help you today?",
          time: new Date(),
          type: "support",
        },
      ]);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const quickOptions = [
    "Book an Appointment",
    "Find a Doctor",
    "Contact Support",
    "FAQs",
  ];

  const handleOptionClick = (option) => {
    // Add user message
    const userMsg = {
      sender: "User",
      text: option,
      time: new Date(),
      type: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate typing
    setTyping(true);
    setTimeout(() => {
      let reply = "";
      switch (option) {
        case "Book an Appointment":
          reply =
            "Great! You can book an appointment by selecting a doctor from our list. Would you like me to guide you?";
          break;
        case "Find a Doctor":
          reply =
            "Sure! Browse our specialties or search for doctors by name. Let me know your needs!";
          break;
        case "Contact Support":
          reply =
            "You can reach us at support@doctorbooking.com or call +1-800-123-4567. How else can I assist?";
          break;
        case "FAQs":
          reply =
            "Check out our FAQ section for common questions. If you have a specific query, feel free to ask!";
          break;
        default:
          reply =
            "Thank you for your message. Our team will get back to you soon!";
      }
      const supportMsg = {
        sender: "Support",
        text: reply,
        time: new Date(),
        type: "support",
      };
      setMessages((prev) => [...prev, supportMsg]);
      setTyping(false);
    }, 1500);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold">Support Chat</h3>
                  <p className="text-sm opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "support" && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 self-end">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                    <div className="text-xs opacity-70 mt-1">
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 self-end">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options */}
            {messages.length > 0 && !typing && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Quick options:</p>
                <div className="flex flex-wrap gap-2">
                  {quickOptions.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionClick(option)}
                      className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChat;
