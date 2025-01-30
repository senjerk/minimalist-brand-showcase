import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white pt-16">
      <div className="container mx-auto px-4 text-center animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-light text-brand-accent mb-8">
          Crafted with Passion
        </h1>
        <p className="text-xl md:text-2xl text-brand-dark max-w-2xl mx-auto mb-12">
          We create unique pieces that blend traditional craftsmanship with modern design
        </p>
        <Link 
          to="/catalog"
          className="inline-block px-8 py-4 bg-brand-accent text-white text-lg hover:bg-brand-dark transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;