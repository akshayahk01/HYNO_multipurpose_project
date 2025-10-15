import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaCalendarAlt, FaHeartbeat, FaThermometerHalf, FaWeight, FaNotesMedical, FaSearch, FaFilter, FaDownload, FaPlus, FaChartLine, FaBullseye, FaLanguage } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const HealthJournal = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    symptoms: "",
    vitals: { bloodPressure: "", heartRate: "", temperature: "", weight: "" },
    notes: "",
    medications: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("entries");
  const [medications, setMedications] = useState([]);
  const [goals, setGoals] = useState({ weight: "", exercise: "", water: "" });
  const [insights, setInsights] = useState([]);
  const [cloudSync, setCloudSync] = useState(false);
  const { i18n } = useTranslation();

  // Load data from localStorage and Firebase
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthJournal") || "[]");
    const savedMeds = JSON.parse(localStorage.getItem("medications") || "[]");
    const savedGoals = JSON.parse(localStorage.getItem("healthGoals") || "{}");
    setEntries(saved);
    setMedications(savedMeds);
    setGoals(savedGoals);

    // Firebase sync if enabled
    if (cloudSync) {
      syncWithFirebase();
    }
  }, [cloudSync]);

  // Generate health insights
  useEffect(() => {
    if (entries.length > 0) {
      generateInsights();
    }
  }, [entries]);

  const syncWithFirebase = async () => {
    try {
      await signInAnonymously(auth);
      const querySnapshot = await getDocs(collection(db, "healthEntries"));
      const firebaseEntries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(firebaseEntries);
      localStorage.setItem("healthJournal", JSON.stringify(firebaseEntries));
    } catch (error) {
      console.error("Firebase sync error:", error);
    }
  };

  const generateInsights = () => {
    const insights = [];
    const recentEntries = entries.slice(0, 10);

    // Blood pressure trend
    const bpValues = recentEntries.filter(e => e.vitals.bloodPressure).map(e => {
      const [sys] = e.vitals.bloodPressure.split('/').map(Number);
      return sys;
    });
    if (bpValues.length > 1) {
      const avgBP = bpValues.reduce((a, b) => a + b, 0) / bpValues.length;
      if (avgBP > 140) insights.push("Your average blood pressure is elevated. Consider consulting a doctor.");
      else if (avgBP < 90) insights.push("Your blood pressure readings are low. Monitor closely.");
    }

    // Weight trend
    const weightValues = recentEntries.filter(e => e.vitals.weight).map(e => parseFloat(e.vitals.weight));
    if (weightValues.length > 1) {
      const trend = weightValues[0] - weightValues[weightValues.length - 1];
      if (Math.abs(trend) > 2) {
        insights.push(`Weight ${trend > 0 ? 'decreased' : 'increased'} by ${Math.abs(trend).toFixed(1)}kg recently.`);
      }
    }

    setInsights(insights);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthJournal") || "[]");
    setEntries(saved);
  }, []);

  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem("healthJournal", JSON.stringify(newEntries));
    if (cloudSync) {
      syncToFirebase(newEntries);
    }
  };

  const syncToFirebase = async (entries) => {
    try {
      await signInAnonymously(auth);
      const batch = entries.map(entry => addDoc(collection(db, "healthEntries"), entry));
      await Promise.all(batch);
    } catch (error) {
      console.error("Firebase sync error:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Health Journal Report", 20, 20);

    const tableData = entries.map(entry => [
      entry.date,
      entry.symptoms || "",
      entry.vitals.bloodPressure || "",
      entry.vitals.heartRate || "",
      entry.vitals.temperature || "",
      entry.vitals.weight || "",
      entry.notes || ""
    ]);

    doc.autoTable({
      head: [['Date', 'Symptoms', 'BP', 'HR', 'Temp', 'Weight', 'Notes']],
      body: tableData,
      startY: 30,
    });

    doc.save("health-journal.pdf");
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Symptoms,Blood Pressure,Heart Rate,Temperature,Weight,Notes\n"
      + entries.map(entry =>
          `${entry.date},"${entry.symptoms || ""}","${entry.vitals.bloodPressure || ""}","${entry.vitals.heartRate || ""}","${entry.vitals.temperature || ""}","${entry.vitals.weight || ""}","${entry.notes || ""}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "health-journal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm ||
      entry.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filterDateRange.start || !filterDateRange.end ||
      (entry.date >= filterDateRange.start && entry.date <= filterDateRange.end);

    return matchesSearch && matchesDate;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = entries.map(entry => entry.id === editingId ? { ...form, id: editingId } : entry);
      saveEntries(updated);
      setEditingId(null);
    } else {
      const newEntry = { ...form, id: Date.now() };
      saveEntries([...entries, newEntry]);
    }
    setForm({ date: new Date().toISOString().slice(0, 10), symptoms: "", vitals: { bloodPressure: "", heartRate: "", temperature: "", weight: "" }, notes: "", medications: [] });
  };

  const editEntry = (entry) => {
    setForm(entry);
    setEditingId(entry.id);
  };

  const deleteEntry = (id) => {
    saveEntries(entries.filter(entry => entry.id !== id));
  };

  const addMedication = () => {
    const newMed = { id: Date.now(), name: "", dosage: "", frequency: "", reminder: false };
    setMedications([...medications, newMed]);
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med => med.id === id ? { ...med, [field]: value } : med));
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem("healthGoals", JSON.stringify(newGoals));
  };

  const chartData = {
    labels: entries.slice(-10).reverse().map(entry => entry.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: entries.slice(-10).reverse().map(entry => parseFloat(entry.vitals.weight) || null),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Blood Pressure (Systolic)',
        data: entries.slice(-10).reverse().map(entry => {
          const bp = entry.vitals.bloodPressure;
          return bp ? parseInt(bp.split('/')[0]) : null;
        }),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-cyan-300 mb-6 flex items-center gap-4">
        Health Journal
        <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')} className="text-sm px-3 py-1 bg-slate-700 rounded-full flex items-center gap-1">
          <FaLanguage /> {i18n.language === 'en' ? 'हिंदी' : 'EN'}
        </button>
      </motion.h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        {['entries', 'charts', 'medications', 'goals', 'insights'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === tab ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#041127] p-4 rounded-2xl border border-slate-800 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search symptoms or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-[#021024] border border-slate-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400" />
          <input
            type="date"
            value={filterDateRange.start}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
            className="px-3 py-2 rounded bg-[#021024] border border-slate-700"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={filterDateRange.end}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
            className="px-3 py-2 rounded bg-[#021024] border border-slate-700"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="px-4 py-2 bg-green-600 text-white rounded-full flex items-center gap-2">
            <FaDownload /> PDF
          </button>
          <button onClick={exportToCSV} className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2">
            <FaDownload /> CSV
          </button>
          <button onClick={() => setCloudSync(!cloudSync)} className={`px-4 py-2 rounded-full flex items-center gap-2 ${cloudSync ? 'bg-purple-600' : 'bg-slate-600'} text-white`}>
            <FaDownload /> {cloudSync ? 'Sync On' : 'Sync Off'}
          </button>
        </div>
      </div>

      {activeTab === 'entries' && (
        <>
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#041127] p-6 rounded-2xl border border-slate-800 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Entry" : "Add New Entry"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
              <textarea placeholder="Symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} rows={3} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <input placeholder="Blood Pressure" value={form.vitals.bloodPressure} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, bloodPressure: e.target.value } })} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
              <input placeholder="Heart Rate" value={form.vitals.heartRate} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, heartRate: e.target.value } })} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
              <input placeholder="Temperature" value={form.vitals.temperature} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, temperature: e.target.value } })} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
              <input placeholder="Weight" value={form.vitals.weight} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, weight: e.target.value } })} className="px-3 py-2 rounded bg-[#021024] border border-slate-700" />
            </div>
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full mt-4 px-3 py-2 rounded bg-[#021024] border border-slate-700" />
            <button type="submit" className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-full font-semibold">{editingId ? "Update" : "Add"} Entry</button>
          </motion.form>

          <div className="space-y-4">
            {filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry) => (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#041127] p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-cyan-300" />
                    <span className="font-semibold">{entry.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editEntry(entry)} className="text-blue-400 hover:text-blue-300"><FaEdit /></button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
                  </div>
                </div>
                {entry.symptoms && <p className="mb-2"><strong>Symptoms:</strong> {entry.symptoms}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  {entry.vitals.bloodPressure && <p><FaHeartbeat className="inline mr-1" /> BP: {entry.vitals.bloodPressure}</p>}
                  {entry.vitals.heartRate && <p>HR: {entry.vitals.heartRate}</p>}
                  {entry.vitals.temperature && <p><FaThermometerHalf className="inline mr-1" /> Temp: {entry.vitals.temperature}</p>}
                  {entry.vitals.weight && <p><FaWeight className="inline mr-1" /> Weight: {entry.vitals.weight}</p>}
                </div>
                {entry.notes && <p><FaNotesMedical className="inline mr-1" /> {entry.notes}</p>}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'charts' && (
        <div className="bg-[#041127] p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <Line data={chartData} />
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="bg-[#041127] p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Medications</h2>
            <button onClick={addMedication} className="px-4 py-2 bg-cyan-500 text-white rounded-full flex items-center gap-2">
              <FaPlus /> Add Medication
            </button>
          </div>
          <div className="space-y-4">
            {medications.map(med => (
              <div key={med.id} className="bg-[#021024] p-4 rounded-lg border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input placeholder="Medication Name" value={med.name} onChange={(e) => updateMedication(med.id, 'name', e.target.value)} className="px-3 py-2 rounded bg-[#020617] border border-slate-600" />
                  <input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)} className="px-3 py-2 rounded bg-[#020617] border border-slate-600" />
                  <input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)} className="px-3 py-2 rounded bg-[#020617] border border-slate-600" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={med.reminder} onChange={(e) => updateMedication(med.id, 'reminder', e.target.checked)} />
                    <span>Reminder</span>
                    <button onClick={() => deleteMedication(med.id)} className="text-red-400 hover:text-red-300 ml-auto"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="bg-[#041127] p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaBullseye className="text-cyan-300" /> Health Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#021024] p-4 rounded-lg border border-slate-700">
              <label className="block text-sm font-medium mb-2">Target Weight (kg)</label>
              <input
                type="number"
                value={goals.weight}
                onChange={(e) => saveGoals({ ...goals, weight: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#020617] border border-slate-600"
              />
            </div>
            <div className="bg-[#021024] p-4 rounded-lg border border-slate-700">
              <label className="block text-sm font-medium mb-2">Exercise Goal (minutes/day)</label>
              <input
                type="number"
                value={goals.exercise}
                onChange={(e) => saveGoals({ ...goals, exercise: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#020617] border border-slate-600"
              />
            </div>
            <div className="bg-[#021024] p-4 rounded-lg border border-slate-700">
              <label className="block text-sm font-medium mb-2">Water Intake (glasses/day)</label>
              <input
                type="number"
                value={goals.water}
                onChange={(e) => saveGoals({ ...goals, water: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#020617] border border-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bg-[#041127] p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartLine className="text-cyan-300" /> Health Insights
          </h2>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="bg-[#021024] p-4 rounded-lg border border-slate-700">
                  <p className="text-cyan-300">{insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Add more health entries to see insights.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthJournal;
