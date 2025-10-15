// src/components/CallRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DEFAULT_DOCTOR_VIDEO = "/assets/doctor.mp4";
const DEFAULT_DOCTOR_PHOTO = "/assets/doctor-photo.jpg";

const reactionsList = ["👍", "❤️", "😂", "👏", "🎉", "🎶"];

const CallRoom = ({
  roomId = "room1",
  localName = "Patient",
  remoteName = "Doctor",
  type = "video",
  onEnd,
}) => {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const autoEndRef = useRef(null);
  const navigate = useNavigate();

  const TRIAL_SECONDS = 60;

  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showReactionDropdown, setShowReactionDropdown] = useState(false);

  const [reactions, setReactions] = useState([]);
  const [rating, setRating] = useState({ video: 0, audio: 0, connection: 0 });
  const [review, setReview] = useState("");

  useEffect(() => {
    if (inCall) {
      timerRef.current = setInterval(
        () => setCallTime((prev) => prev + 1),
        1000,
      );

      autoEndRef.current = setTimeout(() => {
        handleEndCall();
        setShowSubscribe(true);
      }, TRIAL_SECONDS * 1000);

      if (remoteRef.current && type === "video") {
        try {
          remoteRef.current.src = DEFAULT_DOCTOR_VIDEO;
          remoteRef.current.play().catch(() => {});
        } catch {}
      }
    } else {
      clearInterval(timerRef.current);
      clearTimeout(autoEndRef.current);
      setCallTime(0);
      if (remoteRef.current) {
        remoteRef.current.pause();
        remoteRef.current.src = "";
      }
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(autoEndRef.current);
    };
  }, [inCall, type]);

  const startCall = async () => {
    try {
      const constraints = { video: type === "video", audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;

      toggleAudioTracks(!muted);
      toggleVideoTracks(!cameraOff);

      setShowConfirm(false);
      setInCall(true);
    } catch {
      alert("Cannot access camera/microphone.");
    }
  };

  const toggleAudioTracks = (enabled) => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !!enabled));
  };
  const toggleVideoTracks = (enabled) => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !!enabled));
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    toggleAudioTracks(!next);
  };
  const handleToggleCamera = () => {
    const next = !cameraOff;
    setCameraOff(next);
    toggleVideoTracks(!next);
  };
  const handleToggleMirror = () => setMirror((p) => !p);

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (localRef.current) localRef.current.srcObject = null;
    setInCall(false);

    setTimeout(() => setShowRating(true), 120);
    onEnd?.();
  };

  const handleReactionSelect = (emoji) => {
    const id = Date.now() + Math.random();
    const leftOffset = Math.random() * 60 - 30;
    const duration = 1.8 + Math.random() * 0.8;
    const r = { id, emoji, leftOffset, duration };
    setReactions((prev) => [...prev, r]);
    setTimeout(
      () => setReactions((prev) => prev.filter((x) => x.id !== id)),
      (duration + 0.3) * 1000,
    );
    setShowReactionDropdown(false);
  };

  const submitRating = () => {
    alert("Thanks for your feedback!");
    setShowRating(false);
    setRating({ video: 0, audio: 0, connection: 0 });
    setReview("");
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0",
    )}`;

  const progressPercent = Math.min(
    100,
    Math.round((callTime / TRIAL_SECONDS) * 100),
  );

  return (
    <div className="mt-4 space-y-4 relative max-w-5xl mx-auto p-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local */}
        <div className="relative bg-black rounded-lg h-64 flex items-center justify-center overflow-hidden">
          {type === "video" ? (
            <>
              <video
                ref={localRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${
                  mirror ? "scale-x-[-1]" : ""
                } ${cameraOff ? "hidden" : ""}`}
              />
              {cameraOff && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg">
                  Camera Off
                </div>
              )}
            </>
          ) : (
            <div className="text-white text-2xl">🎧 Audio Only</div>
          )}

          {!inCall && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirm(true)}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                {type === "video" ? "Start Video Call" : "Start Voice Call"}
              </motion.button>
            </div>
          )}
        </div>

        {/* Remote */}
        <div className="relative bg-gray-900 rounded-lg h-64 flex items-center justify-center text-white overflow-hidden">
          {type === "video" ? (
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              loop
              muted
              className="w-full h-full object-cover"
              onError={() => (remoteRef.current.src = DEFAULT_DOCTOR_PHOTO)}
            />
          ) : (
            <img
              src={DEFAULT_DOCTOR_PHOTO}
              alt={remoteName}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 left-2 bg-black/40 px-2 py-1 rounded-md flex items-center gap-2">
            <img
              src={DEFAULT_DOCTOR_PHOTO}
              alt={remoteName}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">{remoteName}</span>
          </div>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              className="absolute text-4xl"
              style={{ left: `calc(50% + ${r.leftOffset}%)` }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -160, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: r.duration }}
            >
              {r.emoji}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Timer */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <span className="font-semibold">
            ⏱ {formatTime(callTime)}
            <span className="ml-2 text-sm text-red-500">
              | Free trial ends in 1 min
            </span>
          </span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Buttons */}
        <motion.div
          layout
          className="flex flex-wrap items-center justify-center gap-3 bg-white/90 px-6 py-3 rounded-full shadow-lg"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleToggleMute}
            className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {muted ? "Unmute" : "Mute"}
          </motion.button>

          {type === "video" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleToggleCamera}
              className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              {cameraOff ? "Cam On" : "Cam Off"}
            </motion.button>
          )}

          {type === "video" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleToggleMirror}
              className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              {mirror ? "Mirror Off" : "Mirror On"}
            </motion.button>
          )}

          {/* Reactions */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowReactionDropdown((p) => !p)}
              className="px-3 py-2 rounded-full bg-yellow-200"
            >
              React
            </motion.button>
            <AnimatePresence>
              {showReactionDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-12 left-0 bg-white border rounded-md p-2 flex gap-2 shadow-lg"
                >
                  {reactionsList.map((e, i) => (
                    <button
                      key={i}
                      onClick={() => handleReactionSelect(e)}
                      className="text-2xl"
                    >
                      {e}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowChat((p) => !p)}
            className="px-3 py-2 rounded-full bg-blue-200 hover:bg-blue-300"
          >
            Chat
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/subscribe")}
            className="px-3 py-2 rounded-full bg-purple-500 text-white"
          >
            Subscribe
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleEndCall}
            className="px-3 py-2 rounded-full bg-red-500 text-white"
          >
            End
          </motion.button>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-sm text-center space-y-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-bold">Start Call</h2>
              <p>
                Do you want to start the {type === "video" ? "video" : "voice"}{" "}
                call?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={startCall}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscribe Modal after trial */}
      <AnimatePresence>
        {showSubscribe && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md text-center space-y-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold">Free Trial Ended</h2>
              <p className="text-gray-600">
                Subscribe or pay to continue consultations.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/subscribe")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Subscribe Now
                </button>
                <button
                  onClick={() =>
                    navigate("/payment", { state: { plan: "Single Call" } })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Pay for Single Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CallRoom;
