import { TransactionCategorizer } from '../services/TransactionCategorizer';
import { Transaction, SpendingCategory } from '../models/Transaction';

describe('TransactionCategorizer', () => {
  let categorizer: TransactionCategorizer;

  beforeEach(() => {
    categorizer = new TransactionCategorizer();
  });

  test('should categorize book purchases', () => {
    const transaction: Transaction = {
      id: '1',
      date: new Date(),
      amount: 50,
      description: 'Amazon Books - Programming',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.BOOKS);
  });

  test('should categorize gym memberships', () => {
    const transaction: Transaction = {
      id: '2',
      date: new Date(),
      amount: 25,
      description: 'Planet Fitness Membership',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.GYM);
  });

  test('should categorize cosmetics purchases', () => {
    const transaction: Transaction = {
      id: '3',
      date: new Date(),
      amount: 75,
      description: 'Sephora Beauty Store',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.COSMETICS);
  });

  test('should categorize technology purchases', () => {
    const transaction: Transaction = {
      id: '4',
      date: new Date(),
      amount: 999,
      description: 'Best Buy - Computer',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.TECHNOLOGY);
  });

  test('should categorize healthcare expenses', () => {
    const transaction: Transaction = {
      id: '5',
      date: new Date(),
      amount: 150,
      description: 'CVS Pharmacy - Prescription',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.HEALTHCARE);
  });

  test('should default to OTHER for unknown categories', () => {
    const transaction: Transaction = {
      id: '6',
      date: new Date(),
      amount: 20,
      description: 'Random Store Purchase',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.OTHER);
  });

  test('should aggregate spending by category', () => {
    const transactions: Transaction[] = [
      { id: '1', date: new Date(), amount: 50, description: 'Amazon Books', category: '' },
      { id: '2', date: new Date(), amount: 30, description: 'Kindle Books', category: '' },
      { id: '3', date: new Date(), amount: 25, description: 'Planet Fitness', category: '' },
      { id: '4', date: new Date(), amount: 100, description: 'Sephora', category: '' },
    ];

    const spending = categorizer.categorizeTransactions(transactions);

    expect(spending.get(SpendingCategory.BOOKS)).toBe(80);
    expect(spending.get(SpendingCategory.GYM)).toBe(25);
    expect(spending.get(SpendingCategory.COSMETICS)).toBe(100);
  });

  test('should handle case-insensitive matching', () => {
    const transaction: Transaction = {
      id: '7',
      date: new Date(),
      amount: 45,
      description: 'AMAZON BOOKS - KINDLE',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.BOOKS);
  });

  test('should categorize gambling transactions', () => {
    const transaction: Transaction = {
      id: '8',
      date: new Date(),
      amount: 50,
      description: 'DraftKings - Sports Betting',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.GAMBLING);
  });

  test('should categorize charity donations', () => {
    const transaction: Transaction = {
      id: '9',
      date: new Date(),
      amount: 100,
      description: 'Red Cross Donation',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.CHARITY);
  });

  test('should categorize tax payments', () => {
    const transaction: Transaction = {
      id: '10',
      date: new Date(),
      amount: 500,
      description: 'IRS Tax Payment',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.TAXES);
  });

  test('should categorize insurance premiums', () => {
    const transaction: Transaction = {
      id: '11',
      date: new Date(),
      amount: 125,
      description: 'Geico Insurance Premium',
      category: ''
    };

    expect(categorizer.categorize(transaction)).toBe(SpendingCategory.INSURANCE);
  });
});
