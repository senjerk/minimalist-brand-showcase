
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Size } from "@/types/api";
import { Check, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "@/components/ProductCard";

interface ProductDetailProps {}

const ProductDetail = ({}: ProductDetailProps) => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const isMobile = useIsMobile();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const productData = {
    id: "1",
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

  // Placeholder similar products data with number IDs
  const similarProducts = [
    {
      id: 2,
      name: "Футболка с принтом",
      price: 3499,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    },
    {
      id: 3,
      name: "Базовая футболка",
      price: 2499,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    },
    {
      id: 4,
      name: "Спортивная футболка",
      price: 3999,
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
    },
    {
      id: 5,
      name: "Футболка с логотипом",
      price: 2799,
      image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937"
    }
  ];

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

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
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
            <div className="flex gap-4">
              {productData.colors.map((color) => (
                <div key={color.id} className="relative">
                  <button
                    onClick={() => !color.disabled && setSelectedColor(color.name)}
                    disabled={color.disabled}
                    className={`w-12 h-12 rounded-full border-2 relative ${
                      selectedColor === color.name
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    } ${color.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"}`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-6 w-6 text-black" />
                      </div>
                    )}
                    {color.disabled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <X className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                  </button>
                  <span className="block text-xs text-center mt-1 text-gray-600">
                    {color.name}
                  </span>
                </div>
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

      {/* Similar Products Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Похожие товары</h2>
        {isMobile ? (
          <div className="relative">
            <Carousel 
              className="w-full" 
              opts={{
                align: "start",
                containScroll: false,
                dragFree: true
              }}
            >
              <CarouselContent className="-ml-4">
                {similarProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 basis-4/5">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Dots navigation */}
              <div className="flex justify-center gap-2 mt-4">
                {similarProducts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? "bg-primary" : "bg-gray-300"
                    }`}
                    onClick={() => {
                      setCurrentSlide(index);
                      const api = (document.querySelector('[data-embla-api]') as any)?.__embla;
                      api?.scrollTo(index);
                    }}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

