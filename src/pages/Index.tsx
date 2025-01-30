import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <GallerySection />
      <TestimonialsSection />
      <footer className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/catalog"
            className="inline-block px-8 py-4 border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
          >
            View Full Catalog
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;