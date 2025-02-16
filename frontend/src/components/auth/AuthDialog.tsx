
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthDialog = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
      return;
    }
    navigate("/login");
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="relative"
      onClick={handleProfileClick}
    >
      <User className="h-5 w-5" />
    </Button>
  );
};
