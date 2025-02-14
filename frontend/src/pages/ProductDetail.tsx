
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { ProductDetailResponse, Garment } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Получаем уникальные категории, цвета и размеры
  const uniqueCategories = Array.from(new Set(product.garments.map(g => g.category.name)));
  const uniqueColors = Array.from(new Set(product.garments.map(g => g.color.name)));
  const uniqueSizes = Array.from(new Set(product.garments.map(g => g.size)));

  // Группируем гарменты по категориям для более удобного отображения
  const garmentsByCategory = product.garments.reduce((acc, garment) => {
    const categoryName = garment.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(garment);
    return acc;
  }, {} as Record<string, Garment[]>);

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
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          {/* Базовая цена товара */}
          <div className="text-2xl font-semibold text-gray-900">
            От {product.price.toLocaleString('ru-RU')} ₽
          </div>

          {/* Выбор категории, размера и цвета */}
          <div className="space-y-6">
            {/* Категории */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Категория</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      const firstGarmentInCategory = garmentsByCategory[category][0];
                      setSelectedGarment(firstGarmentInCategory);
                    }}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedGarment?.category.name === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Размеры */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Размер</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const garment = product.garments.find(
                        g => g.size === size && 
                        (selectedGarment ? g.category.name === selectedGarment.category.name : true)
                      );
                      if (garment) setSelectedGarment(garment);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedGarment?.size === size
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Цвета */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.map((colorName) => {
                  const garment = product.garments.find(g => g.color.name === colorName);
                  const colorCode = garment?.color.color || '#000000';
                  return (
                    <button
                      key={colorName}
                      onClick={() => {
                        const garment = product.garments.find(
                          g => g.color.name === colorName && 
                          (selectedGarment ? g.category.name === selectedGarment.category.name : true)
                        );
                        if (garment) setSelectedGarment(garment);
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedGarment?.color.name === colorName
                          ? 'ring-2 ring-offset-2 ring-gray-900'
                          : ''
                      }`}
                      style={{ backgroundColor: colorCode }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>

            {/* Информация о выбранном варианте */}
            {selectedGarment && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="font-medium">Выбрано:</p>
                <p>Категория: {selectedGarment.category.name}</p>
                <p>Размер: {selectedGarment.size}</p>
                <p>Цвет: {selectedGarment.color.name}</p>
                <p>Цена: {selectedGarment.price.toLocaleString('ru-RU')} ₽</p>
                <p>В наличии: {selectedGarment.count} шт.</p>
              </div>
            )}
          </div>

          <Button 
            onClick={handleAddToCart}
            disabled={!selectedGarment || selectedGarment.count === 0}
            className="w-full"
          >
            {selectedGarment?.count === 0 ? "Нет в наличии" : "Добавить в корзину"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
