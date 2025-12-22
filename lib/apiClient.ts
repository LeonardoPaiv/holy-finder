import Cookies from 'js-cookie';
import { supabase } from './supabase';
import { ROUTES, COOKIES } from './constants';

// Flags to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempts to refresh the access token using the refresh token from cookies.
 * Returns true if successful, false otherwise.
 */
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = Cookies.get(COOKIES.REFRESH_TOKEN);
  
  if (!refreshToken) {
    console.error('No refresh token available');
    return false;
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      console.error('Failed to refresh token:', error);
      return false;
    }

    // Update cookies with new tokens
    Cookies.set(COOKIES.ACCESS_TOKEN, data.session.access_token, { expires: 7 });
    Cookies.set(COOKIES.REFRESH_TOKEN, data.session.refresh_token, { expires: 7 });
    
    return true;
  } catch (error) {
    console.error('Error during token refresh:', error);
    return false;
  }
};

/**
 * Handles token refresh with queuing mechanism to prevent multiple simultaneous refreshes.
 */
const handleTokenRefresh = async (): Promise<boolean> => {
  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Start new refresh
  isRefreshing = true;
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
};

/**
 * Clears authentication cookies and redirects to login page.
 */
const handleAuthFailure = (): void => {
  Cookies.remove(COOKIES.ACCESS_TOKEN);
  Cookies.remove(COOKIES.REFRESH_TOKEN);
  
  // Only redirect if we're in a browser environment and not already on login page
  if (typeof window !== 'undefined' && window.location.pathname !== ROUTES.INSTITUTION.LOGIN) {
    window.location.href = ROUTES.INSTITUTION.LOGIN;
  }
};

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean; // Skip adding Authorization header
  skipRetry?: boolean; // Skip retry on 401
}

/**
 * Enhanced fetch wrapper with automatic token refresh on 401 responses.
 * 
 * Features:
 * - Automatically adds Authorization header with access token
 * - Intercepts 401 responses and attempts token refresh
 * - Retries failed requests after successful token refresh
 * - Prevents multiple simultaneous refresh attempts
 * - Redirects to login on refresh failure
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options with additional apiClient-specific options
 * @returns Promise with the fetch response
 */
export const apiClient = async (
  url: string,
  options: ApiClientOptions = {}
): Promise<Response> => {
  const { skipAuth = false, skipRetry = false, ...fetchOptions } = options;

  // Prepare headers
  const headers = new Headers(fetchOptions.headers);
  
  // Add Authorization header if not skipped
  if (!skipAuth) {
    const accessToken = Cookies.get(COOKIES.ACCESS_TOKEN);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  // Make the request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // If not a 401 or retry is skipped, return the response as-is
  if (response.status !== 401 || skipRetry || skipAuth) {
    return response;
  }

  // Handle 401: Attempt token refresh
  console.log('Received 401, attempting token refresh...');
  
  const refreshSuccess = await handleTokenRefresh();

  if (!refreshSuccess) {
    console.error('Token refresh failed, redirecting to login');
    handleAuthFailure();
    return response; // Return original 401 response
  }

  // Retry the original request with new token
  console.log('Token refreshed successfully, retrying request...');
  const newAccessToken = Cookies.get(COOKIES.ACCESS_TOKEN);
  
  if (newAccessToken) {
    headers.set('Authorization', `Bearer ${newAccessToken}`);
  }

  // Retry with skipRetry to prevent infinite loops
  return fetch(url, {
    ...fetchOptions,
    headers,
  });
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: 'GET' }),

  post: (url: string, body?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: (url: string, body?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: (url: string, body?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: 'DELETE' }),
};
