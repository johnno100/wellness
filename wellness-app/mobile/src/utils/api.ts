import axios from 'axios';
import { ApiResponse } from '../types';

/**
 * API utility for making HTTP requests
 */
export const api = {
  /**
   * Make a GET request
   * @param url API endpoint URL
   * @param headers Optional request headers
   * @returns Promise with response data
   */
  async get<T>(url: string, headers = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get(url, { headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API GET error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch data' 
      };
    }
  },

  /**
   * Make a POST request
   * @param url API endpoint URL
   * @param data Request payload
   * @param headers Optional request headers
   * @returns Promise with response data
   */
  async post<T>(url: string, data = {}, headers = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post(url, data, { headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API POST error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to submit data' 
      };
    }
  },

  /**
   * Make a PUT request
   * @param url API endpoint URL
   * @param data Request payload
   * @param headers Optional request headers
   * @returns Promise with response data
   */
  async put<T>(url: string, data = {}, headers = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios.put(url, data, { headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API PUT error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update data' 
      };
    }
  },

  /**
   * Make a DELETE request
   * @param url API endpoint URL
   * @param headers Optional request headers
   * @returns Promise with response data
   */
  async delete<T>(url: string, headers = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios.delete(url, { headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API DELETE error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete data' 
      };
    }
  }
};
