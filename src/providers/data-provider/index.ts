"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import { BASE_URL } from "@constants/api-url";
import { DataProvider } from "@refinedev/core";

const simpleRestProvider = dataProviderSimpleRest(BASE_URL);

// Wrap the data provider to handle our API response structure
export const dataProvider: DataProvider = {
  ...simpleRestProvider,
  getList: async (params) => {
    const result = await simpleRestProvider.getList(params);
    
    // Check if result.data is an array (expected format)
    if (Array.isArray(result.data)) {
      return result;
    }
    
    // If the data is wrapped in a success object, unwrap it
    if (result.data && typeof result.data === 'object') {
      const wrappedData = result.data as any;
      
      // Handle our custom API response format: { success: true, data: [...], message: "..." }
      if ('data' in wrappedData && Array.isArray(wrappedData.data)) {
        return {
          data: wrappedData.data,
          total: wrappedData.total || wrappedData.data.length,
        };
      }
      
      // Handle case where data is wrapped but not an array
      if ('data' in wrappedData) {
        return {
          data: Array.isArray(wrappedData.data) ? wrappedData.data : [wrappedData.data],
          total: wrappedData.total || 1,
        };
      }
    }
    
    return result;
  },
  getOne: async (params) => {
    const result = await simpleRestProvider.getOne(params);
    
    // Check if result.data is already unwrapped
    if (result.data && typeof result.data === 'object' && !('data' in result.data)) {
      return result;
    }
    
    // If the data is wrapped in a success object, unwrap it
    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
      const wrappedData = result.data as any;
      return {
        data: wrappedData.data,
      };
    }
    
    return result;
  },
  getMany: async (params) => {
    const result = await simpleRestProvider.getMany(params);
    
    // Check if result.data is an array (expected format)
    if (Array.isArray(result.data)) {
      return result;
    }
    
    // If the data is wrapped in a success object, unwrap it
    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
      const wrappedData = result.data as any;
      return {
        data: Array.isArray(wrappedData.data) ? wrappedData.data : [wrappedData.data],
      };
    }
    
    return result;
  },
};

