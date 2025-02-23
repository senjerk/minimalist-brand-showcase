
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 mix-blend-multiply" />
          <img
            src="https://static.tildacdn.com/tild6666-3362-4864-b366-303464353862/noroot.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Glass Background for Text */}
            <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                4 Изысканная вышивка
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
                  для вашего стиля
                </span>
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
                Создаем уникальные дизайны вышивки, которые подчеркнут вашу индивидуальность
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/constructor"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white overflow-hidden rounded-full transition-all duration-300"
                >
                  {/* Градиентный фон */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:opacity-90" />
                  
                  {/* Анимированная обводка */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-300/50 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                  
                  {/* Внутреннее свечение при наведении */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white blur transition-all duration-300" />
                  
                  {/* Текст кнопки */}
                  <span className="relative">Создать свой дизайн</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
