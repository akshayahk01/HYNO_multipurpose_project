import React from "react";
import HospitalList from "../components/HospitalList";

const Hospitals = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center animate-fade-in">
        All Hospitals
      </h1>
      <HospitalList />
    </div>
  );
};

export default Hospitals;
