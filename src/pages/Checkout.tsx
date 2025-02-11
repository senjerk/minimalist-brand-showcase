
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "ФИО должно содержать минимум 2 символа",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "Введите корректный номер телефона",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  deliveryType: z.enum(["pickup", "courier"], {
    required_error: "Выберите способ доставки",
  }),
  address: z.string().optional(),
  comment: z.string().optional(),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "Необходимо принять условия" }),
  }),
});

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      phone: "",
      fullName: "",
      deliveryType: "pickup",
      address: "",
      comment: "",
      privacyPolicy: false,
    },
  });

  const [phoneValue, setPhoneValue] = useState("+7 (___) ___-__-__");

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    
    let formattedValue = "+7 (___) ___-__-__";
    let pos = 0;
    
    const result = formattedValue.split("").map(char => {
      if (char === "_" && pos < value.length) {
        return value[pos++];
      }
      return char;
    }).join("");
    
    setPhoneValue(result);
    form.setValue("phone", result);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Здесь будет интеграция с платежной системой
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const finalPrice = totalPrice + deliveryPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Оформление заказа</h1>
      
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
                        {...field}
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

              {form.watch("deliveryType") === "courier" && (
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
              )}

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

              <Button type="submit" className="w-full">
                Подтвердить заказ
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
