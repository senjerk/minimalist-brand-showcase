
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  isDetailed?: boolean;
  onStatusChange?: (status: OrderStatus) => void;
  onStartChat?: () => void;
}

const OrderCard = ({ order, isDetailed, onStatusChange, onStartChat }: OrderCardProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
      toast.success("Статус заказа обновлен");
    } catch (error) {
      toast.error("Не удалось обновить статус заказа");
      setStatus(order.status);
    }
  };

  const displayItems = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute left-0 top-0 w-2 h-full",
          statusConfig[status].color
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
            {isDetailed ? (
              <Select defaultValue={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Статус заказа" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-semibold">{statusConfig[status].label}</p>
            )}
            <p className="text-lg font-bold mt-2">
              {order.totalAmount.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDetailed && (
          <div className="space-y-2">
            <h4 className="font-medium">Информация о заказчике:</h4>
            <p>{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            <p className="text-sm text-muted-foreground">{order.customer.address}</p>
          </div>
        )}
        <div>
          <h4 className="font-medium mb-2">Состав заказа:</h4>
          <ul className="space-y-2">
            {displayItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name}
                  {(item.color || item.size) && (
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      ({[item.color, item.size].filter(Boolean).join(", ")})
                    </span>
                  )}
                  {" × "}{item.quantity}
                </span>
                <span className="font-medium">
                  {item.price.toLocaleString("ru-RU")} ₽
                </span>
              </li>
            ))}
            {remainingItems > 0 && (
              <li className="text-sm text-muted-foreground">
                И ещё {remainingItems} {remainingItems === 1 ? "позиция" : "позиции"}
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!isDetailed && (
          <Button 
            variant="outline"
            onClick={() => navigate(`/staff/orders/${order.id}`)}
          >
            Управление заказом
          </Button>
        )}
        {isDetailed && onStartChat && (
          <Button 
            variant="secondary"
            onClick={onStartChat}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Начать чат
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
