import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.7, 0.75, 0.7],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-full h-full"
        >
          <img
            src="https://placehold.co/1920x1080"
            alt="Background"
            className="w-full h-full object-cover blur-sm"
          />
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Изысканная вышивка для вашего стиля
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
          Создаем уникальные дизайны вышивки, которые подчеркнут вашу индивидуальность
        </p>
        <Link
          to="/constructor"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          Создать свой дизайн
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;