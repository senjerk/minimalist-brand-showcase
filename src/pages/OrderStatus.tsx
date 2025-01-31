import { useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Order } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  {
    id: "ORD004",
    status: "awaiting_confirmation",
    createdAt: "2024-03-17T09:15:00Z",
    updatedAt: "2024-03-17T09:15:00Z",
    totalAmount: 4200,
    customer: {
      name: "Петр Смирнов",
      phone: "+7 (999) 444-55-66",
      address: "пр. Ленина, д. 10, кв. 5, г. Екатеринбург",
    },
    items: [
      {
        id: "ITEM004",
        name: "Вышивка 'Горы'",
        quantity: 1,
        price: 4200,
      },
    ],
  },
  {
    id: "ORD005",
    status: "processing",
    createdAt: "2024-03-16T16:45:00Z",
    updatedAt: "2024-03-16T16:45:00Z",
    totalAmount: 3100,
    customer: {
      name: "Елена Козлова",
      phone: "+7 (999) 777-88-99",
      address: "ул. Кирова, д. 15, кв. 8, г. Новосибирск",
    },
    items: [
      {
        id: "ITEM005",
        name: "Вышивка 'Море'",
        quantity: 1,
        price: 3100,
      },
    ],
  },
  {
    id: "ORD006",
    status: "cancelled",
    createdAt: "2024-03-15T11:30:00Z",
    updatedAt: "2024-03-15T14:30:00Z",
    totalAmount: 2900,
    customer: {
      name: "Дмитрий Волков",
      phone: "+7 (999) 222-33-44",
      address: "ул. Мира, д. 20, кв. 12, г. Краснодар",
    },
    items: [
      {
        id: "ITEM006",
        name: "Вышивка 'Закат'",
        quantity: 1,
        price: 2900,
      },
    ],
  },
  {
    id: "ORD007",
    status: "pending_payment",
    createdAt: "2024-03-14T13:20:00Z",
    updatedAt: "2024-03-14T13:20:00Z",
    totalAmount: 4800,
    customer: {
      name: "Ольга Морозова",
      phone: "+7 (999) 555-66-77",
      address: "пр. Победы, д. 25, кв. 15, г. Самара",
    },
    items: [
      {
        id: "ITEM007",
        name: "Вышивка 'Лес'",
        quantity: 2,
        price: 2400,
      },
    ],
  },
  {
    id: "ORD008",
    status: "shipping",
    createdAt: "2024-03-13T10:10:00Z",
    updatedAt: "2024-03-14T15:30:00Z",
    totalAmount: 3500,
    trackingCode: "TRACK345678",
    customer: {
      name: "Сергей Попов",
      phone: "+7 (999) 888-99-00",
      address: "ул. Гагарина, д. 30, кв. 18, г. Омск",
    },
    items: [
      {
        id: "ITEM008",
        name: "Вышивка 'Река'",
        quantity: 1,
        price: 3500,
      },
    ],
  },
  {
    id: "ORD009",
    status: "delivered",
    createdAt: "2024-03-12T14:40:00Z",
    updatedAt: "2024-03-14T12:00:00Z",
    totalAmount: 5200,
    trackingCode: "TRACK901234",
    customer: {
      name: "Наталья Соколова",
      phone: "+7 (999) 333-44-55",
      address: "ул. Ленина, д. 35, кв. 21, г. Челябинск",
    },
    items: [
      {
        id: "ITEM009",
        name: "Вышивка 'Горизонт'",
        quantity: 2,
        price: 2600,
      },
    ],
  },
  {
    id: "ORD010",
    status: "awaiting_confirmation",
    createdAt: "2024-03-11T09:50:00Z",
    updatedAt: "2024-03-11T09:50:00Z",
    totalAmount: 3900,
    customer: {
      name: "Андрей Новиков",
      phone: "+7 (999) 666-77-88",
      address: "пр. Мира, д. 40, кв. 24, г. Ростов-на-Дону",
    },
    items: [
      {
        id: "ITEM010",
        name: "Вышивка 'Звезды'",
        quantity: 1,
        price: 3900,
      },
    ],
  },
  {
    id: "ORD011",
    status: "processing",
    createdAt: "2024-03-10T15:15:00Z",
    updatedAt: "2024-03-10T15:15:00Z",
    totalAmount: 4100,
    customer: {
      name: "Татьяна Федорова",
      phone: "+7 (999) 111-22-33",
      address: "ул. Советская, д. 45, кв. 27, г. Уфа",
    },
    items: [
      {
        id: "ITEM011",
        name: "Вышивка 'Рассвет'",
        quantity: 1,
        price: 4100,
      },
    ],
  },
  {
    id: "ORD012",
    status: "cancelled",
    createdAt: "2024-03-09T11:25:00Z",
    updatedAt: "2024-03-09T14:25:00Z",
    totalAmount: 3300,
    customer: {
      name: "Игорь Михайлов",
      phone: "+7 (999) 444-55-66",
      address: "пр. Ленина, д. 50, кв. 30, г. Волгоград",
    },
    items: [
      {
        id: "ITEM012",
        name: "Вышивка 'Поле'",
        quantity: 1,
        price: 3300,
      },
    ],
  },
  {
    id: "ORD013",
    status: "pending_payment",
    createdAt: "2024-03-08T13:35:00Z",
    updatedAt: "2024-03-08T13:35:00Z",
    totalAmount: 4500,
    customer: {
      name: "Марина Кузнецова",
      phone: "+7 (999) 777-88-99",
      address: "ул. Пушкина, д. 55, кв. 33, г. Пермь",
    },
    items: [
      {
        id: "ITEM013",
        name: "Вышивка 'Облака'",
        quantity: 1,
        price: 4500,
      },
    ],
  },
  {
    id: "ORD014",
    status: "shipping",
    createdAt: "2024-03-07T10:45:00Z",
    updatedAt: "2024-03-08T15:45:00Z",
    totalAmount: 3700,
    trackingCode: "TRACK567890",
    customer: {
      name: "Алексей Васильев",
      phone: "+7 (999) 222-33-44",
      address: "пр. Гагарина, д. 60, кв. 36, г. Красноярск",
    },
    items: [
      {
        id: "ITEM014",
        name: "Вышивка 'Дождь'",
        quantity: 1,
        price: 3700,
      },
    ],
  },
  {
    id: "ORD015",
    status: "delivered",
    createdAt: "2024-03-06T14:55:00Z",
    updatedAt: "2024-03-08T12:55:00Z",
    totalAmount: 5000,
    trackingCode: "TRACK123789",
    customer: {
      name: "Евгения Павлова",
      phone: "+7 (999) 555-66-77",
      address: "ул. Мира, д. 65, кв. 39, г. Воронеж",
    },
    items: [
      {
        id: "ITEM015",
        name: "Вышивка 'Солнце'",
        quantity: 2,
        price: 2500,
      },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

const OrderStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(DEMO_ORDERS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = DEMO_ORDERS.slice(startIndex, endIndex);

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
          {currentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;