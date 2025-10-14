export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}

export enum SpendingCategory {
  BOOKS = 'books',
  COSMETICS = 'cosmetics',
  GYM = 'gym',
  SPORTS = 'sports',
  FOOD_HEALTH = 'food_health',
  TECHNOLOGY = 'technology',
  ENTERTAINMENT = 'entertainment',
  TRAVEL = 'travel',
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  OTHER = 'other'
}
