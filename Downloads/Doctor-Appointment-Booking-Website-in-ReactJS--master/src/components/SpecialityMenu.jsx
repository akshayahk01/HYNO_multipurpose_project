import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
      id="speciality"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-medium"
      >
        Find by Speciality
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="sm:w-1/3 text-center text-sm"
      >
        Simply browse through our extensive list of trusted doctors,schedule
        your appointment hassle-free.
      </motion.p>
      <motion.div
        variants={containerVariants}
        className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll"
      >
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Link
              onClick={() => scrollTo(0, 0)}
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
              to={`/doctors/${item.speciality}`}
            >
              <img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
              <p>{item.speciality}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SpecialityMenu;
