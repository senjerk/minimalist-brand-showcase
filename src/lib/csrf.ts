const API_BASE_URL = 'http://localhost:8000';

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
export async function addCSRFToken(headers: HeadersInit = {}): Promise<HeadersInit> {
  const csrfToken = await getCSRFToken();
  
  return {
    ...headers,
    'X-CSRFToken': csrfToken || '',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:5173', // Добавляем Origin заголовок
  };
} 