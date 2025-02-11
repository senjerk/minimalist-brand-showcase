
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Size } from "@/types/api";

interface ProductDetailProps {}

const ProductDetail = ({}: ProductDetailProps) => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  // Placeholder data
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const productData = {
    id: id || "1",
    name: "Классическая футболка",
    description: "Удобная футболка из 100% хлопка высшего качества. Подходит для повседневной носки.",
    price: 2999,
    stock: 5,
    colors: [
      { id: 1, name: "Белый", color: "#FFFFFF", disabled: false },
      { id: 2, name: "Черный", color: "#000000", disabled: false },
      { id: 3, name: "Синий", color: "#0000FF", disabled: true },
    ],
    sizes: ["S", "M", "L", "XL"] as Size[],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800"
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      });
      return;
    }
    
    addItem({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
    });
    
    toast({
      title: "Успешно",
      description: "Товар добавлен в корзину",
    });
  };

  const isLowStock = productData.stock > 0 && productData.stock < 10;
  const isOutOfStock = productData.stock === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={productData.image}
            alt={productData.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
          <p className="text-lg text-gray-600">{productData.description}</p>
          
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            {productData.price.toLocaleString('ru-RU')} ₽
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Цвет</label>
            <div className="flex gap-2">
              {productData.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => !color.disabled && setSelectedColor(color.name)}
                  disabled={color.disabled}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  } ${color.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Размер</label>
            <div className="flex gap-2">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className={`text-sm ${
            isLowStock ? "text-orange-500" : 
            isOutOfStock ? "text-gray-500" : 
            "text-gray-600"
          }`}>
            {isOutOfStock 
              ? "Товара нет на складе" 
              : `В наличии: ${productData.stock} шт.`
            }
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
            <Button
              disabled={isOutOfStock}
              className="flex-1"
            >
              Купить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
