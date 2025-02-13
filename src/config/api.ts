
export const API_CONFIG = {
  baseURL: 'http://127.0.0.1:8000',
  endpoints: {
    csrf: '/api/get-csrf-token/',
    products: '/api/catalog/products/',
    categories: '/api/catalog/categories/',
    colors: '/api/catalog/colors/',
    auth: {
      register: '/api/users/register/',
      login: '/api/users/login/',
      logout: '/api/users/logout/',
      isAuth: '/api/users/is_auth/'
    }
  }
};
