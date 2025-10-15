// Centralized hospital data for all hospital-related pages
const hospitals = [
  {
    id: "h1",
    name: "Apollo Hospitals, Chennai",
    image: "/hospital1.jpg",
    address: "21 Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006",
    phone: "+91-44-2829-3333",
    email: "info@apollohospitals.com",
    website: "https://www.apollohospitals.com",
    departments: ["Cardiology", "Orthopedics", "Neurology", "Oncology", "Emergency"],
    rating: 4.8,
    bedCount: 1000,
    doctorsCount: 500,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Surgery"],
    coords: [13.0827, 80.2707], // Chennai coordinates
    about: "Apollo Hospitals is a leading multispeciality hospital in India with world-class facilities, experienced doctors, and advanced medical technology. Known for pioneering treatments in cardiology and oncology.",
    reviews: [
      { user: "Rajesh Kumar", rating: 5, comment: "Excellent care during my heart surgery. Highly recommend!" },
      { user: "Priya Sharma", rating: 4, comment: "Good facilities, but waiting times can be long." }
    ],
    emergencyContact: "+91-44-2829-3333"
  },
  {
    id: "h2",
    name: "Max Super Speciality Hospital, Delhi",
    image: "/hospital2.jpg",
    address: "FC-50, C & D Block, Shalimar Bagh, Delhi 110088",
    phone: "+91-11-6642-2222",
    email: "info@maxhealthcare.com",
    website: "https://www.maxhealthcare.in",
    departments: ["Pediatrics", "Dermatology", "ENT", "Cardiology", "Gynecology"],
    rating: 4.6,
    bedCount: 800,
    doctorsCount: 350,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Maternity"],
    coords: [28.7041, 77.1025], // Delhi coordinates
    about: "Max Healthcare is a network of super-speciality hospitals in India with NABH and JCI accreditations. Offers comprehensive healthcare services with a focus on patient safety and quality.",
    reviews: [
      { user: "Anita Gupta", rating: 5, comment: "Great pediatric care for my child." },
      { user: "Vikram Singh", rating: 4, comment: "Modern facilities and skilled doctors." }
    ],
    emergencyContact: "+91-11-6642-2222"
  },
  {
    id: "h3",
    name: "Fortis Hospital, Mumbai",
    image: "/hospital3.jpg",
    address: "Mulund Goregaon Link Road, Mulund (West), Mumbai, Maharashtra 400078",
    phone: "+91-22-4365-4365",
    email: "info@fortishealthcare.com",
    website: "https://www.fortishealthcare.com",
    departments: ["General Surgery", "Gynecology", "Urology", "Orthopedics", "Neurology"],
    rating: 4.7,
    bedCount: 600,
    doctorsCount: 300,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Cancer Care"],
    coords: [19.0760, 72.8777], // Mumbai coordinates
    about: "Fortis Healthcare is one of India's leading healthcare providers with a network of hospitals. Known for advanced surgical procedures and comprehensive care.",
    reviews: [
      { user: "Suresh Patel", rating: 5, comment: "Excellent surgery team." },
      { user: "Meera Joshi", rating: 4, comment: "Good overall experience." }
    ],
    emergencyContact: "+91-22-4365-4365"
  },
  {
    id: "h4",
    name: "AIIMS, New Delhi",
    image: "/hospital4.jpg",
    address: "Ansari Nagar, New Delhi 110029",
    phone: "+91-11-2658-8500",
    email: "info@aiims.edu",
    website: "https://www.aiims.edu",
    departments: ["Cardiology", "Pulmonology", "Oncology", "Neurology", "Pediatrics"],
    rating: 4.9,
    bedCount: 2000,
    doctorsCount: 800,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Research"],
    coords: [28.5672, 77.2100], // New Delhi coordinates
    about: "All India Institute of Medical Sciences (AIIMS) is a premier medical institution in India, providing cutting-edge medical education, research, and patient care.",
    reviews: [
      { user: "Dr. Ramesh", rating: 5, comment: "World-class research and care." },
      { user: "Kavita Rai", rating: 5, comment: "Best hospital for complex cases." }
    ],
    emergencyContact: "+91-11-2658-8500"
  },
  {
    id: "h5",
    name: "Manipal Hospital, Bangalore",
    image: "/hospital5.jpg",
    address: "98, HAL Airport Road, Bangalore, Karnataka 560017",
    phone: "+91-80-2502-4444",
    email: "info@manipalhospitals.com",
    website: "https://www.manipalhospitals.com",
    departments: ["Orthopedics", "ENT", "Dermatology", "Cardiology", "Gynecology"],
    rating: 4.5,
    bedCount: 700,
    doctorsCount: 400,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Telemedicine"],
    coords: [12.9716, 77.5946], // Bangalore coordinates
    about: "Manipal Hospitals is a leading healthcare network in India, offering comprehensive medical services with a focus on innovation and patient-centric care.",
    reviews: [
      { user: "Arun Kumar", rating: 4, comment: "Good facilities and staff." },
      { user: "Sneha Reddy", rating: 5, comment: "Excellent telemedicine services." }
    ],
    emergencyContact: "+91-80-2502-4444"
  },
  {
    id: "h6",
    name: "Rainbow Children's Hospital, Hyderabad",
    image: "/hospital6.jpg",
    address: "22, Rd Number 10, Banjara Hills, Hyderabad, Telangana 500034",
    phone: "+91-40-2339-9999",
    email: "info@rainbowhospitals.in",
    website: "https://www.rainbowhospitals.in",
    departments: ["Pediatrics", "General Surgery", "Neonatology"],
    rating: 4.8,
    bedCount: 300,
    doctorsCount: 150,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Child Care"],
    coords: [17.3850, 78.4867], // Hyderabad coordinates
    about: "Rainbow Children's Hospital is dedicated to pediatric and neonatal care, providing specialized medical services for children with state-of-the-art facilities.",
    reviews: [
      { user: "Vijay Sharma", rating: 5, comment: "Amazing care for my newborn." },
      { user: "Lakshmi Iyer", rating: 4, comment: "Friendly staff and good facilities." }
    ],
    emergencyContact: "+91-40-2339-9999"
  },
  {
    id: "h7",
    name: "Kokilaben Dhirubhai Ambani Hospital, Mumbai",
    image: "/hospital7.jpg",
    address: "Rao Saheb Acharya Rd, Kokilaben Hospital, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
    phone: "+91-22-3099-9999",
    email: "info@kokilabenhospital.com",
    website: "https://www.kokilabenhospital.com",
    departments: ["Gynecology", "Obstetrics", "Cardiology", "Oncology"],
    rating: 4.7,
    bedCount: 750,
    doctorsCount: 400,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Maternity"],
    coords: [19.1363, 72.8277], // Mumbai coordinates
    about: "Kokilaben Dhirubhai Ambani Hospital is a modern tertiary care hospital in Mumbai, offering advanced medical treatments and compassionate care.",
    reviews: [
      { user: "Rita Desai", rating: 5, comment: "Excellent maternity services." },
      { user: "Amit Jain", rating: 4, comment: "High-quality care." }
    ],
    emergencyContact: "+91-22-3099-9999"
  },
  {
    id: "h8",
    name: "Medanta - The Medicity, Gurgaon",
    image: "/hospital8.jpg",
    address: "CH Baktawar Singh Rd, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122001",
    phone: "+91-124-414-1414",
    email: "info@medanta.org",
    website: "https://www.medanta.org",
    departments: ["Urology", "Cardiology", "Neurology", "Oncology", "Orthopedics"],
    rating: 4.6,
    bedCount: 1250,
    doctorsCount: 600,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Robotic Surgery"],
    coords: [28.4595, 77.0266], // Gurgaon coordinates
    about: "Medanta is a multi-super speciality institute in India, known for its advanced medical technology and renowned doctors.",
    reviews: [
      { user: "Sunil Verma", rating: 5, comment: "Top-notch urology department." },
      { user: "Poonam Singh", rating: 4, comment: "Good overall experience." }
    ],
    emergencyContact: "+91-124-414-1414"
  },
  {
    id: "h9",
    name: "Narayana Health, Bangalore",
    image: "/hospital9.jpg",
    address: "258/A, Bommasandra Industrial Area, Hosur Road, Bangalore, Karnataka 560099",
    phone: "+91-80-7122-2222",
    email: "info@narayanahealth.org",
    website: "https://www.narayanahealth.org",
    departments: ["General Surgery", "Orthopedics", "ENT", "Cardiology"],
    rating: 4.5,
    bedCount: 1000,
    doctorsCount: 500,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "Affordable Care"],
    coords: [12.9716, 77.5946], // Bangalore coordinates
    about: "Narayana Health is a network of hospitals in India, committed to providing quality healthcare at affordable prices.",
    reviews: [
      { user: "Rajendra Prasad", rating: 4, comment: "Affordable and good care." },
      { user: "Kiran Bhat", rating: 5, comment: "Excellent surgical team." }
    ],
    emergencyContact: "+91-80-7122-2222"
  },
  {
    id: "h10",
    name: "Columbia Asia Hospital, Pune",
    image: "/hospital10.jpg",
    address: "22, 2A, Mundhwa - Kharadi Rd, Near Nyati Empire, Santipur, Thite Nagar, Kharadi, Pune, Maharashtra 411014",
    phone: "+91-20-6165-6666",
    email: "info@columbiaasia.com",
    website: "https://www.columbiaasia.com",
    departments: ["Dermatology", "Pulmonology", "Oncology", "Gynecology"],
    rating: 4.4,
    bedCount: 400,
    doctorsCount: 200,
    services: ["24/7 Emergency", "Ambulance", "Pharmacy", "Lab Tests", "International Standards"],
    coords: [18.5204, 73.8567], // Pune coordinates
    about: "Columbia Asia is a network of hospitals in India, offering international standard healthcare services with a focus on patient safety.",
    reviews: [
      { user: "Nisha Agarwal", rating: 4, comment: "Clean and well-maintained." },
      { user: "Deepak Rao", rating: 4, comment: "Good dermatology services." }
    ],
    emergencyContact: "+91-20-6165-6666"
  }
];

export default hospitals;
