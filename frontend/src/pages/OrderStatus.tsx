import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { Order } from "@/types/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

const OrderStatus = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  // Проверяем параметры успешной оплаты
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      clearCart();
      toast.success("Заказ успешно оплачен!");
    }
  }, [searchParams, clearCart]);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orderDetail(Number(id))}`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return response.json();
    },
    enabled: !!id,
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить информацию о заказе");
      }
    }
  });

  const order = orderData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Заказ не найден</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Заказ #{order.id}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Статус заказа</h2>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-600">
              {order.status.status_display}
            </span>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Детали доставки</h2>
            <p className="text-gray-600">{order.address}</p>
            <p className="text-gray-600">{order.phone}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Товары</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} ({item.garment.color.name}, {item.garment.size}) x {item.quantity}
                  </span>
                  <span>{item.total_price} ₽</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Итого:</span>
              <span className="font-semibold">{order.total_sum} ₽</span>
            </div>
          </div>

          {order.status.status === 'WP' && order.confirmation_url && (
            <div className="flex justify-center">
              <Button
                onClick={() => window.location.href = order.confirmation_url!}
                className="bg-green-600 hover:bg-green-700"
              >
                Оплатить заказ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;