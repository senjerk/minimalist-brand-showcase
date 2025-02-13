
import { ReactNode } from "react";
import StaffNavbar from "./StaffNavbar";
import Footer from "@/components/layout/Footer";

interface StaffLayoutProps {
  children: ReactNode;
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StaffNavbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default StaffLayout;
