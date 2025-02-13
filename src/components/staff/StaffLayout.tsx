
import { Outlet } from "react-router-dom";
import StaffNavbar from "./StaffNavbar";
import Footer from "@/components/layout/Footer";

const StaffLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StaffNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StaffLayout;
