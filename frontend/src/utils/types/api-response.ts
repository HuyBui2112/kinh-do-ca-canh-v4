/**
 * Generic API response structure.
 * All successful API responses should follow this format.
 */
export interface ApiResponse<T = unknown> {
  success: boolean; // Indicates if the request was successful
  message?: string; // Optional success or error message
  data?: T; // The actual data payload
  // Add other common fields if necessary, like errors, pagination metadata, etc.
} 