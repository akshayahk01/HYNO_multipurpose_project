const PrivacyPolicy = () => {
  return (
    <div className="relative w-full min-h-screen bg-gray-50 text-gray-900 font-sans p-8 overflow-hidden">
      {/* Background Images */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588776814546-1e3a7a7a7a7a?auto=format&fit=crop&w=1470&q=80"
          alt="Privacy Background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 animate-fade-in-left"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-10 backdrop-blur-md border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700 animate-fade-in-up">
          Privacy Policy
        </h1>
        <p
          className="mb-4 leading-relaxed text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "0.2s" }}
        >
          Your privacy is important to us. This privacy policy explains how we
          collect, use, and protect your personal information when you use our
          Doctor Appointment Booking Website.
        </p>
        <h2
          className="text-2xl font-semibold mt-6 mb-3 text-indigo-600 animate-fade-in-up text-left"
          style={{ animationDelay: "0.4s" }}
        >
          Information We Collect
        </h2>
        <ul
          className="list-disc list-inside mb-4 text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "0.6s" }}
        >
          <li>
            Personal identification information (Name, email address, phone
            number, etc.)
          </li>
          <li>Appointment details and medical preferences</li>
          <li>Usage data and cookies</li>
        </ul>
        <h2
          className="text-2xl font-semibold mt-6 mb-3 text-indigo-600 animate-fade-in-up text-left"
          style={{ animationDelay: "0.8s" }}
        >
          How We Use Your Information
        </h2>
        <ul
          className="list-disc list-inside mb-4 text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "1s" }}
        >
          <li>To provide and manage your appointments</li>
          <li>To communicate important updates and reminders</li>
          <li>To improve our services and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2
          className="text-2xl font-semibold mt-6 mb-3 text-indigo-600 animate-fade-in-up text-left"
          style={{ animationDelay: "1.2s" }}
        >
          Security
        </h2>
        <p
          className="mb-4 leading-relaxed text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "1.4s" }}
        >
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction.
        </p>
        <h2
          className="text-2xl font-semibold mt-6 mb-3 text-indigo-600 animate-fade-in-up text-left"
          style={{ animationDelay: "1.6s" }}
        >
          Your Rights
        </h2>
        <p
          className="mb-4 leading-relaxed text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "1.8s" }}
        >
          You have the right to access, correct, or delete your personal
          information. You can also opt out of receiving marketing
          communications.
        </p>
        <h2
          className="text-2xl font-semibold mt-6 mb-3 text-indigo-600 animate-fade-in-up text-left"
          style={{ animationDelay: "2s" }}
        >
          Contact Us
        </h2>
        <p
          className="mb-4 leading-relaxed text-gray-700 animate-fade-in-up text-left"
          style={{ animationDelay: "2.2s" }}
        >
          If you have any questions about this privacy policy, please contact us
          at{" "}
          <a
            href="mailto:support@doctorbooking.com"
            className="text-indigo-700 underline"
          >
            support@doctorbooking.com
          </a>
          .
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left {
          animation: fade-in-left 1s ease forwards;
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 1s ease forwards;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
