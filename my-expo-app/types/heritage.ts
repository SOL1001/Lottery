// src/types/heritage.ts
export type HeritageCategory = 'all' | 'culture' | 'historical' | 'religious' | 'natural' | 'library';

export interface HeritageItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: HeritageCategory;
  location: string;
  year?: number;
}