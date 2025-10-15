// src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { io } from "socket.io-client";
import {
  FaMicrophone,
  FaPaperPlane,
  FaMoon,
  FaSun,
  FaDownload,
  FaFileMedical,
} from "react-icons/fa";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Change this if your backend socket URL is different
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

const ChatBox = ({ roomId, username, patientName }) => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [lastDiagnosis, setLastDiagnosis] = useState("");
  const [socket, setSocket] = useState(null);
  const [theme, setTheme] = useState("light");
  const [doctorOnline, setDoctorOnline] = useState(true);

  // Emoji map
  const emojiForType = {
    advice: "💡",
    tip: "🩺",
    warning: "⚠️",
    question: "❓",
  };

  // Basic doctor canned replies (used as fallback/sim)
  const doctorReplies = [
    "Thank you for sharing. Could you tell me more about the duration of your symptoms?",
    "I see. Any other discomfort or issues you've noticed recently?",
    "It's important to monitor your condition closely. I recommend scheduling a check-up soon.",
    "Based on your description, I might suggest some medications.",
    "Please make sure to rest and stay hydrated.",
    "Can you also tell me if you have any allergies or chronic conditions?",
    "Don't worry, we'll take it step by step.",
    "Have you experienced this before?",
    "I may need a few more details to provide accurate advice.",
  ];

  const systemTips = [
    "📌 Remember to provide detailed symptoms for accurate advice.",
    "🩺 Stay calm and provide your recent medical history if asked.",
    "💊 Always consult a doctor before taking any new medication.",
    "⚠️ If symptoms worsen, seek urgent care.",
  ];

  // --- Socket.IO: connect & listeners ---
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    setSocket(s);

    s.on("connect", () => {
      // console.log("Socket connected:", s.id);
      // join room if both roomId & username available
      if (roomId && username) {
        s.emit("join-room", { roomId, username });
      }
    });

    s.on("history", (history) => {
      // server may send array with times as strings
      const parsed = history.map((m) => ({
        ...m,
        time: m.time ? new Date(m.time) : new Date(),
      }));
      setMessages(parsed);
    });

    s.on("message", (msg) => {
      const normalized = { ...msg, time: msg.time ? new Date(msg.time) : new Date() };
      setMessages((prev) => [...prev, normalized]);
    });

    s.on("system-message", (msg) => {
      const normalized = { ...msg, time: msg.time ? new Date(msg.time) : new Date() };
      setMessages((prev) => [...prev, normalized]);
    });

    // custom presence event (optional)
    s.on("presence", (data) => {
      setDoctorOnline(Boolean(data.doctorOnline));
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []); // one-time

  // Join a room whenever roomId or username change
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", { roomId, username });
    // load fallback from localStorage while waiting for server
    const saved = localStorage.getItem(`chat_${roomId}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [socket, roomId, username]);

  // Save messages locally (fallback)
  useEffect(() => {
    try {
      localStorage.setItem(`chat_${roomId}`, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages, roomId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Init SpeechRecognition (voice input)
  useEffect(() => {
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-IN"; // use India-appropriate English; change if needed

    recog.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0])
        .map((r) => r.transcript)
        .join("");
      setInput(transcript);
    };

    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);

    setRecognition(recog);
  }, []);

  // Text-to-Speech helper (TTS)
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      // choose a voice that matches locale if possible
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        // prefer an Indian English or default to first
        const pref = voices.find((v) => /en-?in/i.test(v.lang)) || voices[0];
        if (pref) u.voice = pref;
      }
      window.speechSynthesis.cancel(); // stop ongoing
      window.speechSynthesis.speak(u);
    } catch (e) {
      // ignore TTS errors
    }
  };

  // A slightly smarter (still simple) reply generator
  const getDoctorReply = (userMsg) => {
    if (!userMsg) return "Could you clarify that for me?";
    if (/fever|temperature|hot|chills/i.test(userMsg))
      return "Do you have chills or sweating along with the fever? Any recent travel?";
    if (/headache|migraine/i.test(userMsg))
      return "Is it a sharp or dull pain? Any nausea or sensitivity to light?";
    if (/cough|sputum|mucus/i.test(userMsg))
      return "Is it dry or productive? Any shortness of breath or chest pain?";
    if (/stomach|abdominal|pain|diarrhea/i.test(userMsg))
      return "When did the pain start? Any vomiting or changes in stool?";
    // otherwise return a mix of doctorReplies and system tips
    return Math.random() < 0.75
      ? doctorReplies[Math.floor(Math.random() * doctorReplies.length)]
      : systemTips[Math.floor(Math.random() * systemTips.length)];
  };

  // Send message (emit via socket + optimistic local add)
  const handleSend = (msg = input) => {
    const trimmed = (msg || "").trim();
    if (!trimmed) return;

    const outgoing = {
      sender: username,
      type: "user",
      text: trimmed,
      time: new Date(),
    };

    // optimistic add so UI is snappy (server will also broadcast)
    setMessages((prev) => [...prev, outgoing]);
    setInput("");
    setSuggestedReplies([]);
    setTyping(true);

    // emit to server
    if (socket && socket.connected) {
      socket.emit("message", { roomId, sender: username, text: trimmed, type: "user" });
    }

    // Simulate doctor response (for demo) — in production doctor client or AI would respond
    const replyDelay = Math.min(1800 + trimmed.length * 30, 4500);
    setTimeout(() => {
      const doctorMessage = getDoctorReply(trimmed);
      const serverLikeMsg = {
        sender: "Doctor",
        type: doctorMessage.includes("📌") || doctorMessage.includes("⚠️") ? "system" : "doctor",
        text: doctorMessage,
        time: new Date(),
      };

      // Emit simulated doctor message (so server stores it); if backend doesn't expect simulated messages remove emit.
      if (socket && socket.connected) {
        socket.emit("message", { roomId, sender: "Doctor", text: doctorMessage, type: serverLikeMsg.type });
      } else {
        // fallback: add locally
        setMessages((prev) => [...prev, serverLikeMsg]);
      }

      setTyping(false);
      setLastDiagnosis(doctorMessage);
      speak(doctorMessage);

      // suggested quick replies
      setSuggestedReplies(["Yes", "No", "Maybe", "I don't know"]);
    }, replyDelay);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Typing indicator component
  const TypingDots = () => (
    <div className="flex gap-1 items-center px-4 py-2 rounded-xl max-w-[60%] bg-gray-100">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
    </div>
  );

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognition) return;
    try {
      if (listening) recognition.stop();
      else recognition.start();
      setListening((l) => !l);
    } catch (e) {
      setListening(false);
    }
  };

  // Build a small health summary from chat messages (very basic)
  const buildHealthSummary = () => {
    const userMsgs = messages.filter((m) => m.sender === username).map((m) => m.text.toLowerCase()).join(" ");
    const summary = { symptoms: new Set(), possible: [] };

    if (/fever|temperature|chills|sweat/i.test(userMsgs)) summary.symptoms.add("Fever");
    if (/cough|sore throat|mucus|phlegm/i.test(userMsgs)) summary.symptoms.add("Cough");
    if (/headache|migraine/i.test(userMsgs)) summary.symptoms.add("Headache");
    if (/stomach|abdominal|diarrhea|vomit/i.test(userMsgs)) summary.symptoms.add("Stomach issues");
    if (/breath|shortness|dyspnea|wheeze/i.test(userMsgs)) summary.symptoms.add("Breathing difficulty");

    // very naive possible causes
    if (summary.symptoms.has("Fever") && summary.symptoms.has("Cough")) summary.possible.push("Viral respiratory infection");
    if (summary.symptoms.has("Headache")) summary.possible.push("Tension headache / Migraine");
    if (summary.symptoms.size === 0) summary.possible.push("No clear symptoms detected yet");

    return {
      symptoms: Array.from(summary.symptoms).slice(0, 5),
      possible: summary.possible.slice(0, 3),
    };
  };

  // Enhanced prescription generator
  const downloadPrescription = () => {
    const doc = new jsPDF({ unit: "pt" });
    const clinicName = "🏥 TeleHealth Clinic";
    doc.setFontSize(18);
    doc.text(clinicName, 40, 60);
    doc.setFontSize(11);
    doc.text(`Patient: ${patientName || username}`, 40, 90);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 40, 108);

    const userSymptoms = messages
      .filter((m) => m.sender === username)
      .map((m) => m.text)
      .join(" — ");

    doc.setFontSize(12);
    doc.text("Symptoms:", 40, 140);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(userSymptoms || "Not provided", 480), 60, 156);

    doc.setFontSize(12);
    doc.text("Diagnosis / Advice:", 40, 220);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(lastDiagnosis || "Follow up required for diagnosis", 480), 60, 236);

    doc.setFontSize(12);
    doc.text("Prescribed Medicines:", 40, 300);
    doc.setFontSize(10);
    // Make prescription a bit smarter: include paracetamol if fever/ache etc.
    const symptomsLower = userSymptoms.toLowerCase();
    const meds = [];
    if (/fever|temperature|ache|pain|headache/.test(symptomsLower)) meds.push("1. Paracetamol 500mg — Twice daily after food (3-5 days)");
    if (/cough|throat|mucus|phlegm/.test(symptomsLower)) meds.push("2. Cough syrup 10ml — Three times a day (as needed)");
    if (meds.length === 0) meds.push("1. Paracetamol 500mg — Twice daily if needed");

    meds.forEach((m, i) => {
      doc.text(m, 60, 320 + i * 18);
    });

    doc.setFontSize(10);
    doc.text("Notes: Rest, hydrate, monitor symptoms. Seek urgent care if breathing worsens.", 40, 400);
    doc.text("Doctor: Dr. Priya", 40, 430);
    doc.text("Signature: ____________________", 40, 460);

    const fileName = `Prescription_${(patientName || username).replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  // Theme toggle for dark/light
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // small helpers for motion variants
  const bubbleVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
  };

  // Render
  const healthSummary = buildHealthSummary();

  return (
    <div className="flex flex-col h-[520px] md:h-[680px] bg-white dark:bg-gray-800 border rounded-xl shadow-inner overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img src="/assets/doctor-avatar.png" alt="Doctor" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">Dr. Priya</div>
            <div className={`text-xs ${doctorOnline ? "text-green-500" : "text-gray-400"}`}>
              {doctorOnline ? "Online" : "Last seen recently"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={downloadPrescription}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            title="Download prescription"
          >
            <FaFileMedical /> <span className="hidden md:inline">Prescription</span>
          </button>
        </div>
      </div>

      {/* Body: chat + summary */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Chat column */}
        <div className="col-span-8 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isUser = msg.sender === username;
                const showDate =
                  idx === 0 ||
                  new Date(messages[idx - 1].time).toDateString() !== new Date(msg.time).toDateString();

                return (
                  <React.Fragment key={`${idx}-${msg.time?.toString() || idx}`}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-400 my-2 dark:text-gray-300">
                        {new Date(msg.time).toDateString()}
                      </div>
                    )}

                    <motion.div
                      variants={bubbleVariants}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                      className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <img
                          src="/assets/doctor-avatar.png"
                          alt="Doctor"
                          className="w-8 h-8 rounded-full mr-2 self-end"
                        />
                      )}

                      <div
                        className={`px-4 py-2 rounded-xl max-w-[78%] text-sm break-words ${
                          isUser
                            ? "bg-blue-500 text-white shadow-lg"
                            : msg.type === "system"
                            ? "bg-yellow-100 text-yellow-800 italic shadow-sm"
                            : msg.type === "info"
                            ? "bg-gray-200 text-gray-800 italic"
                            : "bg-gray-100 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                        }`}
                      >
                        <p>
                          {emojiForType[msg.type] ? `${emojiForType[msg.type]} ` : ""}
                          {msg.text}
                        </p>
                        <span className="block text-xs text-gray-400 mt-1 text-right">
                          {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mt-1">
                <img src="/assets/doctor-avatar.png" alt="Doctor" className="w-8 h-8 rounded-full mr-2 self-end" />
                <TypingDots />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {suggestedReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border-t bg-gray-50 dark:bg-gray-900 mt-2 rounded">
              {suggestedReplies.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(option)}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe symptoms or ask a question..."
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
            />

            {SpeechRecognition && (
              <button
                onClick={toggleListening}
                className={`px-3 py-2 rounded-full border ${listening ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700"}`}
                title="Voice input"
              >
                <FaMicrophone />
              </button>
            )}

            <button onClick={() => handleSend()} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>

        {/* Right column: summary / actions */}
        <div className="col-span-4 h-full">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 h-full flex flex-col justify-between shadow-sm border dark:border-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                Health Summary
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Quick auto-summary of detected symptoms & possible causes (basic).
              </p>

              <div className="mt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Detected symptoms</div>
                {healthSummary.symptoms.length ? (
                  <ul className="mt-1 space-y-1">
                    {healthSummary.symptoms.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-200">
                        • {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">No clear symptoms yet.</div>
                )}
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Possible causes</div>
                <ul className="mt-1 space-y-1">
                  {healthSummary.possible.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-200">
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">Last advice</div>
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-200 italic">
                  {lastDiagnosis || "No diagnosis/advice yet."}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={downloadPrescription} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded inline-flex items-center gap-2">
                <FaDownload /> Download Rx
              </button>
              <button
                onClick={() => {
                  // Export chat transcript as text
                  const transcript = messages.map((m) => `[${new Date(m.time).toLocaleString()}] ${m.sender}: ${m.text}`).join("\n");
                  const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Chat_${(patientName || username).replace(/\s+/g, "_")}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded"
                title="Export chat"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
