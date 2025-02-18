
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

const statusConfig: Record<OrderStatus, { label: string }> = {
  pending_payment: { label: "Ожидание оплаты" },
  awaiting_confirmation: { label: "Ожидание подтверждения" },
  processing: { label: "В обработке" },
  shipping: { label: "Доставляется" },
  delivered: { label: "Доставлен" },
  cancelled: { label: "Отменён" },
};

// Временные моковые данные
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    status: "processing",
    createdAt: "2024-02-13T10:00:00",
    updatedAt: "2024-02-13T10:00:00",
    totalAmount: 15990,
    customer: {
      name: "Иван Иванов",
      phone: "+7 (999) 123-45-67",
      address: "г. Москва, ул. Пушкина, д. 1"
    },
    items: [
      {
        id: "ITEM-001",
        name: "Футболка",
        quantity: 2,
        price: 1990,
        color: "Белый",
        size: "L"
      },
      {
        id: "ITEM-002",
        name: "Джинсы",
        quantity: 1,
        price: 4990,
        color: "Синий",
        size: "32"
      }
    ]
  },
  {
    id: "ORD-002",
    status: "pending_payment",
    createdAt: "2024-02-13T11:00:00",
    updatedAt: "2024-02-13T11:00:00",
    totalAmount: 23970,
    customer: {
      name: "Мария Петрова",
      phone: "+7 (999) 765-43-21",
      address: "г. Санкт-Петербург, пр. Невский, д. 100"
    },
    items: [
      {
        id: "ITEM-003",
        name: "Куртка",
        quantity: 1,
        price: 12990,
        color: "Черный",
        size: "M"
      },
      {
        id: "ITEM-004",
        name: "Шапка",
        quantity: 2,
        price: 1990,
        color: "Серый"
      },
      {
        id: "ITEM-005",
        name: "Перчатки",
        quantity: 1,
        price: 990,
        color: "Черный",
        size: "L"
      }
    ]
  }
];

const StaffOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("_all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // В реальном приложении здесь будет API запрос
      return mockOrders;
    }
  });

  const filteredOrders = orders?.filter(order => 
    selectedStatus === "_all" || order.status === selectedStatus
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

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
          {filteredOrders?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {filteredOrders?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Заказы не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;
