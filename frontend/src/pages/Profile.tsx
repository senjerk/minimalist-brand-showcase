import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { OrdersResponse, Order } from "@/types/api";
import { Loader2, LogOut, User, List, Settings, Shield, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Cookies from "js-cookie";

const Profile = () => {
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'orders' | 'settings'>('orders');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery<OrdersResponse>({
    queryKey: ['orders', currentPage],
    queryFn: async () => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}?page=${currentPage}`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      return data;
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

  const handleStaffClick = () => {
    queryClient.prefetchQuery({
      queryKey: ['staff-orders'],
      queryFn: async () => {
        return { data: [] };
      }
    });
    navigate('/staff');
  };

  const handleSupportClick = () => {
    navigate('/support');
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (ordersData?.data.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

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

    const handleCancel = async () => {
      setIsCancelling(true);
      try {
        const csrftoken = Cookies.get('csrftoken');
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orderDetail(order.id)}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'X-CSRFToken': csrftoken || '',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to cancel order');
        }

        toast.success("Заказ успешно отменен");
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error(error instanceof Error ? error.message : "Не удалось отменить заказ");
      } finally {
        setIsCancelling(false);
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
          <div className="flex gap-2">
            {!['DV', 'CN'].includes(order.status.status) && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отмена...
                  </>
                ) : (
                  'Отменить'
                )}
              </Button>
            )}
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
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6 md:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium truncate">{user?.email || 'Пользователь'}</h2>
            <p className="text-sm text-muted-foreground">ID: {user?.id || 'N/A'}</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Выйти из аккаунта
        </Button>
      </div>

      <div className="hidden md:block mb-8 p-6 bg-muted rounded-lg">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeSection === 'orders' ? 'border-primary' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          <CardHeader className="pb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
              <List className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">История заказов</CardTitle>
            <CardDescription className="text-sm">
              Просмотр и отслеживание заказов
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeSection === 'settings' ? 'border-primary' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <CardHeader className="pb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">Настройки профиля</CardTitle>
            <CardDescription className="text-sm">
              Управление настройками
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={handleSupportClick}
        >
          <CardHeader className="pb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">Поддержка</CardTitle>
            <CardDescription className="text-sm">
              Чат с поддержкой
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={handleStaffClick}
        >
          <CardHeader className="pb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">Панель управления</CardTitle>
            <CardDescription className="text-sm">
              Доступ к админ панели
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {activeSection === 'orders' && (
        <div>
          <h2 className="text-xl font-bold mb-4">История заказов</h2>
          <div className="min-h-[500px]">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : ordersData?.data.results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                У вас пока нет заказов
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {ordersData?.data.results.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Всего заказов: {ordersData?.data.count}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || isLoading}
                      size="sm"
                    >
                      Предыдущая
                    </Button>
                    <span className="text-sm">
                      Страница {currentPage} из {ordersData?.data.count ? Math.ceil(ordersData.data.count / 2) : 1}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={!ordersData?.data.next || isLoading}
                      size="sm"
                    >
                      Следующая
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Настройки профиля</h2>
          <div className="bg-white rounded-lg shadow p-4">
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
