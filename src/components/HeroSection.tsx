import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Изысканная вышивка для вашего стиля
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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