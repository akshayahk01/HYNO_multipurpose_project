// src/components/HandleInvoice.jsx
import React from "react";
import { jsPDF } from "jspdf";

const HandleInvoice = ({ appointment, className }) => {
  const downloadInvoice = () => {
    if (!appointment) return;

    const doc = new jsPDF("p", "pt", "a4");

    // Logo
    const logo = new Image();
    logo.src = "/assets/logo.png"; // must exist in public/assets/

    logo.onload = () => {
      doc.addImage(logo, "PNG", 40, 20, 50, 50);

      // Header
      doc.setFillColor("#6b21a8");
      doc.rect(0, 0, 600, 80, "F");
      doc.setTextColor("#ffffff");
      doc.setFontSize(22);
      doc.text("Hyno Health Management", 110, 50);
      doc.setFontSize(12);
      doc.text(
        `Invoice No: INV-${Math.floor(Math.random() * 100000)}`,
        420,
        40,
      );
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 420, 60);

      // Doctor Info
      doc.setTextColor("#000000");
      doc.setFontSize(14);
      doc.text("👨‍⚕️ Doctor Details:", 40, 120);
      doc.setFontSize(12);
      doc.text(`Dr. ${appointment.name}`, 40, 140);
      doc.text(`Speciality: ${appointment.speciality}`, 40, 155);

      // Patient Info
      doc.setFontSize(14);
      doc.text("🧑 Patient Details:", 40, 190);
      doc.setFontSize(12);
      doc.text(`Name: ${appointment.patient.name}`, 40, 210);
      doc.text(`Age: ${appointment.patient.age}`, 40, 225);
      doc.text(`Contact: ${appointment.patient.contact}`, 40, 240);
      doc.text(`Email: ${appointment.patient.email}`, 40, 255);

      // Appointment Info
      doc.setFontSize(14);
      doc.text("📅 Appointment Details:", 40, 290);
      doc.setFontSize(12);
      doc.text(`Date: ${appointment.datetime.toDateString()}`, 40, 310);
      doc.text(
        `Time: ${appointment.datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        40,
        325,
      );
      doc.text(`Reason: ${appointment.patient.reason}`, 40, 340);

      // Payment Info
      doc.setFontSize(14);
      doc.text("💳 Payment Details:", 40, 380);
      doc.setFontSize(12);
      doc.setTextColor("#16a34a");
      doc.text(`Status: ${appointment.status}`, 40, 400);
      doc.text(`Consultation Fee: ₹${appointment.fees || 800}`, 40, 415);

      // Footer
      doc.setTextColor("#555");
      doc.setFontSize(10);
      doc.text(
        "Thank you for choosing Hyno Health Management. Stay healthy & safe.",
        40,
        820,
      );

      doc.save(`Invoice_${appointment.patient.name}.pdf`);
    };
  };

  return (
    <button
      onClick={downloadInvoice}
      className={
        className ||
        "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
      }
    >
      📄 Download Invoice
    </button>
  );
};

export default HandleInvoice;
