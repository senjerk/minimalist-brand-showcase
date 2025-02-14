import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_CONFIG } from "@/config/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { addCSRFToken } from "@/lib/csrf";
import { Loader2, ExternalLink } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

const checkoutSchema = z.object({
  fullName: z.string().min(2, {
    message: "ФИО должно содержать минимум 2 символа",
  }),
  phone: z.string().regex(/^\+7\d{10}$/, "Телефон должен быть в формате +7XXXXXXXXXX"),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  address: z.string().min(10, "Адрес должен содержать минимум 10 символов"),
  deliveryType: z.enum(["pickup", "courier"], {
    required_error: "Выберите способ доставки",
  }),
  comment: z.string().optional(),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "Необходимо принять условия" }),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      phone: "",
      fullName: "",
      address: "",
      deliveryType: "pickup",
      comment: "",
      privacyPolicy: false,
    },
  });

  const [phoneValue, setPhoneValue] = useState("+7 (___) ___-__-__");

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (value.length < phoneValue.length) {
      value = phoneValue.replace(/\d(?=\D*$)/, '_');
      setPhoneValue(value);
      const digits = value.replace(/\D/g, "");
      if (digits.length > 0) {
        form.setValue("phone", "+7" + digits);
      } else {
        form.setValue("phone", "");
      }
      return;
    }

    const digits = value.replace(/\D/g, "").slice(0, 10);
    
    if (digits.length === 0) {
      setPhoneValue("+7 (___) ___-__-__");
      form.setValue("phone", "");
      return;
    }

    let formattedPhone = "+7 (";
    for (let i = 0; i < 10; i++) {
      if (i < digits.length) {
        if (i === 3) formattedPhone += ") ";
        if (i === 6 || i === 8) formattedPhone += "-";
        formattedPhone += digits[i];
      } else {
        if (i === 3) formattedPhone += ") ";
        if (i === 6 || i === 8) formattedPhone += "-";
        formattedPhone += "_";
      }
    }

    setPhoneValue(formattedPhone);
    form.setValue("phone", "+7" + digits);
  };

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/core/task/${taskId}/`,
        {
          credentials: "include",
        }
      );
      
      const { message, data, errors } = await response.json();

      if (errors?.form_error === "У вас уже есть заказ в ожидании оплаты.") {
        toast.error(errors.form_error, {
          action: {
            label: "Перейти к заказу",
            onClick: () => navigate("/orders"),
          },
          duration: 10000,
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
            form.setError('address', { message: data.errors.address[0] });
          }
          if (data.errors.phone) {
            form.setError('phone', { message: data.errors.phone[0] });
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

  const onSubmit = async (values: CheckoutFormData) => {
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
          body: JSON.stringify({
            address: values.address,
            phone: values.phone,
          }),
        }
      );

      const responseData = await response.json();

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

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const finalPrice = totalPrice + deliveryPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Оформление заказа</h1>
      
      {loadingMessage && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>{loadingMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактное лицо (ФИО)*</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов Иван Иванович" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактный телефон*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+7 (___) ___-__-__"
                        value={phoneValue}
                        onChange={handlePhoneInput}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="example@mail.com" 
                        {...field}
                        disabled={isAuthenticated}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Будет использоваться как логин для просмотра статуса заказа
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Способ доставки*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pickup" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            До пункта выдачи СДЭК
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="courier" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Курьером СДЭК до двери
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        // Здесь будет открываться карта СДЭК
                      }}
                    >
                      Выбрать на карте
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес доставки*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Индекс, Город, улица, Дом, квартира"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий к заказу</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Дополнительная информация по заказу"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Согласен с{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          условиями оферты
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>{" "}
                        и{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          политикой конфиденциальности
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

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
                  "Подтвердить заказ"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Ваш заказ</h2>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-background p-4 rounded-md space-y-2"
                  >
                    <div className="aspect-square w-20 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-muted-foreground">
                          Размер: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-muted-foreground">
                          Цвет: {item.color}
                        </p>
                      )}
                      <p className="text-sm">
                        {item.price.toLocaleString("ru-RU")} ₽ × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Товары:</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span>{deliveryPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Итого:</span>
                <span>{finalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
