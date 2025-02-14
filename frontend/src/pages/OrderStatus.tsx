import { useState, useEffect } from 'react';
import { addCSRFToken } from '@/lib/csrf';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { APIResponse, PaginatedResponse } from '@/types/api';

const API_BASE_URL = 'http://localhost:8000';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  size: string;
  category: string;
  color: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  status_display: string;
  payment_status: string;
  payment_status_display: string;
  address: string;
  items: OrderItem[];
  total_sum: number;
}

interface OrdersResponse extends APIResponse<PaginatedResponse<Order>> {}

const OrderStatus = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(
        `${API_BASE_URL}/api/catalog/orders/?page=${page}`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Ошибка при загрузке заказов');

      const responseData = await response.json();
      
      if (responseData.data) {
        setOrders(prev => [...prev, ...responseData.data.results]);
        setTotalCount(responseData.data.count);
        setHasMore(!!responseData.data.next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке заказов');
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить историю заказов",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(`${API_BASE_URL}/api/catalog/orders/${orderId}/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ status: 'CN' }),
      });

      if (!response.ok) throw new Error('Ошибка при отмене заказа');

      const responseData = await response.json();
      
      if (responseData.message) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: 'CN', status_display: 'Отменён' }
              : order
          )
        );

        toast({
          title: "Успешно",
          description: responseData.message || "Заказ успешно отменен",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отменить заказ",
      });
    }
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-[125px] w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">История заказов</h1>
        <p className="text-muted-foreground">Всего заказов: {totalCount}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">У вас пока нет заказов</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Заказ №{order.id}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant={order.status === 'CN' ? 'destructive' : 'default'}>
                    {order.status_display}
                  </Badge>
                  <Badge variant="secondary">{order.payment_status_display}</Badge>
                  {order.status === 'WP' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Отменить заказ
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-sm">
                <span className="font-medium">Адрес доставки: </span>
                {order.address}
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            Нет фото
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{item.size}</Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Количество: {item.quantity}
                          </div>
                          <div className="text-sm">
                            {item.price} ₽ × {item.quantity} = {item.total_price} ₽
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex justify-end">
                <p className="text-lg font-semibold">
                  Итого: {order.total_sum} ₽
                </p>
              </div>
            </div>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Загрузить еще'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;