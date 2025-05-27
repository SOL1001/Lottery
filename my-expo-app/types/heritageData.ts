// src/api/heritageApi.ts
import apiClient from './apiClient';
import { HeritageItem, HeritageCategory } from '../types/heritage';

export const heritageApi = {
  async getHeritageItems(category: HeritageCategory = 'all'): Promise<HeritageItem[]> {
    try {
      const endpoint = category === 'all' 
        ? '/heritages' 
        : `/heritages?category=${category}`;
      return await apiClient.get<HeritageItem[]>(endpoint);
    } catch (error) {
      console.error('Failed to fetch heritage items', error);
      throw error;
    }
  },

  async getCategories(): Promise<HeritageCategory[]> {
    try {
      return await apiClient.get<HeritageCategory[]>('/heritages/categories');
    } catch (error) {
      console.error('Failed to fetch categories', error);
      return ['all', 'culture', 'historical', 'religious', 'natural', 'library'];
    }
  }
};