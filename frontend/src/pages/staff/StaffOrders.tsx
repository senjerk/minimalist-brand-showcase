import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import OrderCard from "@/components/OrderCard";
import { Order, OrderStatus } from "@/types/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const statusConfig: Record<OrderStatus, { label: string }> = {
  WP: { label: "Ожидает оплаты" },
  PD: { label: "Оплачен" },
  IW: { label: "В работе" },
  DR: { label: "Готов к отправке" },
  ID: { label: "В доставке" },
  DV: { label: "Доставлен" },
  CN: { label: "Отменён" },
};

interface ApiResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
      id: number;
      status: {
        status: OrderStatus;
        status_display: string;
      };
      address: string;
      total_sum: number;
      items: Array<{
        id: number;
        product: {
          id: number;
          name: string;
          main_image: string;
          secondary_image: string;
          price: number;
        };
        garment: {
          id: number;
          category: {
            id: number;
            name: string;
          };
          color: {
            id: number;
            name: string;
            color: string;
          };
          size: string;
          count: number;
          price: number;
        };
        quantity: number;
        price: number;
        total_price: number;
      }>;
    }>;
  };
  message: string;
}

const StaffOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "_all">("_all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery<ApiResponse>({
    queryKey: ['staff-orders', selectedStatus, currentPage],
    queryFn: async () => {
      const statusParam = selectedStatus !== "_all" ? `status=${selectedStatus}` : '';
      const response = await fetch(
        `https://5.35.80.52/api/staff/orders/?page=${currentPage}${statusParam ? '&' + statusParam : ''}`
      );
      if (!response.ok) {
        throw new Error('Ошибка загрузки заказов');
      }
      return response.json();
    }
  });

  if (isLoading || !ordersData?.data?.results) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(ordersData.data.count / 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Управление заказами</h1>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Все заказы</SelectItem>
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {ordersData.data.results.map((order) => (
            <OrderCard 
              key={order.id} 
              order={{
                id: order.id.toString(),
                status: order.status,
                totalAmount: order.total_sum,
                items: order.items.map(item => ({
                  id: item.id.toString(),
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.product.main_image,
                  color: item.garment.color.name,
                  size: item.garment.size
                }))
              }} 
            />
          ))}
          {ordersData.data.results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Заказы не найдены
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Назад
            </Button>
            <span className="py-2 px-4">
              Страница {currentPage} из {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Вперед
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffOrders;
