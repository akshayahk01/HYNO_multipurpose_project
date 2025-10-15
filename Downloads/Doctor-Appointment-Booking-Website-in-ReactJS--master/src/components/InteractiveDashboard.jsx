import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeartbeat,
  FaWeight,
  FaMoon,
  FaWalking,
  FaTint,
  FaCalendarCheck,
  FaClock,
  FaBell,
  FaPlus,
  FaChartLine,
  FaUserMd,
  FaFileMedical,
  FaPills,
  FaUtensils,
  FaRunning,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InteractiveDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [healthData, setHealthData] = useState({
    weight: [70, 69.5, 69.8, 70.2, 69.9, 69.7, 70.1],
    bloodPressure: [120, 118, 122, 119, 121, 117, 120],
    heartRate: [72, 75, 70, 73, 71, 74, 72],
    sleep: [7.5, 8.0, 6.5, 7.8, 7.2, 8.1, 7.9],
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "health", label: "Health", icon: <FaHeartbeat /> },
    { id: "appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { id: "goals", label: "Goals", icon: <FaCheckCircle /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
  ];

  const quickActions = [
    { icon: <FaUserMd />, label: "Book Appointment", color: "bg-blue-500" },
    { icon: <FaPills />, label: "Add Medication", color: "bg-green-500" },
    { icon: <FaRunning />, label: "Log Activity", color: "bg-orange-500" },
    { icon: <FaUtensils />, label: "Track Diet", color: "bg-purple-500" },
  ];

  const appointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "2024-01-15", time: "10:00 AM", status: "confirmed", type: "In-person" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatologist", date: "2024-01-18", time: "2:30 PM", status: "pending", type: "Telemedicine" },
    { id: 3, doctor: "Dr. Emily Davis", specialty: "General Physician", date: "2024-01-20", time: "11:15 AM", status: "completed", type: "In-person" },
  ];

  const goals = [
    { name: "Weight Loss", current: 68, target: 65, unit: "kg", progress: 75 },
    { name: "Daily Steps", current: 8500, target: 10000, unit: "steps", progress: 85 },
    { name: "Water Intake", current: 6, target: 8, unit: "glasses", progress: 75 },
    { name: "Sleep Hours", current: 7.5, target: 8, unit: "hours", progress: 94 },
  ];

  const notifications = [
    { id: 1, type: "appointment", message: "Appointment with Dr. Johnson tomorrow at 10:00 AM", time: "2 hours ago", read: false },
    { id: 2, type: "reminder", message: "Don't forget to take your medication", time: "4 hours ago", read: false },
    { id: 3, type: "goal", message: "Congratulations! You reached your daily step goal!", time: "1 day ago", read: true },
    { id: 4, type: "health", message: "Your blood pressure reading is within normal range", time: "2 days ago", read: true },
  ];

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weight (kg)",
        data: healthData.weight,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Health Trends",
      },
    },
  };

  const goalProgressData = {
    labels: goals.map(goal => goal.name),
    datasets: [
      {
        label: "Progress (%)",
        data: goals.map(goal => goal.progress),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-100">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <div className="text-sm font-medium">{action.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Health Overview Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Health Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaHeartbeat className="text-blue-600" />
                      <span className="text-sm font-medium">Heart Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">72 bpm</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <FaArrowDown className="mr-1" /> 2 bpm from last week
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaWeight className="text-green-600" />
                      <span className="text-sm font-medium">Weight</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">70.1 kg</div>
                    <div className="text-xs text-red-600 flex items-center">
                      <FaArrowUp className="mr-1" /> 0.4 kg from last week
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaMoon className="text-purple-600" />
                      <span className="text-sm font-medium">Sleep</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">7.9 hrs</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <FaArrowUp className="mr-1" /> 0.7 hrs from last week
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaWalking className="text-orange-600" />
                      <span className="text-sm font-medium">Steps</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">8,500</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <FaArrowUp className="mr-1" /> 1,200 from yesterday
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Appointments */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserMd className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{apt.doctor}</div>
                          <div className="text-sm text-gray-600">{apt.specialty} • {apt.date} at {apt.time}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Health Metrics</h3>
              <div className="bg-white p-4 rounded-xl shadow">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow">
                  <h4 className="font-medium mb-3">Blood Pressure Trend</h4>
                  <Line
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [{
                        label: "Systolic",
                        data: healthData.bloodPressure,
                        borderColor: "rgb(239, 68, 68)",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        tension: 0.4,
                      }]
                    }}
                    options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                  />
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                  <h4 className="font-medium mb-3">Heart Rate Trend</h4>
                  <Line
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [{
                        label: "BPM",
                        data: healthData.heartRate,
                        borderColor: "rgb(34, 197, 94)",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        tension: 0.4,
                      }]
                    }}
                    options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Appointment Timeline</h3>
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{apt.doctor}</div>
                      <div className="text-sm text-gray-600">{apt.specialty}</div>
                      <div className="text-sm text-gray-500">{apt.date} at {apt.time}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </span>
                      <span className="text-xs text-gray-500">{apt.type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Health Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{goal.name}</h4>
                      <span className="text-sm text-gray-500">{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="text-right text-sm font-medium text-blue-600">{goal.progress}%</div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <h4 className="font-medium mb-4">Goal Progress Overview</h4>
                <Bar
                  data={goalProgressData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Goal Achievement" }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl shadow ${notif.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notif.type === 'appointment' ? 'bg-blue-100' :
                        notif.type === 'reminder' ? 'bg-yellow-100' :
                        notif.type === 'goal' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {notif.type === 'appointment' && <FaCalendarCheck className="text-blue-600" />}
                        {notif.type === 'reminder' && <FaBell className="text-yellow-600" />}
                        {notif.type === 'goal' && <FaCheckCircle className="text-green-600" />}
                        {notif.type === 'health' && <FaHeartbeat className="text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDashboard;
