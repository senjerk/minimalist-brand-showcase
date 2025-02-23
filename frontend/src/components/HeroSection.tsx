
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
                Изысканная вышивка
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
                  className="inline-flex items-center px-8 py-4 border-2 border-purple-300 text-lg font-medium rounded-full text-white bg-purple-600/80 hover:bg-purple-700/90 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20"
                >
                  Создать свой дизайн
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
