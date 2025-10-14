import { Transaction, SpendingCategory } from '../models/Transaction';

/**
 * Categorizes transactions based on description keywords
 */
export class TransactionCategorizer {
  private categoryKeywords: Map<SpendingCategory, string[]>;

  constructor() {
    this.categoryKeywords = new Map([
      [SpendingCategory.BOOKS, ['book', 'bookstore', 'amazon books', 'barnes', 'library', 'kindle', 'audible']],
      [SpendingCategory.COSMETICS, ['cosmetics', 'beauty', 'makeup', 'salon', 'spa', 'sephora', 'ulta', 'haircut']],
      [SpendingCategory.GYM, ['gym', 'fitness', 'planet fitness', 'la fitness', 'crunch', 'equinox', 'yoga']],
      [SpendingCategory.SPORTS, ['sports', 'nike', 'adidas', 'running', 'cycling', 'swimming', 'outdoor']],
      [SpendingCategory.FOOD_HEALTH, ['whole foods', 'organic', 'health food', 'vitamin', 'supplement', 'nutritionist']],
      [SpendingCategory.TECHNOLOGY, ['apple', 'microsoft', 'best buy', 'electronics', 'software', 'computer', 'tech']],
      [SpendingCategory.ENTERTAINMENT, ['theater', 'cinema', 'movie', 'concert', 'netflix', 'spotify', 'gaming', 'steam']],
      [SpendingCategory.TRAVEL, ['airline', 'hotel', 'airbnb', 'uber', 'lyft', 'rental car', 'travel']],
      [SpendingCategory.EDUCATION, ['university', 'college', 'course', 'udemy', 'coursera', 'tuition', 'school']],
      [SpendingCategory.HEALTHCARE, ['hospital', 'doctor', 'pharmacy', 'medical', 'dental', 'insurance', 'cvs', 'walgreens']]
    ]);
  }

  categorize(transaction: Transaction): SpendingCategory {
    const description = transaction.description.toLowerCase();
    
    for (const [category, keywords] of this.categoryKeywords) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return category;
      }
    }
    
    return SpendingCategory.OTHER;
  }

  categorizeTransactions(transactions: Transaction[]): Map<SpendingCategory, number> {
    const spending = new Map<SpendingCategory, number>();
    
    for (const transaction of transactions) {
      const category = this.categorize(transaction);
      const currentAmount = spending.get(category) || 0;
      spending.set(category, currentAmount + transaction.amount);
    }
    
    return spending;
  }
}
