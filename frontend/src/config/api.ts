
export const API_CONFIG = {
  baseURL: 'http://127.0.0.1:8000',
  endpoints: {
    csrf: '/api/get-csrf-token/',
    products: '/api/catalog/products/',
    categories: '/api/catalog/categories/',
    colors: '/api/catalog/colors/',
    productDetail: (id: number) => `/api/catalog/products/${id}/`,
    cart: {
      add: '/api/catalog/cart/add/',
      get: '/api/catalog/cart/',
      update: (id: number) => `/api/catalog/cart/item/${id}/`,
    }
  }
};
