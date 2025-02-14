import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { addCSRFToken } from "@/lib/csrf";
import { Loader2 } from "lucide-react";

// Схема валидации
const checkoutSchema = z.object({
  address: z.string().min(10, "Адрес должен содержать минимум 10 символов"),
  phone: z.string().regex(
    /^\+7\d{10}$/,
    "Телефон должен быть в формате +7XXXXXXXXXX"
  ),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Функция для проверки статуса задачи
  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/core/task/${taskId}/`,
        {
          credentials: "include",
        }
      );
      
      const { message, data, errors } = await response.json();

      // Обработка ошибки о существующем заказе
      if (errors?.form_error === "У вас уже есть заказ в ожидании оплаты.") {
        toast.error(errors.form_error, {
          action: {
            label: "Перейти к заказу",
            onClick: () => navigate("/orders"),
          },
          duration: 10000, // Увеличиваем время показа уведомления до 10 секунд
        });
        return true;
      }

      if (message === 'Задача еще не выполнена') {
        return false;
      }

      if (data?.order_id) {
        clearCart();
        navigate(`/orders/${data.order_id}`);
        return true;
      }

      if (data?.errors) {
        if (data.errors.form_error) {
          toast.error(data.errors.form_error);
        } else {
          if (data.errors.address) {
            setFormError('address', { message: data.errors.address[0] });
          }
          if (data.errors.phone) {
            setFormError('phone', { message: data.errors.phone[0] });
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking task status:', error);
      toast.error("Ошибка при проверке статуса заказа");
      return true;
    }
  };

  // Функция для периодической проверки статуса
  const pollTaskStatus = async (taskId: string) => {
    let attempts = 0;
    const maxAttempts = 30;
    const interval = 2000;

    while (attempts < maxAttempts) {
      const isCompleted = await checkTaskStatus(taskId);
      if (isCompleted) return;
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    toast.error("Превышено время ожидания создания заказа");
    setIsLoading(false);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Пожалуйста, подождите. Мы создаем ваш заказ и подготавливаем платежную информацию...");

    try {
      const headers = await addCSRFToken();

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      // Добавляем проверку на ошибку о существующем заказе
      if (responseData.errors?.form_error === "У вас уже есть заказ в ожидании оплаты.") {
        toast.error(responseData.errors.form_error, {
          action: {
            label: "Перейти к заказу",
            onClick: () => navigate("/orders"),
          },
          duration: 10000,
        });
        return;
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create order");
      }

      if (responseData.data.task_id) {
        setLoadingMessage("Проверяем статус заказа...");
        await pollTaskStatus(responseData.data.task_id);
      } else {
        throw new Error("No task ID received");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Не удалось создать заказ");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>

        {loadingMessage && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>{loadingMessage}</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Ваш заказ</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} ({item.color}, {item.size}) x {item.quantity}
                </span>
                <span>{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Итого:</span>
              <span>{totalPrice} ₽</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("phone")}
              placeholder="Телефон (+7XXXXXXXXXX)"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("address")}
              placeholder="Адрес доставки"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : (
              "Оформить заказ"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
