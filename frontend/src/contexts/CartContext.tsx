import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG } from '@/config/api';
import { CartResponse } from '@/types/api';
import { toast } from 'sonner';
import { addCSRFToken } from '@/lib/csrf';

export interface CartItem {
  id: string;  // составной id: `${product.id}-${garment.id}`
  cartItemId: number;  // id записи в корзине
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loadCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.cart.get}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const responseData = await response.json() as CartResponse;
        
        const cartItems = responseData.data.items.map((item) => ({
          id: `${item.product.id}-${item.garment.id}`,
          cartItemId: item.id,
          name: item.product.name,
          price: item.garment.price,
          quantity: item.quantity,
          image: `${API_CONFIG.baseURL}${item.product.main_image}`,
          color: item.garment.color.name,
          size: item.garment.size,
        }));

        setItems(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    fetchCart();
  }, []);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      // Получаем cart_item_id из составного id (product_id-garment_id)
      const [productId, garmentId] = id.split('-');
      
      // Находим cart_item_id по product_id и garment_id
      const cartItem = items.find(item => item.id === id);
      if (!cartItem) return;

      const headers = await addCSRFToken();

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.cart.update(Number(cartItem.cartItemId))}`,
        {
          method: 'PATCH',
          headers,
          credentials: 'include',
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      // Обновляем локальное состояние только после успешного запроса
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error("Не удалось обновить количество товара");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const cartItem = items.find(item => item.id === id);
      if (!cartItem) return;

      const headers = await addCSRFToken();

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.cart.update(Number(cartItem.cartItemId))}`,
        {
          method: 'DELETE',
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      // Обновляем локальное состояние только после успешного запроса
      setItems(currentItems => currentItems.filter(item => item.id !== id));
      toast.success("Товар удален из корзины");
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error("Не удалось удалить товар из корзины");
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const loadCart = (cartItems: CartItem[]) => {
    setItems(cartItems);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
