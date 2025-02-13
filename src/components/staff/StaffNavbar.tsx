
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const StaffNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { title: "Менеджер заказов", path: "/staff/orders" },
    { title: "Чаты", path: "/staff/chats" }
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/staff" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Lovable Staff
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === item.path && "text-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <AuthDialog />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center gap-2">
            <AuthDialog />
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-md text-base font-medium",
                        location.pathname === item.path && "text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
