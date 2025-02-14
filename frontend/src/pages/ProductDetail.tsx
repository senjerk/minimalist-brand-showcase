
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { ProductDetailResponse, Garment } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const uniqueSizes = Array.from(new Set(product.garments.map(g => g.size)));
  const uniqueColors = Array.from(new Set(product.garments.map(g => g.color.name)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600">
              Удобная футболка из 100% хлопка высшего качества. Подходит для
              повседневной носки.
            </p>
          </div>

          <div className="text-3xl font-bold">
            {selectedGarment ? selectedGarment.price : product.price} ₽
          </div>

          <div className="space-y-6">
            {/* Цвета */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Цвет</h3>
              <div className="flex gap-3">
                {uniqueColors.map((colorName) => {
                  const garment = product.garments.find(g => g.color.name === colorName);
                  const colorCode = garment?.color.color || '#000000';
                  return (
                    <button
                      key={colorName}
                      onClick={() => {
                        const garment = product.garments.find(g => g.color.name === colorName);
                        if (garment) setSelectedGarment(garment);
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedGarment?.color.name === colorName
                          ? 'border-purple-600 ring-2 ring-purple-200'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorCode }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>

            {/* Размеры */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Размер</h3>
              <div className="flex gap-3">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const garment = product.garments.find(g => g.size === size);
                      if (garment) setSelectedGarment(garment);
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${
                      selectedGarment?.size === size
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedGarment && (
              <div className="text-sm text-green-600">
                В наличии: {selectedGarment.count} шт.
              </div>
            )}

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
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Купить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
