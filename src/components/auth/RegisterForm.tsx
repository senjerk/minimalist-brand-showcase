import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const RegisterForm = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await register({ username, email, password });
    } catch (error: any) {
      if (error.errors?.fields) {
        setErrors(error.errors.fields);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && (
          <Alert variant="destructive">
            <AlertDescription>{errors.username}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <Alert variant="destructive">
            <AlertDescription>{errors.email}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <Alert variant="destructive">
            <AlertDescription>{errors.password}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" className="w-full">
        Зарегистрироваться
      </Button>
    </form>
  );
};