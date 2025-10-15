import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
import Slider from "react-slick";
import {
  FaHeartbeat,
  FaAmbulance,
  FaPhoneAlt,
  FaUpload,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSave,
  FaUserMd,
  FaShieldAlt,
  FaClock,
  FaStethoscope,
  FaCog,
  FaNewspaper,
} from "react-icons/fa";
import { LucideSearch } from "lucide-react";
import Header from "../components/Header";
import SupportChat from "../components/SupportChat";

// slick CSS must be imported in your root or here:
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* -----------------------------
  Animations + small helpers
------------------------------*/
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const neonBtn = "bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6] text-white";

/* -----------------------------
  Mock / Data (kept from your original file)
------------------------------*/
const doctorsMock = [
  {
    id: 1,
    name: "Dr. Aditi Rao",
    specialty: "Cardiology",
    exp: "12 yrs",
    rating: 4.8,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Bengaluru",
    fee: "₹800",
    availableNow: true,
  },
  {
    id: 2,
    name: "Dr. Rohan Patel",
    specialty: "Dermatology",
    exp: "9 yrs",
    rating: 4.6,
    img: "https://randomuser.me/api/portraits/men/33.jpg",
    location: "Mumbai",
    fee: "₹600",
    availableNow: false,
  },
  {
    id: 3,
    name: "Dr. Sneha Iyer",
    specialty: "Pediatrics",
    exp: "15 yrs",
    rating: 4.9,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    location: "Hyderabad",
    fee: "₹700",
    availableNow: true,
  },
];

const testimonialsMock = [
  { id: 1, name: "Priya S.", quote: "Hyno Health made booking so fast — Dr. Aditi was amazing!", img: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: 2, name: "Rahul M.", quote: "Clear records, reliable reminders. Highly recommended.", img: "https://randomuser.me/api/portraits/men/64.jpg" },
  { id: 3, name: "Sneha K.", quote: "Fantastic teleconsultation experience — no waiting!", img: "https://randomuser.me/api/portraits/women/30.jpg" },
];

/* -----------------------------
  Helper: small toast
------------------------------*/
function useToasts(ttl = 3000) {
  const [toasts, setToasts] = useState([]);
  const add = (text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };
  return { toasts, add };
}

/* -----------------------------
  Component
------------------------------*/
export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    doctorId: "",
    appointmentType: "Online",
    symptoms: "",
    date: new Date().toISOString().slice(0, 10),
    location: "",
  });

  const [reports, setReports] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [timeNow, setTimeNow] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const aiResponseTimeoutRef = useRef(null);
  const { toasts, add: addToast } = useToasts(3500);

  useEffect(() => {
    if (heroInView) controls.start("visible");
  }, [heroInView, controls]);

  useEffect(() => {
    const t = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!searchQ && selectedCategories.length === 0) return setSuggestions([]);
    const q = (searchQ || "").toLowerCase();
    setSuggestions(
      doctorsMock
        .filter((d) => {
          const matchQ = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
          const matchCat = selectedCategories.length === 0 || selectedCategories.includes(d.specialty);
          return matchQ && matchCat;
        })
        .slice(0, 6)
    );
  }, [searchQ, selectedCategories]);

  const onFormChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onFileChange = (e) => setReports(e.target.files?.[0] ?? null);

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];
    const invalid = [];
    for (let f of files) {
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      const maxSize = 10 * 1024 * 1024;
      if (!validTypes.includes(f.type) || f.size > maxSize) {
        invalid.push(f.name);
        continue;
      }
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
      validFiles.push({ file: f, name: f.name, size: f.size, type: f.type, preview, progress: 0 });
    }
    if (invalid.length) addToast(`Skipped: ${invalid.join(", ")}`);
    if (validFiles.length === 0) return;
    setUserDocuments((prev) => [...prev, ...validFiles]);
    validFiles.forEach((vf) => {
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 25;
        vf.progress = Math.min(100, Math.round(p));
        setUserDocuments((prev) => [...prev]);
        if (vf.progress >= 100) clearInterval(iv);
      }, 300);
    });
    addToast("Uploaded files added.");
  };

  const removeDocument = (index) => {
    const doc = userDocuments[index];
    if (doc?.preview) URL.revokeObjectURL(doc.preview);
    setUserDocuments((prev) => prev.filter((_, i) => i !== index));
    addToast("Document removed");
  };

  // Improved: recommend a doctor based on symptom keywords or rating
  const recommendDoctor = () => {
    const s = (form.symptoms || "").toLowerCase();
    if (!s) return addToast("Describe symptoms first for a recommendation");
    // try keyword match
    const specialty = s.includes("chest") || s.includes("breath") ? "Cardiology" : s.includes("skin") ? "Dermatology" : s.includes("child") || s.includes("kid") || s.includes("fever") ? "Pediatrics" : null;
    let chosen;
    if (specialty) chosen = doctorsMock.find((d) => d.specialty === specialty && d.availableNow) || doctorsMock.find((d) => d.specialty === specialty);
    if (!chosen) chosen = doctorsMock.slice().sort((a, b) => b.rating - a.rating)[0];
    if (chosen) {
      setForm((p) => ({ ...p, doctorId: chosen.id.toString(), department: chosen.specialty }));
      addToast(`Recommended: ${chosen.name} — ${chosen.specialty}`);
      // scroll to booking form
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ask AI: try backend then fallback to mock — improved UX and cancellation handling
  const askAi = async () => {
    if (!form.symptoms || !form.symptoms.trim()) return addToast("Please enter symptoms first");
    setAiReply("");
    setAiLoading(true);
    clearTimeout(aiResponseTimeoutRef.current);

    const steps = ["Analyzing symptoms...", "Checking similar cases...", "Preparing suggestion..."];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      setAiReply(steps[Math.min(stepIdx, steps.length - 1)]);
      stepIdx++;
      if (stepIdx > steps.length + 2) clearInterval(stepInterval);
    }, 700);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch('/api/ai-symptom', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symptoms: form.symptoms }), signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('server');
      const json = await res.json();
      if (json?.reply) {
        clearInterval(stepInterval);
        setAiReply(json.reply);
        setAiLoading(false);
        addToast('AI response received');
        const saved = JSON.parse(localStorage.getItem('ai_saved') || '[]');
        localStorage.setItem('ai_saved', JSON.stringify([{ t: Date.now(), q: form.symptoms, a: json.reply }, ...saved].slice(0, 20)));
        return;
      }
      throw new Error('invalid');
    } catch (err) {
      clearInterval(stepInterval);
      aiResponseTimeoutRef.current = setTimeout(() => {
        const reply = `Based on your symptoms ("${form.symptoms.slice(0, 160)}"), we recommend consulting a ${
          form.symptoms.toLowerCase().includes('chest') ? 'cardiologist' : form.symptoms.toLowerCase().includes('skin') ? 'dermatologist' : form.symptoms.toLowerCase().includes('fever') ? 'general physician' : 'specialist'
        }. If symptoms are severe or worsening, seek immediate care.`;
        setAiReply(reply);
        setAiLoading(false);
        addToast('AI (mock) suggestion ready');
      }, 900);
    }
  };

  // voice input (Web Speech API) improved with interim handling and cleanup
  const startVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return addToast('Voice input not supported by this browser');

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const text = Array.from(ev.results).map((r) => r[0].transcript).join('');
      setForm((p) => ({ ...p, symptoms: text }));
    };
    rec.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      addToast('Voice input ended');
    };
    rec.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
      addToast('Voice input error');
    };
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    addToast('Listening...');
  };

  useEffect(() => {
    return () => {
      // cleanup
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
      clearTimeout(aiResponseTimeoutRef.current);
    };
  }, []);

  const suggestLocation = () => {
    if (!navigator.geolocation) return addToast('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({ ...p, location: `Lat:${pos.coords.latitude.toFixed(2)}, Lon:${pos.coords.longitude.toFixed(2)}` }));
        addToast('Location detected');
      },
      () => addToast('Location permission denied or unavailable')
    );
  };

  const submitBooking = (e) => {
    e.preventDefault();
    const payload = { ...form, reportsName: reports?.name ?? null, submittedAt: new Date().toISOString() };
    console.log('Booking payload (mock):', payload);
    addToast('Appointment request submitted (mock)');
    setForm((p) => ({ ...p, symptoms: '', doctorId: '' }));
    setReports(null);
  };

  const allSpecialties = Array.from(new Set(doctorsMock.map((d) => d.specialty)));
  const toggleCategory = (cat) => setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const sliderSettings = { dots: true, infinite: true, autoplay: true, autoplaySpeed: 4500, slidesToShow: 1, slidesToScroll: 1, arrows: false };

  const saveAiReply = () => {
    if (!aiReply) return addToast('No AI reply to save');
    const saved = JSON.parse(localStorage.getItem('ai_saved') || '[]');
    localStorage.setItem('ai_saved', JSON.stringify([{ t: Date.now(), q: form.symptoms, a: aiReply }, ...saved].slice(0, 30)));
    addToast('Saved AI suggestion');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#03122a] text-slate-100 relative overflow-x-hidden">
      {/* subtle animated gradient - replace video if you don't have asset */}
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10 bg-[url('/assets/medical_bg.mp4')] bg-cover" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-24">
        <Header siteName="Hyno Health" theme="dark" />

        {/* HERO - 3-column layout (doc upload, hero text, quick booking) */}
        <section ref={heroRef} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Documents Container */}
          <motion.div initial="hidden" animate={controls} variants={fadeUp} className="bg-[#041127] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-3">My Documents</h3>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-400 transition">
              <div className="flex flex-col items-center">
                <svg width="44" height="44" viewBox="0 0 24 24" className="mb-2 fill-cyan-300"><path d="M12 2l4 4h-3v6h-2V6H8l4-4zM6 14v6h12v-6h2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6h2z"/></svg>
                <span className="text-slate-300 text-sm">Drop files here or click to upload</span>
                <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG — max 10MB</span>
              </div>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} className="hidden" />
            </label>

            <div className="mt-4 space-y-2">
              {userDocuments.length === 0 ? (
                <div className="text-xs text-slate-400">No documents uploaded yet</div>
              ) : (
                userDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#021024] p-2 rounded border border-slate-700">
                    {doc.preview ? (
                      <img src={doc.preview} alt={doc.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400">PDF</div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-slate-200 truncate">{doc.name}</div>
                      <div className="text-xs text-slate-400">{(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                      <div className="w-full bg-slate-900 h-1 rounded mt-2">
                        <div style={{ width: `${doc.progress ?? 100}%` }} className="h-1 bg-cyan-400 rounded" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeDocument(idx)} className="text-red-400 hover:text-red-300 text-lg">×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Hero text */}
          <motion.div initial="hidden" animate={controls} variants={fadeUp} className="space-y-4 lg:col-span-1">
            <div className="text-sm text-cyan-300 font-medium flex items-center gap-2">
              <FaHeartbeat className="text-cyan-300 animate-pulse" /> <span>Trusted care, anytime</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Your health, <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">reimagined</span>
            </h1>

            <div className="text-lg text-slate-300 max-w-xl">
              <TypeAnimation
                sequence={[
                  "Book trusted doctors online.", 2000,
                  "Get instant e-consults and records.", 2000,
                  "Manage your family's health in one place.", 2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ display: "inline-block" }}
                speed={50}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={() => navigate("/appointment")} className={`${neonBtn} px-6 py-3 rounded-full font-semibold shadow-lg`}>Book Appointment</button>
              <button onClick={() => document.getElementById("search-doctor")?.focus()} className="px-5 py-3 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800 transition">Find Doctors</button>
              <button onClick={() => navigate("/health-journal")} className="px-5 py-3 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800 transition flex items-center gap-2"><FaHeartbeat /> Health Journal</button>
            </div>

            {/* category chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {allSpecialties.map((s) => (
                <button key={s} onClick={() => toggleCategory(s)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${selectedCategories.includes(s) ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-300"}`}>
                  {s}
                </button>
              ))}
              <button onClick={() => setSelectedCategories([])} className="px-3 py-1 rounded-full text-xs bg-transparent border border-slate-700 text-slate-400">Clear</button>
            </div>

            {/* counters */}
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
              <div className="bg-[#041127] p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Doctors</div>
                <div className="text-xl font-bold text-cyan-300"><CountUp end={500} duration={2.5} /></div>
                <div className="text-xs text-slate-500">Verified</div>
              </div>
              <div className="bg-[#041127] p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Patients</div>
                <div className="text-xl font-bold text-blue-400"><CountUp end={12000} duration={2.5} /></div>
                <div className="text-xs text-slate-500">Served</div>
              </div>
              <div className="bg-[#041127] p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Hospitals</div>
                <div className="text-xl font-bold text-violet-400"><CountUp end={120} duration={2.5} /></div>
                <div className="text-xs text-slate-500">Partners</div>
              </div>
            </div>
          </motion.div>

          {/* Quick booking / Search */}
          <motion.aside initial="hidden" animate={controls} variants={fadeUp} className="bg-[#041127] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 justify-between mb-4">
              <div>
                <div className="text-sm text-slate-400">Quick Doctor Search</div>
                <div className="text-xs text-slate-500">Live suggestions, location aware</div>
              </div>
              <div className="text-xs text-slate-400">{timeNow.toLocaleString()}</div>
            </div>

            <div className="relative">
              <input id="search-doctor" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search name, specialty or city" className="w-full px-4 py-3 pl-11 rounded-lg bg-[#021024] border border-slate-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
              <div className="absolute left-3 top-3 text-cyan-300"><LucideSearch size={18} /></div>

              {suggestions.length > 0 && (
                <div className="mt-2 bg-[#021024] border border-slate-700 rounded-lg overflow-hidden max-h-60 overflow-auto">
                  {suggestions.map((s) => (
                    <div key={s.id} className="w-full px-3 py-2 hover:bg-slate-900 transition text-slate-200 flex items-center gap-3">
                      <img src={s.img} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="font-medium">{s.name} <span className="text-xs text-slate-400">• {s.location}</span></div>
                        <div className="text-xs text-slate-400">{s.specialty} • Fee: {s.fee}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-xs px-2 py-1 rounded ${s.availableNow ? "bg-green-800/60 text-green-300" : "bg-slate-800/40 text-slate-400"}`}>{s.availableNow ? "Available" : "Next: 4 PM"}</div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => navigate(`/doctor/${s.id}`)} className="px-3 py-1 rounded bg-[#062235] text-cyan-300">View</button>
                          <button onClick={() => { setForm((p) => ({ ...p, doctorId: s.id.toString(), department: s.specialty })); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-3 py-1 rounded border border-slate-700 text-slate-200">Book</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-4 border-slate-800" />

            <form onSubmit={submitBooking} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" value={form.name} onChange={onFormChange} placeholder="Full name" className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none" />
                <input name="email" value={form.email} onChange={onFormChange} placeholder="Email" className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="phone" value={form.phone} onChange={onFormChange} placeholder="Phone" className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none" />
                <select name="department" value={form.department} onChange={onFormChange} className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none">
                  <option value="">Choose Department</option>
                  {allSpecialties.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select name="doctorId" value={form.doctorId} onChange={onFormChange} className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none">
                  <option value="">Preferred doctor (optional)</option>
                  {doctorsMock.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                </select>
                <div className="flex gap-2">
                  <select name="appointmentType" value={form.appointmentType} onChange={onFormChange} className="flex-1 px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none">
                    <option>Online</option><option>In-Person</option>
                  </select>
                  <input name="date" type="date" value={form.date} onChange={onFormChange} className="px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none" />
                </div>
              </div>

              <textarea name="symptoms" value={form.symptoms} onChange={onFormChange} rows={3} placeholder="Briefly describe symptoms" className="w-full px-3 py-2 rounded bg-[#021024] border border-slate-700 outline-none" />

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 rounded bg-[#021024] border border-slate-700 cursor-pointer">
                  <FaUpload /> <span className="text-sm">Upload report</span>
                  <input type="file" onChange={onFileChange} className="hidden" />
                </label>

                <label className="flex items-center gap-2 px-3 py-2 rounded bg-[#021024] border border-slate-700 cursor-pointer">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleDocumentUpload} className="hidden" />
                  <span className="text-sm">Upload multiple</span>
                </label>

                <button type="button" onClick={suggestLocation} className="px-3 py-2 rounded bg-[#021024] border border-slate-700 text-slate-300">Detect location</button>

                <button type="button" onClick={recommendDoctor} className="px-3 py-2 rounded bg-[#062235] border border-slate-700 text-cyan-300">Recommend</button>

                <div className="text-xs text-slate-400 ml-auto">{form.location ? form.location : "No location"}</div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className={`${neonBtn} px-4 py-2 rounded-full font-semibold`}>Request Appointment</button>
                <button type="button" onClick={() => { setForm((p) => ({ ...p, symptoms: "" })); setAiReply(""); setReports(null); }} className="px-4 py-2 rounded-full border border-slate-700">Clear</button>
              </div>
            </form>
          </motion.aside>
        </section>

        {/* Specialists */}
        <section className="mt-12">
          <motion.h2 initial="hidden" animate={controls} variants={fadeUp} className="text-2xl font-bold text-white mb-4">Top Specialists</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctorsMock.map((d) => (
              <motion.div key={d.id} initial="hidden" animate={controls} variants={fadeUp} whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(59,130,246,0.12)" }} className="bg-[#021024] p-4 rounded-2xl border border-slate-800 shadow">
                <div className="flex items-center gap-4">
                  <img src={d.img} alt={d.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-white">{d.name}</div>
                    <div className="text-sm text-slate-400">{d.specialty} • {d.exp}</div>
                    <div className={`text-xs mt-2 inline-flex items-center gap-2 px-2 py-1 rounded ${d.availableNow ? "bg-green-800/60 text-green-300" : "bg-slate-800/40 text-slate-400"}`}>{d.availableNow ? "Available now" : "Next available: Today 4:00 PM"}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-300">Rating: <span className="text-cyan-300 font-semibold">{d.rating}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/doctor/${d.id}`)} className="px-3 py-2 rounded bg-[#062235] border border-slate-800 text-cyan-300">View</button>
                    <button onClick={() => { setForm((p) => ({ ...p, doctorId: d.id.toString() })); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-3 py-2 rounded bg-[#062235] border border-slate-800 text-slate-200">Book</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Symptom Checker + Testimonials */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <motion.div initial="hidden" animate={controls} variants={fadeUp} className="bg-[#021024] p-6 rounded-2xl border border-slate-800 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">AI Symptom Checker</div>
                <div className="text-lg font-semibold text-white">Describe symptoms — get quick guidance</div>
              </div>
              <div className="text-xs text-slate-400">Not a diagnosis</div>
            </div>

            <textarea name="ai" value={form.symptoms} onChange={onFormChange} rows={4} placeholder="e.g., mild chest pain when climbing stairs, shortness of breath" className="w-full mt-4 px-3 py-2 rounded bg-[#011526] border border-slate-700 outline-none" />

            <div className="flex items-center gap-3 mt-3">
              <button onClick={askAi} disabled={aiLoading} className={`${neonBtn} px-4 py-2 rounded-full font-semibold`}>{aiLoading ? "Checking..." : "Ask AI"}</button>

              <button onClick={() => { setAiReply(""); setAiLoading(false); }} className="px-4 py-2 rounded-full border border-slate-700">Reset</button>

              {/* voice input */}
              <button onClick={() => listening ? (recognitionRef.current?.stop(), setListening(false)) : startVoice()} className="px-3 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                {listening ? <FaMicrophoneSlash /> : <FaMicrophone />} <span className="text-sm">{listening ? "Stop" : "Voice"}</span>
              </button>

              <button onClick={saveAiReply} className="ml-auto px-3 py-2 rounded-full border border-slate-700 flex items-center gap-2"><FaSave /> <span className="text-sm">Save note</span></button>
            </div>

            <div className="mt-4">
              {aiReply ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#011526] p-4 rounded-lg border border-slate-700 text-slate-200">
                  <div className="font-medium text-cyan-300">AI suggestion</div>
                  <div className="mt-2 text-sm whitespace-pre-wrap">{aiReply}</div>
                </motion.div>
              ) : (
                <div className="text-sm text-slate-500">No AI results yet — try describing your symptoms and click Ask AI.</div>
              )}
            </div>
          </motion.div>

          {/* Testimonials Carousel */}
          <motion.div initial="hidden" animate={controls} variants={fadeUp} className="bg-[#021024] p-6 rounded-2xl border border-slate-800 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-white">Patient Stories</div>
              <div className="text-xs text-slate-400">Real experiences</div>
            </div>

            <Slider {...sliderSettings}>
              {testimonialsMock.map((t) => (
                <div key={t.id} className="px-3">
                  <div className="bg-[#011526] p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                      <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-xs text-slate-400">Verified patient</div>
                      </div>
                    </div>
                    <div className="mt-3 text-slate-200">“{t.quote}”</div>
                  </div>
                </div>
              ))}
            </Slider>
          </motion.div>
        </section>

      </div>

      {/* Floating emergency / chat buttons */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3 items-end">
        <a href="tel:108" className="flex items-center gap-3 px-4 py-3 rounded-full bg-red-600 text-white shadow-xl">
          <FaAmbulance /> <span className="hidden sm:block">Call Ambulance</span>
        </a>
        <button onClick={() => document.querySelector('#support-chat')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#02172b] text-cyan-300 shadow-xl border border-cyan-500/20">
          <FaPhoneAlt /> <span className="hidden sm:block">Contact</span>
        </button>
      </div>

      {/* SupportChat (keeps existing component) */}
      <div id="support-chat"><SupportChat /></div>

      {/* Toast area */}
      <div className="fixed left-4 bottom-6 flex flex-col gap-2 z-60">
        {toasts.map((t) => (
          <div key={t.id} className="bg-[#011526] text-white text-sm px-4 py-2 rounded shadow border border-slate-700">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
