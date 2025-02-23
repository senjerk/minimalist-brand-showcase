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

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  WP: { label: "Ожидает оплаты", color: "text-yellow-600 bg-yellow-50" },
  PD: { label: "Оплачен", color: "text-blue-600 bg-blue-50" },
  IW: { label: "В работе", color: "text-purple-600 bg-purple-50" },
  DR: { label: "Готов к отправке", color: "text-indigo-600 bg-indigo-50" },
  ID: { label: "В доставке", color: "text-orange-600 bg-orange-50" },
  DV: { label: "Доставлен", color: "text-green-600 bg-green-50" },
  CN: { label: "Отменён", color: "text-red-600 bg-red-50" },
};

interface OrderCardProps {
  order: Order;
  isDetailed?: boolean;
  onStatusChange?: (status: OrderStatus) => void;
  onStartChat?: () => void;
}

const OrderCard = ({ order, isDetailed, onStatusChange, onStartChat }: OrderCardProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>(order.status.status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
      toast.success("Статус заказа обновлен");
    } catch (error) {
      toast.error("Не удалось обновить статус заказа");
      setStatus(order.status.status);
    }
  };

  const displayItems = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  const amount = order.totalAmount || order.total_sum;

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
              {amount?.toLocaleString("ru-RU")} ₽
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
