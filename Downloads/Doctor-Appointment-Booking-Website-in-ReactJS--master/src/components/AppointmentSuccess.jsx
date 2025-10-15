import React, { useEffect, useRef } from "react";

const AppointmentSuccess = ({ onClose }) => {
  const confettiRef = useRef(null);

  useEffect(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const confetti = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 4 + Math.random() * 6,
      d: 2 + Math.random() * 2,
      tilt: Math.random() * 10,
      tiltAngle: Math.random() * Math.PI,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    let anim;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => {
        c.y += c.d;
        c.tiltAngle += 0.05;
        c.tilt = Math.sin(c.tiltAngle) * 10;

        ctx.beginPath();
        ctx.ellipse(
          c.x + c.tilt,
          c.y,
          c.r,
          c.r * 0.6,
          Math.random() * Math.PI,
          0,
          2 * Math.PI,
        );
        ctx.fillStyle = c.color;
        ctx.fill();

        if (c.y > canvas.height) {
          c.y = -20;
          c.x = Math.random() * canvas.width;
        }
      });
      anim = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* All Animations in One Place */}
      <style>{`
        @keyframes scale-fade {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-fade { animation: scale-fade 0.6s ease forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.8s ease forwards; }

        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw-circle {
          stroke-dasharray: 240;
          stroke-dashoffset: 240;
          animation: draw-circle 1s ease forwards;
        }

        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw-check {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: draw-check 0.8s ease 0.5s forwards;
        }

        @keyframes ripple {
          from { transform: scale(0); opacity: 0.6; }
          to { transform: scale(2); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out infinite;
        }
      `}</style>

      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center animate-scale-fade overflow-hidden border border-gray-200">
        {/* Confetti Canvas */}
        <canvas
          ref={confettiRef}
          width={400}
          height={200}
          className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Animated Checkmark */}
        <svg
          className="mx-auto mb-6"
          width="80"
          height="80"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#22c55e"
            strokeWidth="4"
            fill="none"
            className="animate-draw-circle"
          />
          <polyline
            points="26,42 36,52 56,30"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-check"
          />
        </svg>

        {/* Success Message */}
        <h2 className="text-2xl font-bold mb-2 text-green-600 animate-slide-up">
          Appointment Confirmed!
        </h2>
        <p className="mb-6 text-gray-700 animate-slide-up delay-200">
          Your appointment has been booked successfully. We look forward to
          seeing you!
        </p>

        {/* Button */}
        <button
          className="relative overflow-hidden bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-green-400"
          onClick={onClose}
        >
          <span className="relative z-10">Close</span>
          <span className="absolute inset-0 bg-white/30 scale-0 rounded-full animate-ripple"></span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccess;
