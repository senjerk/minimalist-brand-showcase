import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import OrderCard from "@/components/OrderCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderStatus } from "@/types/order";

// Временно используем моковые данные из StaffOrders
import { mockOrders } from "./StaffOrders";

const StaffOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetch(`https://5.35.80.52/api/staff/orders/${id}/`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки заказа');
      }
      return response.json();
    }
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      // В реальном приложении здесь будет API запрос
      toast.success("Статус заказа успешно обновлен");
    } catch (error) {
      toast.error("Не удалось обновить статус заказа");
    }
  };

  const handleStartChat = () => {
    if (order) {
      // В реальном приложении здесь будет создание чата
      navigate(`/staff/chats?order=${order.id}`);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    try {
      // В реальном приложении здесь будет API запрос
      toast.success("Комментарий добавлен");
      setNewComment("");
    } catch (error) {
      toast.error("Не удалось добавить комментарий");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Заказ не найден</h1>
        <Button onClick={() => navigate("/staff/orders")}>
          Вернуться к списку заказов
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/staff/orders")}
        >
          ← Вернуться к списку заказов
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div>
          <OrderCard
            order={order}
            isDetailed
            onStatusChange={handleStatusChange}
            onStartChat={handleStartChat}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-background border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Комментарии</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {order.comments?.map((comment, index) => (
                  <div
                    key={index}
                    className="bg-muted p-3 rounded-lg text-sm"
                  >
                    {comment}
                  </div>
                ))}
                {(!order.comments || order.comments.length === 0) && (
                  <p className="text-muted-foreground text-sm text-center">
                    Пока нет комментариев
                  </p>
                )}
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Добавить комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOrderDetail;
