import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const initialDoctor = {
  name: "",
  speciality: "",
  phone: "",
  about: "",
  image: "",
};
const initialHospital = {
  name: "",
  address: "",
  departments: "",
  rating: "",
  about: "",
  image: "",
};

const AdminDashboard = () => {
  const {
    addDoctor,
    addHospital,
    deleteDoctor,
    deleteHospital,
    doctors,
    hospitals,
    specialities,
    departments,
  } = useContext(AppContext);
  const [doctor, setDoctor] = useState(initialDoctor);
  const [hospital, setHospital] = useState(initialHospital);
  const [doctorImagePreview, setDoctorImagePreview] = useState("");
  const [hospitalImagePreview, setHospitalImagePreview] = useState("");
  const [success, setSuccess] = useState("");
  const [formType, setFormType] = useState("doctor");
  const [filter, setFilter] = useState("");
  const [specInput, setSpecInput] = useState("");
  const [depInput, setDepInput] = useState("");

  // Doctor image upload
  const handleDoctorImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctor({ ...doctor, image: reader.result });
        setDoctorImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hospital image upload
  const handleHospitalImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHospital({ ...hospital, image: reader.result });
        setHospitalImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Autocomplete for speciality
  const handleDoctorChange = (e) => {
    if (e.target.name === "speciality") {
      setSpecInput(e.target.value);
      setDoctor({ ...doctor, speciality: e.target.value });
    } else {
      setDoctor({ ...doctor, [e.target.name]: e.target.value });
    }
  };
  // Autocomplete for departments
  const handleHospitalChange = (e) => {
    if (e.target.name === "departments") {
      setDepInput(e.target.value);
      setHospital({ ...hospital, departments: e.target.value });
    } else {
      setHospital({ ...hospital, [e.target.name]: e.target.value });
    }
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    // Generate a unique _id for the new doctor
    const newDoctor = { ...doctor, _id: "doc" + Date.now() };
    addDoctor(newDoctor);
    setSuccess("Doctor added!");
    setDoctor(initialDoctor);
    setDoctorImagePreview("");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleHospitalSubmit = (e) => {
    e.preventDefault();
    // Generate a unique id for the new hospital
    const newHospital = {
      ...hospital,
      id: "h" + Date.now(),
      departments: hospital.departments.split(",").map((d) => d.trim()),
    };
    addHospital(newHospital);
    setSuccess("Hospital added!");
    setHospital(initialHospital);
    setHospitalImagePreview("");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Filtered lists
  const filteredDoctors = filter
    ? doctors.filter((d) =>
        d.speciality.toLowerCase().includes(filter.toLowerCase()),
      )
    : doctors;
  const filteredHospitals = filter
    ? hospitals.filter((h) =>
        h.departments.join(",").toLowerCase().includes(filter.toLowerCase()),
      )
    : hospitals;

  return (
    <div className="flex flex-col gap-10 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="border px-3 py-2 rounded font-semibold"
        >
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
        </select>
        <input
          type="text"
          placeholder={
            formType === "doctor"
              ? "Filter by speciality..."
              : "Filter by department..."
          }
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {formType === "doctor" && (
        <>
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add Doctor</h2>
            <form className="flex flex-col gap-3" onSubmit={handleDoctorSubmit}>
              <input
                name="name"
                value={doctor.name}
                onChange={handleDoctorChange}
                placeholder="Doctor Name"
                className="border px-3 py-2 rounded"
                required
              />
              <input
                name="speciality"
                value={doctor.speciality}
                onChange={handleDoctorChange}
                placeholder="Speciality"
                className="border px-3 py-2 rounded"
                autoComplete="off"
                required
                list="speciality-suggestions"
              />
              <datalist id="speciality-suggestions">
                {specialities &&
                  specialities
                    .filter((s) =>
                      s.toLowerCase().startsWith(specInput.toLowerCase()),
                    )
                    .map((s) => <option key={s} value={s} />)}
              </datalist>
              <input
                name="phone"
                value={doctor.phone}
                onChange={handleDoctorChange}
                placeholder="Phone Number"
                className="border px-3 py-2 rounded"
                required
              />
              <textarea
                name="about"
                value={doctor.about}
                onChange={handleDoctorChange}
                placeholder="Doctor Description / Bio"
                className="border px-3 py-2 rounded"
                required
              />
              <label className="font-semibold">Doctor Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleDoctorImage}
                className="mb-2"
              />
              {doctorImagePreview && (
                <img
                  src={doctorImagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
              )}
              <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all duration-200">
                Add Doctor
              </button>
            </form>
          </div>
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="font-bold mb-2">All Doctors</h3>
            <ul className="divide-y">
              {filteredDoctors.map((doc) => (
                <li key={doc._id} className="py-2 flex items-center gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {doc.name}{" "}
                      <span className="text-xs text-gray-400 ml-2">
                        ID: {doc._id}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc.speciality}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDoctor(doc._id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {formType === "hospital" && (
        <>
          <div className="bg-cyan-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-cyan-700 mb-4">
              Add Hospital
            </h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleHospitalSubmit}
            >
              <input
                name="name"
                value={hospital.name}
                onChange={handleHospitalChange}
                placeholder="Hospital Name"
                className="border px-3 py-2 rounded"
                required
              />
              <input
                name="address"
                value={hospital.address}
                onChange={handleHospitalChange}
                placeholder="Address"
                className="border px-3 py-2 rounded"
                required
              />
              <input
                name="departments"
                value={hospital.departments}
                onChange={handleHospitalChange}
                placeholder="Departments (comma separated)"
                className="border px-3 py-2 rounded"
                autoComplete="off"
                required
                list="department-suggestions"
              />
              <datalist id="department-suggestions">
                {departments &&
                  departments
                    .filter((d) =>
                      d.toLowerCase().startsWith(depInput.toLowerCase()),
                    )
                    .map((d) => <option key={d} value={d} />)}
              </datalist>
              <input
                name="rating"
                value={hospital.rating}
                onChange={handleHospitalChange}
                placeholder="Rating (e.g. 4.7)"
                className="border px-3 py-2 rounded"
                required
              />
              <textarea
                name="about"
                value={hospital.about}
                onChange={handleHospitalChange}
                placeholder="About Hospital"
                className="border px-3 py-2 rounded"
                required
              />
              <label className="font-semibold">Hospital Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleHospitalImage}
                className="mb-2"
              />
              {hospitalImagePreview && (
                <img
                  src={hospitalImagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
              )}
              <button className="bg-gradient-to-r from-cyan-500 to-blue-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all duration-200">
                Add Hospital
              </button>
            </form>
          </div>
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="font-bold mb-2">All Hospitals</h3>
            <ul className="divide-y">
              {filteredHospitals.map((hosp) => (
                <li key={hosp.id} className="py-2 flex items-center gap-4">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {hosp.name}{" "}
                      <span className="text-xs text-gray-400 ml-2">
                        ID: {hosp.id}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Array.isArray(hosp.departments)
                        ? hosp.departments.join(", ")
                        : hosp.departments}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHospital(hosp.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {success && (
        <div className="text-green-600 text-center font-semibold animate-pop-in">
          {success}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
