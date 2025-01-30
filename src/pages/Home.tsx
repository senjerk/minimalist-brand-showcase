import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, fetchCategories, fetchColors } from "@/services/api";
import { API_CONFIG } from "@/config/api";
import { Size, ProductResponse } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<Size | "">("");

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: colorsData } = useQuery({
    queryKey: ['colors'],
    queryFn: fetchColors,
  });

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, selectedColor, selectedSize],
    queryFn: ({ pageParam = 1 }) => fetchProducts({
      category: selectedCategory,
      color: selectedColor,
      size: selectedSize,
      page: String(pageParam),
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductResponse) => {
      if (lastPage.data.next) {
        const url = new URL(lastPage.data.next);
        const page = url.searchParams.get('page');
        return page ? parseInt(page) : undefined;
      }
      return undefined;
    },
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить товары");
      }
    }
  });

  const products = data?.pages.flatMap(page => page.data.results) || [];
  const hasMore = data?.pages[data.pages.length - 1]?.data.next !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Каталог вышивки
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Изысканные дизайны, созданные с вниманием к каждой детали
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Все категории</SelectItem>
              {categoriesData?.data.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Цвет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Все цвета</SelectItem>
              {colorsData?.data.map((color) => (
                <SelectItem key={color.id} value={color.name}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: color.color }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as Size)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Размер" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Все размеры</SelectItem>
              {SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={{
                    ...product,
                    image: `${API_CONFIG.baseURL}${product.image}`
                  }} 
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  size="lg"
                >
                  {isFetchingNextPage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  ) : (
                    "Загрузить еще"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;