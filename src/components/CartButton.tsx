import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

const CartButton = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  const handleCheckout = () => {
    toast.success("Переход к оформлению заказа");
    // Here you would typically navigate to the checkout page
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Корзина пуста
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toLocaleString("ru-RU")} ₽
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <div className="mt-4 space-y-4">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Итого:</span>
                <span className="font-medium">
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Оформить заказ
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;