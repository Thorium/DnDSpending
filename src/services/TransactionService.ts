import { Transaction } from '../models/Transaction';

/**
 * Service to fetch transactions from open banking APIs
 * Currently uses mock data for demonstration
 */
export class TransactionService {
  
  /**
   * Generates mock transactions for the past 6 months
   */
  generateMockTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const mockData = [
      { description: 'Amazon Books - Kindle', amount: 45.99 },
      { description: 'Barnes & Noble', amount: 67.50 },
      { description: 'Sephora Cosmetics', amount: 89.99 },
      { description: 'Ulta Beauty Store', amount: 54.25 },
      { description: 'Planet Fitness Membership', amount: 22.00 },
      { description: 'Planet Fitness Membership', amount: 22.00 },
      { description: 'Planet Fitness Membership', amount: 22.00 },
      { description: 'Planet Fitness Membership', amount: 22.00 },
      { description: 'Planet Fitness Membership', amount: 22.00 },
      { description: 'Nike Running Shoes', amount: 125.00 },
      { description: 'Adidas Sports Gear', amount: 78.50 },
      { description: 'Whole Foods Market', amount: 156.30 },
      { description: 'Whole Foods Market', amount: 142.75 },
      { description: 'Whole Foods Market', amount: 138.90 },
      { description: 'Best Buy - MacBook Pro', amount: 1299.99 },
      { description: 'Apple Store - iPhone', amount: 999.00 },
      { description: 'Netflix Subscription', amount: 15.99 },
      { description: 'Netflix Subscription', amount: 15.99 },
      { description: 'Netflix Subscription', amount: 15.99 },
      { description: 'Netflix Subscription', amount: 15.99 },
      { description: 'Spotify Premium', amount: 9.99 },
      { description: 'Spotify Premium', amount: 9.99 },
      { description: 'Spotify Premium', amount: 9.99 },
      { description: 'Delta Airlines', amount: 456.00 },
      { description: 'Airbnb Booking', amount: 340.00 },
      { description: 'Uber Ride', amount: 23.50 },
      { description: 'Uber Ride', amount: 18.75 },
      { description: 'Coursera Course', amount: 49.00 },
      { description: 'Udemy - Python Course', amount: 12.99 },
      { description: 'CVS Pharmacy', amount: 34.50 },
      { description: 'Doctor Visit Copay', amount: 25.00 },
      { description: 'Dental Checkup', amount: 150.00 },
      { description: 'Movie Theater Tickets', amount: 28.00 },
      { description: 'Concert - Live Music', amount: 85.00 },
      { description: 'DraftKings - Sports Betting', amount: 50.00 },
      { description: 'State Lottery', amount: 25.00 },
      { description: 'Red Cross Donation', amount: 100.00 },
      { description: 'UNICEF Charity', amount: 50.00 },
      { description: 'IRS Tax Payment', amount: 450.00 },
      { description: 'TV Licence Fee', amount: 159.00 },
      { description: 'Geico Insurance Premium', amount: 125.00 },
      { description: 'Geico Insurance Premium', amount: 125.00 },
      { description: 'State Farm Insurance', amount: 95.00 },
    ];

    // Distribute transactions over 6 months
    mockData.forEach((data, index) => {
      const randomDaysAgo = Math.floor(Math.random() * 180); // Random day within 6 months
      const transactionDate = new Date();
      transactionDate.setDate(now.getDate() - randomDaysAgo);

      transactions.push({
        id: `txn_${index + 1}`,
        date: transactionDate,
        amount: data.amount,
        description: data.description,
        category: '' // Will be set by categorizer
      });
    });

    return transactions;
  }

  /**
   * Fetches transactions from the past 6 months
   * In a real implementation, this would call an open banking API
   */
  async fetchTransactions(userId: string): Promise<Transaction[]> {
    // TODO: Implement actual open banking API integration
    // For now, return mock data
    return this.generateMockTransactions();
  }

  /**
   * Filters transactions to only include those from the past 6 months
   */
  filterLast6Months(transactions: Transaction[]): Transaction[] {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return transactions.filter(t => new Date(t.date) >= sixMonthsAgo);
  }
}
