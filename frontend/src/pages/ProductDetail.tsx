
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { ProductDetailResponse, Garment } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: productData, isLoading } = useQuery<ProductDetailResponse>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.productDetail(Number(id))}`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить товар");
      }
    }
  });

  const product = productData?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Товар не найден</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedGarment) {
      toast.error("Пожалуйста, выберите размер и цвет");
      return;
    }
    // Здесь будет логика добавления в корзину
    toast.success("Товар добавлен в корзину");
  };

  const getFullImageUrl = (path: string) => `${API_CONFIG.baseURL}${path}`;

  // Получаем уникальные цвета и размеры
  const uniqueColors = Array.from(new Set(product.garments.map(g => g.color.name)));
  const uniqueSizes = Array.from(new Set(product.garments.map(g => g.size)));

  // Функция для определения, является ли цвет тёмным
  const isColorDark = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Изображения */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={getFullImageUrl(selectedImage || product.main_image)}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedImage(product.main_image)}
              className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={getFullImageUrl(product.main_image)}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </button>
            {product.additional_images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img.image)}
                className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={getFullImageUrl(img.image)}
                  alt={`${product.name} - ${img.color.name}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-600">
            Удобная футболка из 100% хлопка высшего качества. Подходит для
            повседневной носки.
          </p>
          
          <div className="text-2xl font-bold text-gray-900">
            {selectedGarment ? selectedGarment.price : product.price} ₽
          </div>

          {/* Цвета */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Цвет</label>
            <div className="flex gap-4">
              {uniqueColors.map((colorName) => {
                const garment = product.garments.find(g => g.color.name === colorName);
                const colorCode = garment?.color.color || '#000000';
                return (
                  <div key={colorName} className="relative">
                    <button
                      onClick={() => {
                        const garment = product.garments.find(g => g.color.name === colorName);
                        if (garment) setSelectedGarment(garment);
                      }}
                      className={`w-12 h-12 rounded-full border-2 relative ${
                        selectedGarment?.color.name === colorName
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      } hover:ring-2 hover:ring-offset-2 hover:ring-gray-300`}
                      style={{ backgroundColor: colorCode }}
                    >
                      {selectedGarment?.color.name === colorName && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check 
                            className={`h-6 w-6 ${
                              isColorDark(colorCode) ? "text-white" : "text-black"
                            }`} 
                          />
                        </div>
                      )}
                    </button>
                    <span className="block text-xs text-center mt-1 text-gray-600">
                      {colorName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Размеры */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Размер</label>
            <div className="flex gap-2">
              {uniqueSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const garment = product.garments.find(g => g.size === size);
                    if (garment) setSelectedGarment(garment);
                  }}
                  className={`px-4 py-2 border rounded-md ${
                    selectedGarment?.size === size
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
          {selectedGarment && (
            <div className="text-sm">
              <span className="text-orange-500">В наличии:</span>{' '}
              <span className="text-gray-900">{selectedGarment.count} шт.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {}}
              className="flex-1"
            >
              В корзину
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedGarment || selectedGarment.count === 0}
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
