import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthDialog = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
      return;
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          onClick={handleProfileClick}
        >
          <User className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      {!isAuthenticated && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isRegister ? "Регистрация" : "Вход в аккаунт"}
            </DialogTitle>
          </DialogHeader>
          {isRegister ? <RegisterForm /> : <LoginForm />}
          <Button
            variant="link"
            className="mt-4"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрироваться"}
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};