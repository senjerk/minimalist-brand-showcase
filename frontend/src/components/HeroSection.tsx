import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative">
      
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img
              src="https://static.tildacdn.com/tild6666-3362-4864-b366-303464353862/noroot.png"
              alt="Background"
              className="w-full h-full object-cover"
            />

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
    </div>
  );
};

export default HeroSection;