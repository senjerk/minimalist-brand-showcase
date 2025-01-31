import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending_payment: { color: "bg-orange-500", label: "Ожидание оплаты" },
  awaiting_confirmation: { color: "bg-yellow-500", label: "Ожидание подтверждения" },
  processing: { color: "bg-blue-500", label: "В обработке" },
  shipping: { color: "bg-green-300", label: "Доставляется" },
  delivered: { color: "bg-green-500", label: "Доставлен" },
  cancelled: { color: "bg-red-500", label: "Отменён" },
};

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyTrackingCode = async () => {
    if (order.trackingCode) {
      await navigator.clipboard.writeText(order.trackingCode);
      setIsCopied(true);
      toast.success("Трек-код скопирован");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute left-0 top-0 w-2 h-full",
          statusConfig[order.status].color
        )}
      />
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{statusConfig[order.status].label}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Информация о заказчике:</h4>
          <p>{order.customer.name}</p>
          <p>{order.customer.phone}</p>
          <p className="text-sm text-muted-foreground">{order.customer.address}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Состав заказа:</h4>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {item.price.toLocaleString("ru-RU")} ₽
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <p className="text-lg font-bold">
              Итого: {order.totalAmount.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {order.status === "pending_payment" && (
          <Button 
            variant="default"
            size="lg"
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold px-8"
          >
            Оплатить
          </Button>
        )}
        {order.status === "shipping" && order.trackingCode && (
          <Button
            variant="outline"
            size="lg"
            onClick={copyTrackingCode}
            className="min-w-[200px] bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white border-none"
          >
            {isCopied ? "Скопировано!" : `Трек-код: ${order.trackingCode}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;