// lib/authFetch.ts

import { API_URL } from './apiUrl';

/**
 * A helper function that wraps the fetch API and includes the Authorization header.
 * @param endpoint The API endpoint (relative to API_URL).
 * @param options Fetch options (method, headers, body, etc.).
 * @param token The JWT token for authentication.
 * @returns A promise that resolves to the response data.
 */
export async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token: string
): Promise<T> {
  // Initialize headers if not present
  options.headers = options.headers ? new Headers(options.headers) : new Headers();

  // Add Authorization header
  if (token) {
    (options.headers as Headers).set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type to application/json if not set and body is present
  if (options.body && !(options.headers as Headers).has('Content-Type')) {
    (options.headers as Headers).set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, options);

    // Handle unauthorized access
    if (response.status === 401) {
      // Optionally, implement logout logic here
      throw new Error('Unauthorized. Please log in again.');
    }

    // Handle other non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'An error occurred';
      throw new Error(errorMessage);
    }

    // If response has no content (e.g., DELETE requests), return null
    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.json();
  } catch (error) {
    console.error(`Error in authFetch for ${endpoint}:`, error);
    throw error;
  }
}
