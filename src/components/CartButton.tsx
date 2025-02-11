
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CartButton() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className={isMobile ? "w-full" : undefined}>
        <div className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Корзина</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
            <ScrollArea className="flex-1">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-4" />
                  <p>Ваша корзина пуста</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.color}-${item.size}`}
                      className="flex gap-4 items-start py-4 border-b"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.color && <p>Цвет: {item.color}</p>}
                          {item.size && <p>Размер: {item.size}</p>}
                          <p>Цена: {item.price.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
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
          </div>

          {items.length > 0 && (
            <div className="py-4 mt-auto border-t">
              <div className="flex justify-between text-lg font-medium mb-4">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/checkout">
                  Перейти к оформлению
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
