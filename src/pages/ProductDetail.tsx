
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Size } from "@/types/api";
import { Check, X } from "lucide-react";
import { fetchProduct } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast: showToast } = useToast();
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить товар");
      }
    }
  });

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      showToast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      });
      return;
    }

    if (!productData?.data) return;
    
    addItem({
      id: String(productData.data.id),
      name: productData.data.name,
      price: productData.data.price,
      image: productData.data.main_image,
      main_image: productData.data.main_image,
      secondary_image: productData.data.secondary_image,
    });
    
    showToast({
      title: "Успешно",
      description: "Товар добавлен в корзину",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Товар не найден</h1>
      </div>
    );
  }

  const product = productData.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.main_image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            {product.price.toLocaleString('ru-RU')} ₽
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1"
            >
              В корзину
            </Button>
            <Button className="flex-1">
              Купить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
