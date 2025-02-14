export interface ProductResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
  };
  message?: string;
}

export interface ProductDetailResponse {
  data: ProductDetail;
  message: string;
}

export interface Product {
  id: number;
  name: string;
  main_image: string;
  secondary_image: string;
  price: number;
}

export interface ProductDetail extends Product {
  garments: Garment[];
  additional_images: AdditionalImage[];
}

export interface Garment {
  id: number;
  category: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
    color: string;
  };
  size: string;
  count: number;
  price: number;
}

export interface AdditionalImage {
  image: string;
  category: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  color: string;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface ColorsResponse {
  data: Color[];
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    main_image: string;
    secondary_image: string;
    price: number;
  };
  garment: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    color: {
      id: number;
      name: string;
      color: string;
    };
    size: string;
    count: number;
    price: number;
  };
  total_price: number;
}

export interface CartResponse {
  data: {
    id: number;
    items: CartItemResponse[];
  };
  message: string;
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    main_image: string;
    secondary_image: string;
    price: number;
  };
  garment: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    color: {
      id: number;
      name: string;
      color: string;
    };
    size: string;
    count: number;
    price: number;
  };
  quantity: number;
  price: number;
  total_price: number;
}

export interface Order {
  id: number;
  status: {
    status: string;
    status_display: string;
  };
  address: string;
  phone: string;
  total_sum: number;
  items: OrderItem[];
  confirmation_url?: string;
}

export interface OrdersResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
  };
  message: string;
}
