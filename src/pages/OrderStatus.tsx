import { useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Order } from "@/types/order";

// Демо-данные для примера
const DEMO_ORDERS: Order[] = [
  {
    id: "ORD001",
    status: "pending_payment",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
    totalAmount: 2500,
    customer: {
      name: "Иван Иванов",
      phone: "+7 (999) 123-45-67",
      address: "ул. Пушкина, д. 1, кв. 1, г. Москва",
    },
    items: [
      {
        id: "ITEM001",
        name: "Вышивка 'Цветы'",
        quantity: 1,
        price: 2500,
      },
    ],
  },
  {
    id: "ORD002",
    status: "shipping",
    createdAt: "2024-03-19T15:30:00Z",
    updatedAt: "2024-03-20T09:00:00Z",
    totalAmount: 3800,
    trackingCode: "TRACK123456",
    customer: {
      name: "Мария Петрова",
      phone: "+7 (999) 765-43-21",
      address: "ул. Лермонтова, д. 2, кв. 2, г. Санкт-Петербург",
    },
    items: [
      {
        id: "ITEM002",
        name: "Вышивка 'Пейзаж'",
        quantity: 1,
        price: 3800,
      },
    ],
  },
  {
    id: "ORD003",
    status: "delivered",
    createdAt: "2024-03-18T12:00:00Z",
    updatedAt: "2024-03-20T14:00:00Z",
    totalAmount: 5600,
    trackingCode: "TRACK789012",
    customer: {
      name: "Анна Сидорова",
      phone: "+7 (999) 111-22-33",
      address: "ул. Гоголя, д. 3, кв. 3, г. Казань",
    },
    items: [
      {
        id: "ITEM003",
        name: "Вышивка 'Портрет'",
        quantity: 2,
        price: 2800,
      },
    ],
  },
];

const OrderStatus = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Статус заказов
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Отслеживайте статус ваших заказов
          </p>
        </div>

        <div className="grid gap-6">
          {DEMO_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;