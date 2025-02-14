
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { OrdersResponse, Order } from "@/types/api";
import { Loader2, LogOut, User, List, Settings } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Profile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'orders' | 'settings'>('orders');

  const { data: ordersData, isLoading } = useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить заказы");
      }
    }
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WP': return 'text-yellow-600 bg-yellow-50';
      case 'PD': return 'text-blue-600 bg-blue-50';
      case 'IW': return 'text-purple-600 bg-purple-50';
      case 'DR': return 'text-indigo-600 bg-indigo-50';
      case 'ID': return 'text-orange-600 bg-orange-50';
      case 'DV': return 'text-green-600 bg-green-50';
      case 'CN': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Компонент для отдельного заказа (оставляем без изменений)
  const OrderCard = ({ order }: { order: Order }) => {
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    const handlePayment = async () => {
      setIsLoadingPayment(true);
      try {
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orderDetail(order.id)}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        
        if (data.data.confirmation_url) {
          window.location.href = data.data.confirmation_url;
        } else {
          toast.error("Не удалось получить ссылку для оплаты");
        }
      } catch (error) {
        console.error('Error fetching payment URL:', error);
        toast.error("Не удалось получить ссылку для оплаты");
      } finally {
        setIsLoadingPayment(false);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.phone}</p>
            <p className="text-sm text-gray-500">{order.address}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status.status)}`}>
            {order.status.status_display}
          </span>
        </div>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>
                {item.product.name} ({item.garment.color.name}, {item.garment.size}) x {item.quantity}
              </span>
              <span>{item.total_price} ₽</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-semibold">Итого: {order.total_sum} ₽</span>
          {order.status.status === 'WP' && (
            <Button
              onClick={handlePayment}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoadingPayment}
            >
              {isLoadingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                'Оплатить'
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Информация о пользователе */}
      <div className="mb-8 p-6 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.email || 'Пользователь'}</h2>
              <p className="text-muted-foreground">ID: {user?.id || 'N/A'}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </div>
      </div>

      {/* Карточки навигации */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeSection === 'orders' ? 'border-primary' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <List className="w-6 h-6 text-white" />
            </div>
            <CardTitle>История заказов</CardTitle>
            <CardDescription>
              Просмотр и отслеживание ваших заказов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
            >
              Открыть
              <List className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeSection === 'settings' ? 'border-primary' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Настройки профиля</CardTitle>
            <CardDescription>
              Управление настройками вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              Открыть
              <Settings className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Контент секции */}
      {activeSection === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">История заказов</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : ordersData?.data.results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              У вас пока нет заказов
            </div>
          ) : (
            <div className="space-y-6">
              {ordersData?.data.results.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Настройки профиля</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">
              Дополнительные настройки профиля появятся в ближайшее время
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
