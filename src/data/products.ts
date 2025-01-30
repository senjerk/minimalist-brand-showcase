export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

// Теперь это просто интерфейс, данные будут приходить с сервера
export const products: Product[] = [];