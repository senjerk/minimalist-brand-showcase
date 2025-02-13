export interface ProductResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
  };
  message?: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
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

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface APIResponse<T> {
  data: T;
  message: string;
  queries_info?: {
    count: number;
    total_time: number;
    queries: Array<{
      sql: string;
      time: string;
    }>;
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}