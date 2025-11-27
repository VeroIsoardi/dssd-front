/**
 * API Client utilities for handling common API operations
 * Includes automatic 401 redirect to login page
 */

import { getToken, clearToken, clearUserData } from '@/services/auth'

/**
 * Handles API response errors, specifically redirecting on 401
 */
export function handleApiError(response: Response): void {
  if (response.status === 401) {
    // Clear authentication data
    clearToken()
    clearUserData()
    
    // Redirect to login page (home page)
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
}

/**
 * Creates headers with authentication token if available
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Wrapper for fetch that handles 401 automatically
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  // Handle 401 responses
  if (response.status === 401) {
    handleApiError(response)
    throw new Error('Unauthorized - redirecting to login')
  }
  
  return response
}
