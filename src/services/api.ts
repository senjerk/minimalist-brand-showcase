import { API_CONFIG } from '@/config/api';
import { ProductResponse, CategoriesResponse, ColorsResponse } from '@/types/api';

// Function to get CSRF token from cookies
const getCsrfToken = (): string | null => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Function to fetch CSRF token from the server
const fetchCsrfToken = async (): Promise<void> => {
  const response = await fetch(`${API_CONFIG.baseURL}/api/get-csrf-token/`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch CSRF token');
  }
};

// Helper function to get headers with CSRF token
const getHeaders = async (): Promise<HeadersInit> => {
  let csrfToken = getCsrfToken();
  if (!csrfToken) {
    await fetchCsrfToken();
    csrfToken = getCsrfToken();
  }
  return {
    'X-CSRFToken': csrfToken || '',
  };
};

interface FetchProductsParams {
  category?: string;
  color?: string;
  size?: string;
  page?: string;
}

export const fetchProducts = async (params?: FetchProductsParams): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.category && params.category !== '_all') queryParams.append('category', params.category);
  if (params?.color && params.color !== '_all') queryParams.append('color', params.color);
  if (params?.size && params.size !== '_all') queryParams.append('size', params.size);
  if (params?.page) queryParams.append('page', params.page);

  const headers = await getHeaders();
  const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    credentials: 'include',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  const headers = await getHeaders();
  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`, {
    credentials: 'include',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const fetchColors = async (): Promise<ColorsResponse> => {
  const headers = await getHeaders();
  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.colors}`, {
    credentials: 'include',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch colors');
  }
  return response.json();
};