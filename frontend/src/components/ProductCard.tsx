import { motion } from "framer-motion";
import { Product } from "@/types/api";
import { useState } from "react";
import { API_CONFIG } from "@/config/api";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md h-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
        <img
          src={`${API_CONFIG.baseURL}${product.main_image}`}
          alt={product.name}
          className={`absolute h-full w-full object-cover object-center transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={`${API_CONFIG.baseURL}${product.secondary_image}`}
          alt={`${product.name} - второе фото`}
          className={`absolute h-full w-full object-cover object-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div className="mt-4 space-y-2 flex-grow">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
