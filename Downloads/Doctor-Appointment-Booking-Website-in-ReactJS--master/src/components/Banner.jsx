import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-auto max-w-7xl">
      {/*------------Left Side-------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 flex flex-col justify-center">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white text-center md:text-left">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors </p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all block mx-auto md:mx-0"
        >
          Create account
        </button>
      </div>
      {/*--------------Right Side-------------------- */}
      <div className="hidden md:flex md:w-1/2 lg:w-[370px] items-center justify-center">
        <img
          className="w-full max-w-md"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
