import HeroSection from "@/components/HeroSection";
import WorkShowcase from "@/components/WorkShowcase";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";

const Home = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <WorkShowcase />
      <Process />
      <Testimonials />
    </div>
  );
};

export default Home;