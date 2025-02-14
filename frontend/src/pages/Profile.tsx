import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Профиль пользователя</h1>
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button variant="destructive" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;