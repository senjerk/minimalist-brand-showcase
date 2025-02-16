
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Login = () => {
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
          <h1 className="text-2xl font-bold">Войти в аккаунт</h1>
          <p className="text-muted-foreground mt-2">
            Введите свои данные для входа
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <span className="text-muted-foreground">Нет аккаунта? </span>
          <Button variant="link" asChild className="p-0">
            <Link to="/register">
              Зарегистрироваться
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
