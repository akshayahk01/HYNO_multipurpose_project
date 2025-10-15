import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const teamMembers = [
  {
    name: "Dr. Alice Morgan",
    role: "Chief Medical Officer",
    photo: assets.team1,
    bio: "Over 20 years of experience in healthcare leadership.",
  },
  {
    name: "Dr. John Doe",
    role: "Senior Physician",
    photo: assets.team2,
    bio: "Specialist in internal medicine with 15 years of practice.",
  },
  {
    name: "Dr. Emma Smith",
    role: "UX Designer",
    photo: assets.team3,
    bio: "Designing intuitive experiences for better patient care.",
  },
];

const testimonials = [
  {
    name: "Sarah Lee",
    feedback:
      "HYNO has transformed how I manage my appointments. So convenient and efficient!",
  },
  {
    name: "Mark Johnson",
    feedback:
      "The personalized health reminders keep me on track. Highly recommended!",
  },
  {
    name: "Emily Clark",
    feedback:
      "The doctors are professional and the interface is seamless. I love using HYNO!",
  },
];

const About = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calcParallax = (depth) => ({
    transform: `translateX(${(mousePos.x - window.innerWidth / 2) * depth}px) translateY(${(mousePos.y - window.innerHeight / 2) * depth}px)`,
  });

  const calcTilt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 15;
    const tiltY = -(x / rect.width) * 15;
    return {
      transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`,
      transition: "transform 0.2s ease",
      boxShadow: `${-tiltY * 5}px ${tiltX * 5}px 30px rgba(0,255,255,0.2), ${tiltY * 5}px ${-tiltX * 5}px 30px rgba(255,0,255,0.2)`,
    };
  };

  const cards = [
    {
      title: "⚡ Efficiency",
      text: "Streamlined appointment scheduling.",
      color: "cyan",
    },
    {
      title: "🩺 Convenience",
      text: "Trusted healthcare network.",
      color: "emerald",
    },
    {
      title: "🎯 Personalization",
      text: "Tailored reminders for your health.",
      color: "purple",
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white font-sans">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-25 z-[-3]"
        autoPlay
        loop
        muted
        playsInline
        style={{ filter: "brightness(0.35) contrast(1.2)" }}
      >
        <source
          src="https://videos.pexels.com/video-files/7579821/7579821-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-black/70 mix-blend-overlay z-[-2] animate-gradient-move"
        style={calcParallax(0.01)}
      ></div>

      {/* Floating Orbs */}
      <div
        className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/25 blur-[120px] rounded-full animate-pulse z-[-1]"
        style={calcParallax(0.03)}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/25 blur-[150px] rounded-full animate-ping z-[-1]"
        style={calcParallax(0.05)}
      ></div>
      <div
        className="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-400/15 blur-[100px] rounded-full animate-bounce z-[-1]"
        style={calcParallax(0.04)}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const size = 3 + Math.random() * 3;
          return (
            <span
              key={i}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: size,
                height: size,
                backgroundColor: `rgba(56, 189, 248, ${0.2 + Math.random() * 0.4})`,
                borderRadius: "50%",
                position: "absolute",
                filter: "drop-shadow(0 0 2px cyan)",
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `translateX(${(mousePos.x - window.innerWidth / 2) * 0.002}px) translateY(${
                  (mousePos.y - window.innerHeight / 2) * 0.002
                }px)`,
              }}
            />
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 py-12 max-w-7xl">
        {/* Title */}
        <div className="text-center text-5xl font-extrabold drop-shadow-xl mb-12 animate-fade-in-up">
          <p>
            <span className="text-cyan-400">ABOUT</span>{" "}
            <span className="text-purple-400">US</span>
          </p>
        </div>
        {/* About Section */}
        <div className="my-16 flex flex-col md:flex-row gap-12 items-center">
          <img
            className="w-full md:max-w-[400px] rounded-3xl shadow-lg hover:scale-110 transition-transform duration-700 cursor-pointer"
            src={assets.about_image}
            alt="About Us"
            onMouseMove={(e) =>
              (e.currentTarget.style.transform = calcTilt(e).transform)
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-lg bg-white/15 backdrop-blur-xl rounded-3xl p-12 shadow-lg border border-cyan-400/40 max-w-xl">
            <p className="leading-relaxed text-gray-200 font-semibold tracking-wide">
              Welcome to <span className="font-bold text-cyan-400">HYNO</span>,
              your trusted partner in healthcare. Our mission is to provide
              seamless, patient-centered medical services using technology to
              simplify access to healthcare for everyone.
            </p>
            <p className="leading-relaxed text-gray-200 font-semibold tracking-wide mt-4">
              At HYNO, we believe that health management should be simple,
              personalized, and proactive. From scheduling appointments with
              trusted doctors to receiving timely health reminders, we ensure
              that you stay on top of your health without any stress.
            </p>
            <p className="leading-relaxed text-gray-200 font-semibold tracking-wide mt-4">
              Our platform connects you with certified specialists across
              multiple domains including general medicine, dermatology,
              pediatrics, gynecology, neurology, and gastroenterology. We
              carefully select each healthcare professional to ensure quality
              care and trust.
            </p>
            <p className="leading-relaxed text-gray-200 font-semibold tracking-wide mt-4">
              HYNO is designed with your convenience in mind. With a
              user-friendly interface, real-time appointment booking, secure
              digital records, and personalized notifications, managing your
              health has never been easier. We are committed to making
              healthcare accessible, reliable, and personalized for every
              individual.
            </p>
            <b className="text-3xl text-emerald-400 mt-6 drop-shadow-md">
              🌟 Our Vision
            </b>
            <p className="text-gray-300 font-medium tracking-wide leading-relaxed">
              Revolutionizing healthcare through innovative, user-friendly
              solutions, ensuring every patient receives timely and efficient
              medical care.
            </p>
          </div>
        </div>{" "}
        {/* <-- Fixed missing closing div */}
        {/* Why Choose Us */}
        <div className="text-center text-4xl font-semibold mb-10 tracking-wide animate-fade-in-up">
          <p>
            WHY <span className="text-cyan-400">CHOOSE US</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 mb-20 justify-center">
          {cards.map(({ title, text, color }, idx) => (
            <div
              key={idx}
              className={`flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border p-8 cursor-pointer max-w-xs mx-auto transition-transform duration-500`}
              onMouseMove={(e) =>
                (e.currentTarget.style.transform = calcTilt(e).transform)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <b
                className={`text-3xl ${
                  color === "cyan"
                    ? "text-cyan-400"
                    : color === "emerald"
                      ? "text-emerald-400"
                      : "text-purple-400"
                }`}
              >
                {title}
              </b>
              <p className="mt-3 text-base text-gray-200 font-medium tracking-wide">
                {text}
              </p>
            </div>
          ))}
        </div>
        {/* Team Section */}
        <div className="text-center text-4xl font-semibold mb-10 tracking-wide animate-fade-in-up">
          <p>
            MEET OUR <span className="text-cyan-400">TEAM</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10 mb-20">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="w-64 bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg cursor-pointer transition-transform duration-500"
              onMouseMove={(e) =>
                (e.currentTarget.style.transform = calcTilt(e).transform)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold text-cyan-400 text-center">
                {member.name}
              </h3>
              <p className="text-sm text-gray-200 text-center italic">
                {member.role}
              </p>
              <p className="mt-2 text-gray-300 text-center text-sm">
                {member.bio}
              </p>
              <button
                className="mt-2 text-cyan-400 font-bold mx-auto block hover:underline"
                onClick={() => speakText(member.bio)}
              >
                🔊 Listen
              </button>
            </div>
          ))}
        </div>
        {/* Testimonials Section */}
        <div className="text-center text-4xl font-semibold mb-10 tracking-wide animate-fade-in-up">
          <p>
            WHAT <span className="text-cyan-400">PEOPLE SAY</span>
          </p>
        </div>
        <div className="flex overflow-x-auto gap-6 py-6 px-4 scrollbar-hide">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="min-w-[300px] bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-500 hover:scale-105"
            >
              <p className="text-gray-200 font-medium tracking-wide">
                &quot;{t.feedback}&quot;
              </p>
              <p className="mt-4 text-cyan-400 font-bold text-right">
                - {t.name}
              </p>
              <button
                className="mt-2 text-cyan-400 font-bold hover:underline"
                onClick={() => speakText(t.feedback)}
              >
                🔊 Listen
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transformY(-20px); opacity:1; } }
        @keyframes gradient-move { 0% { background-position:0% 50%; } 50%{ background-position:100% 50%; } 100% { background-position:0% 50%; } }
        .animate-gradient-move { background-size:200% 200%; animation:gradient-move 15s ease infinite; }
        @keyframes fade-in-up { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); } }
        .animate-fade-in-up { animation:fade-in-up 1s ease forwards; }
      `}</style>
    </div>
  );
};

export default About;
