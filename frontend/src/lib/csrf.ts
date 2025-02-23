import Cookies from 'js-cookie';
import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export async function getCSRFToken(): Promise<string | undefined> {
  // Получаем токен из cookies
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  // Если токен не найден в cookies, делаем запрос к серверу
  if (!csrfToken) {
    try {
      await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      // Пробуем получить токен снова после запроса
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    } catch (error) {
      console.error('Ошибка при получении CSRF токена:', error);
      return undefined;
    }
  }

  return csrfToken;
}

// Функция для добавления CSRF токена в заголовки запроса
export async function addCSRFToken(): Promise<HeadersInit> {
  let csrfToken = Cookies.get('csrftoken');

  if (!csrfToken) {
    // Если токена нет, делаем запрос для его получения
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getCSRFToken}`,
      {
        credentials: 'include',
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    
    csrfToken = Cookies.get('csrftoken');
  }

  return {
    'Content-Type': 'application/json',
    'X-Csrftoken': csrfToken,
  };
} 