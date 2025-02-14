import { useCart, CartItem as CartItemType } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.color}, {item.size}
        </p>
        <p className="font-medium">{item.price} ₽</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => removeItem(item.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}; 