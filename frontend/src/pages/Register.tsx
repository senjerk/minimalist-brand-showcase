
import { useAuth } from "@/contexts/AuthContext";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-muted-foreground mt-2">
            Создайте свой аккаунт
          </p>
        </div>

        <RegisterForm />
        
        <div className="text-center">
          <span className="text-muted-foreground">Уже есть аккаунт? </span>
          <Button variant="link" asChild className="p-0">
            <Link to="/login">
              Войти
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
