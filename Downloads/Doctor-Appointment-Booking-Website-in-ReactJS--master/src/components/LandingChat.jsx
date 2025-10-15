// src/components/LandingChat.jsx import { useState, useEffect, useRef } from "react"; import { motion, AnimatePresence } from "framer-motion"; import { FaPaperPlane, FaSmile, FaHeadset, FaMicrophone, FaMicrophoneSlash, FaExpand, FaCompress, } from "react-icons/fa"; const LandingChat = () => { const [isOpen, setIsOpen] = useState(false); const [messages, setMessages] = useState([]); const [typing, setTyping] = useState(false); const [input, setInput] = useState(""); const [listening, setListening] = useState(false); const [isExpanded, setIsExpanded] = useState(false); const [isMinimized, setIsMinimized] = useState(false); const [adIndex, setAdIndex] = useState(0); const [quickReplies, setQuickReplies] = useState([ "Book Appointment", "Emergency Help", "Pharmacy", "Health Tips", ]); const [uploadedFile, setUploadedFile] = useState(null); const messagesEndRef = useRef(null); const recognitionRef = useRef(null); const fileInputRef = useRef(null); const services = [ { name: "Health Appointment", description: "Book appointments with top doctors", icon: "🏥" }, { name: "Online Pharmacy", description: "Order medicines & health products", icon: "💊" }, { name: "Yoga & Fitness", description: "Guided yoga sessions and fitness plans", icon: "🧘‍♀️" }, { name: "Nutrition & Diet", description: "Personalized diet plans and tips", icon: "🥗" }, ]; const advertisements = [ "🏥 Free health checkup for seniors 60+!", "💊 COVID-19 vaccination available now!", "🧘‍♀️ Wellness package discounts this month!", "🍎 Nutrition consultation by experts!", ]; const faqs = [ { question: "How do I book an appointment?", answer: "Click on 'Book Appointment' or visit our Doctors page to select a specialist." }, { question: "What are your consultation fees?", answer: "Consultation starts from ₹500. Specialized treatments may vary." }, { question: "Do you accept insurance?", answer: "Yes, we accept major health insurance plans. Bring your card to the clinic." }, { question: "How can I order medicines?", answer: "Use our online pharmacy or visit any of our clinics." }, ]; const quickResponses = { hello: "Hello! Welcome to HYNO Healthcare. How can I help you today?", hi: "Hi there! I'm here to assist you with your healthcare needs.", appointment: "I'd be happy to help you book an appointment! Which doctor do you prefer?", doctor: "We have specialists in multiple fields. Want to see available doctors?", emergency: "🚨 For emergencies, call 108 immediately or visit the nearest hospital.", pharmacy: "You can order medicines via our online pharmacy. What do you need?", cost: "Consultation fees start at ₹500. Specialized treatments may vary.", insurance: "We accept multiple health insurance plans. Bring your card.", location: "We have multiple clinics across the city. Which location is convenient?", timing: "Open 9 AM - 9 PM on weekdays, 10 AM - 6 PM on weekends.", thanks: "You're welcome! Anything else I can assist with?", bye: "Thank you for choosing HYNO Healthcare. Stay healthy! 👋", }; // Auto scroll to bottom useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]); // Scrolling advertisements useEffect(() => { const interval = setInterval(() => setAdIndex((prev) => (prev + 1) % advertisements.length), 5000); return () => clearInterval(interval); }, []); // Initialize speech recognition useEffect(() => { if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) { const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; const recognition = new SpeechRecognition(); recognition.continuous = false; recognition.interimResults = true; recognition.lang = "en-US"; recognition.onresult = (event) => { const transcript = Array.from(event.results) .map((r) => r[0]) .map((r) => r.transcript) .join(""); setInput(transcript); }; recognition.onend = () => setListening(false); recognitionRef.current = recognition; } }, []); const getSmartResponse = (userInput) => { const inputLower = userInput.toLowerCase().trim(); for (const [key, resp] of Object.entries(quickResponses)) { if (inputLower.includes(key)) return resp; } return "Could you please provide more details?"; }; const handleServiceClick = (service) => { setMessages((prev) => [...prev, { sender: "User", text: I'm interested in ${service.name}, type: "user", time: new Date() }]); setTyping(true); setTimeout(() => { setMessages((prev) => [ ...prev, { sender: "Support", text: Great! ${service.icon} ${service.description}. Shall we start with ${service.name}?, type: "support", avatar: "🤖", time: new Date() }, ]); setTyping(false); }, 1500); }; const handleQuickReply = (reply) => { setMessages((prev) => [...prev, { sender: "User", text: reply, type: "user", time: new Date() }]); setTyping(true); setTimeout(() => { const response = getSmartResponse(reply); setMessages((prev) => [...prev, { sender: "Support", text: response, type: "support", avatar: "🤖", time: new Date() }]); setTyping(false); }, 1000 + Math.random() * 2000); }; const handleFileUpload = (event) => { const file = event.target.files[0]; if (file) { setUploadedFile(file); setMessages((prev) => [...prev, { sender: "User", text: Uploaded: ${file.name}, type: "user", file: file, time: new Date() }]); setTyping(true); setTimeout(() => { setMessages((prev) => [...prev, { sender: "Support", text: "Thank you for uploading! Our team will review your file and get back to you soon.", type: "support", avatar: "🤖", time: new Date() }]); setTyping(false); }, 1500); } }; const handleSend = () => { if (!input.trim()) return; const currentInput = input.trim(); setMessages((prev) => [...prev, { sender: "User", text: currentInput, type: "user", time: new Date() }]); setInput(""); setTyping(true); setTimeout(() => { const response = getSmartResponse(currentInput); setMessages((prev) => [...prev, { sender: "Support", text: response, type: "support", avatar: "🤖", time: new Date() }]); setTyping(false); }, 1000 + Math.random() * 2000); }; const toggleChat = () => setIsOpen(!isOpen); const toggleVoice = () => { if (!recognitionRef.current) return; if (listening) recognitionRef.current.stop(); else recognitionRef.current.start(); setListening(!listening); }; const toggleExpand = () => setIsExpanded(!isExpanded); const toggleMinimize = () => setIsMinimized(!isMinimized); // Particle background for chat window const particles = Array.from({ length: 20 }); return ( <> {/* Floating Neon Chat Button */} <motion.div className="fixed bottom-6 right-6 z-50" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} > <button onClick={toggleChat} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full p-5 shadow-xl drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]" > <FaHeadset className="w-6 h-6 animate-bounce" /> </button> </motion.div> <AnimatePresence> {isOpen && ( <motion.div initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className={fixed bottom-20 right-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-40 ${ isExpanded ? "w-[500px] h-[700px]" : isMinimized ? "w-96 h-16" : "w-96 h-[550px]" }} > {/* Header */} <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-3xl relative z-20"> <div className="flex items-center gap-2"> <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div> <span className="text-cyan-300 text-sm font-semibold">HYNO Support</span> </div> <div className="flex gap-1"> <button onClick={toggleMinimize} className="text-gray-400 hover:text-cyan-400 text-sm"> {isMinimized ? "⬆" : "⬇"} </button> <button onClick={toggleExpand} className="text-gray-400 hover:text-cyan-400 text-sm"> {isExpanded ? <FaCompress /> : <FaExpand />} </button> <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-400 text-sm"> ✕ </button> </div> </div> {!isMinimized && ( <> {/* Particle Background */} <div className="absolute inset-0 overflow-hidden pointer-events-none"> {particles.map((_, i) => ( <motion.div key={i} className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-xl opacity-50" initial={{ x: Math.random() * 500, y: Math.random() * 700 }} animate={{ x: [0, 500, 0], y: [0, 700, 0] }} transition={{ repeat: Infinity, duration: 15 + i * 2, ease: "linear" }} /> ))} </div> {/* Chat Body */} <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10"> {messages.map((msg, idx) => ( <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={flex ${msg.type === "user" ? "justify-end" : "justify-start"}} > {msg.type === "support" && ( <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2 self-end text-white font-bold animate-pulse"> 🤖 </div> )} <div className={max-w-[70%] p-3 rounded-xl text-sm shadow-lg ${ msg.type === "user" ? "bg-blue-600 text-white shadow-blue-500/50" : "bg-gray-800 text-gray-100 shadow-cyan-500/30" }} > {msg.text} <div className="text-[10px] opacity-70 mt-1 text-gray-300"> {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </div> </div> </motion.div> ))} {typing && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start"> <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2 self-end text-white font-bold animate-pulse"> 🤖 </div> <div className="bg-gray-800 p-3 rounded-xl text-sm text-gray-100 animate-pulse shadow-cyan-500/50"> Typing... </div> </motion.div> )} {/* Services */} <div className="mt-4"> <p className="text-sm font-semibold mb-2 text-gray-300">Our Services:</p> <div className="grid grid-cols-2 gap-2"> {services.map((service, idx) =// src/components/LandingChat.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaSmile,
  FaHeadset,
  FaMicrophone,
  FaMicrophoneSlash,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

const LandingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [quickReplies] = useState([
    "Book Appointment",
    "Emergency Help",
    "Pharmacy",
    "Health Tips",
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const services = [
    {
      name: "Health Appointment",
      description: "Book appointments with top doctors",
      icon: "🏥",
    },
    {
      name: "Online Pharmacy",
      description: "Order medicines & health products",
      icon: "💊",
    },
    {
      name: "Yoga & Fitness",
      description: "Guided yoga sessions and fitness plans",
      icon: "🧘‍♀️",
    },
    {
      name: "Nutrition & Diet",
      description: "Personalized diet plans and tips",
      icon: "🥗",
    },
  ];

  const advertisements = [
    "🏥 Free health checkup for seniors 60+!",
    "💊 COVID-19 vaccination available now!",
    "🧘‍♀️ Wellness package discounts this month!",
    "🍎 Nutrition consultation by experts!",
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Click on 'Book Appointment' or visit our Doctors page to select a specialist.",
    },
    {
      question: "What are your consultation fees?",
      answer:
        "Consultation starts from ₹500. Specialized treatments may vary.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "Yes, we accept major health insurance plans. Bring your card to the clinic.",
    },
    {
      question: "How can I order medicines?",
      answer: "Use our online pharmacy or visit any of our clinics.",
    },
  ];

  const quickResponses = {
    hello: "Hello! Welcome to HYNO Healthcare. How can I help you today?",
    hi: "Hi there! I'm here to assist you with your healthcare needs.",
    appointment:
      "I'd be happy to help you book an appointment! Which doctor do you prefer?",
    doctor:
      "We have specialists in multiple fields. Want to see available doctors?",
    emergency:
      "🚨 For emergencies, call 108 immediately or visit the nearest hospital.",
    pharmacy:
      "You can order medicines via our online pharmacy. What do you need?",
    cost: "Consultation fees start at ₹500. Specialized treatments may vary.",
    insurance: "We accept multiple health insurance plans. Bring your card.",
    location:
      "We have multiple clinics across the city. Which location is convenient?",
    timing: "Open 9 AM - 9 PM on weekdays, 10 AM - 6 PM on weekends.",
    thanks: "You're welcome! Anything else I can assist with?",
    bye: "Thank you for choosing HYNO Healthcare. Stay healthy! 👋",
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Scrolling advertisements
  useEffect(() => {
    const interval = setInterval(
      () => setAdIndex((prev) => (prev + 1) % advertisements.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0])
          .map((r) => r.transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const getSmartResponse = (userInput) => {
    const inputLower = userInput.toLowerCase().trim();
    for (const [key, resp] of Object.entries(quickResponses)) {
      if (inputLower.includes(key)) return resp;
    }
    return "Could you please provide more details?";
  };

  const handleServiceClick = (service) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "User",
        text: `I'm interested in ${service.name}`,
        type: "user",
        time: new Date(),
      },
    ]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "Support",
          text: `Great! ${service.icon} ${service.description}. Shall we start with ${service.name}?`,
          type: "support",
          avatar: "🤖",
          time: new Date(),
        },
      ]);
      setTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply) => {
    setMessages((prev) => [
      ...prev,
      { sender: "User", text: reply, type: "user", time: new Date() },
    ]);
    setTyping(true);
    setTimeout(() => {
      const response = getSmartResponse(reply);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Support",
          text: response,
          type: "support",
          avatar: "🤖",
          time: new Date(),
        },
      ]);
      setTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setMessages((prev) => [
        ...prev,
        {
          sender: "User",
          text: `Uploaded: ${file.name}`,
          type: "user",
          file: file,
          time: new Date(),
        },
      ]);
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Support",
            text: "Thank you for uploading! Our team will review your file soon.",
            type: "support",
            avatar: "🤖",
            time: new Date(),
          },
        ]);
        setTyping(false);
      }, 1500);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    setMessages((prev) => [
      ...prev,
      { sender: "User", text: currentInput, type: "user", time: new Date() },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = getSmartResponse(currentInput);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Support",
          text: response,
          type: "support",
          avatar: "🤖",
          time: new Date(),
        },
      ]);
      setTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setListening(!listening);
  };
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const particles = Array.from({ length: 20 });

  return (
    <>
      {/* Floating Neon Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full p-5 shadow-xl drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]"
        >
          <FaHeadset className="w-6 h-6 animate-bounce" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-20 right-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-40 ${
              isExpanded
                ? "w-[500px] h-[700px]"
                : isMinimized
                ? "w-96 h-16"
                : "w-96 h-[550px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-3xl relative z-20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 text-sm font-semibold">
                  HYNO Support
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={toggleMinimize}
                  className="text-gray-400 hover:text-cyan-400 text-sm"
                >
                  {isMinimized ? "⬆" : "⬇"}
                </button>
                <button
                  onClick={toggleExpand}
                  className="text-gray-400 hover:text-cyan-400 text-sm"
                >
                  {isExpanded ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-red-400 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Particle Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {particles.map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-xl opacity-50"
                      initial={{
                        x: Math.random() * 500,
                        y: Math.random() * 700,
                      }}
                      animate={{
                        x: [0, 500, 0],
                        y: [0, 700, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 15 + i * 2,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                {/* Chat Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.type === "support" && (
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2 self-end text-white font-bold animate-pulse">
                          🤖
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-xl text-sm shadow-lg ${
                          msg.type === "user"
                            ? "bg-blue-600 text-white shadow-blue-500/50"
                            : "bg-gray-800 text-gray-100 shadow-cyan-500/30"
                        }`}
                      >
                        {msg.text}
                        <div className="text-[10px] opacity-70 mt-1 text-gray-300">
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
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2 self-end text-white font-bold animate-pulse">
                        🤖
                      </div>
                      <div className="bg-gray-800 p-3 rounded-xl text-sm text-gray-100 animate-pulse shadow-cyan-500/50">
                        Typing...
                      </div>
                    </motion.div>
                  )}

                  {/* Services */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2 text-gray-300">
                      Our Services:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleServiceClick(service)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-800 text-cyan-400 px-2 py-1 rounded-lg text-xs font-semibold shadow hover:bg-cyan-500 hover:text-gray-900 transition-all"
                        >
                          {service.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Replies */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2 text-gray-300">
                      Quick Replies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-indigo-700 text-indigo-200 px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Advertisements */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2 text-gray-300">
                      Advertisements:
                    </p>
                    <motion.div
                      key={adIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-cyan-700 via-indigo-700 to-purple-700 text-gray-100 px-3 py-2 rounded-lg text-xs shadow-lg"
                    >
                      {advertisements[adIndex]}
                    </motion.div>
                  </div>

                  {/* FAQ */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2 text-gray-300">
                      Frequently Asked Questions:
                    </p>
                    <div className="space-y-2">
                      {faqs.map((faq, idx) => (
                        <details
                          key={idx}
                          className="bg-gray-800 rounded-lg p-2 text-xs"
                        >
                          <summary className="cursor-pointer text-cyan-300 font-medium">
                            {faq.question}
                          </summary>
                          <p className="text-gray-300 mt-1">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Box */}
                <div className="flex items-center p-3 border-t border-gray-700 bg-gray-900 rounded-b-3xl relative z-10">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-cyan-400 mr-2"
                    title="Upload file"
                  >
                    📎
                  </button>
                  <button className="text-gray-400 hover:text-cyan-400 mr-2">
                    <FaSmile />
                  </button>
                  <button
                    onClick={toggleVoice}
                    className={`mr-2 p-2 rounded-full transition-colors ${
                      listening
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      listening ? "Listening..." : "Type your message..."
                    }
                    className="flex-1 border border-gray-700 rounded-full px-3 py-1 text-sm outline-none bg-gray-800 text-gray-100 focus:ring-2 focus:ring-cyan-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={toggleExpand}
                    className="ml-2 text-gray-400 hover:text-cyan-400"
                  >
                    {isExpanded ? <FaCompress /> : <FaExpand />}
                  </button>
                  <button
                    onClick={handleSend}
                    className="ml-2 bg-cyan-500 text-gray-900 p-2 rounded-full hover:bg-cyan-600 hover:text-white shadow-md"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingChat;
