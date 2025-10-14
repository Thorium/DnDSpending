import express, { Request, Response } from 'express';
import path from 'path';
import { TransactionService } from './services/TransactionService';
import { TransactionCategorizer } from './services/TransactionCategorizer';
import { CharacterSheetGenerator } from './services/CharacterSheetGenerator';

const app = express();
const port = process.env.PORT || 3000;

// Services
const transactionService = new TransactionService();
const categorizer = new TransactionCategorizer();
const characterGenerator = new CharacterSheetGenerator();

// Middleware
app.use(express.json());
app.use(express.static('public'));

/**
 * API endpoint to get character sheet based on spending
 */
app.get('/api/character-sheet', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user';
    const playerName = req.query.name as string || 'Adventurer';

    // Fetch transactions
    const transactions = await transactionService.fetchTransactions(userId);
    
    // Filter to last 6 months
    const recentTransactions = transactionService.filterLast6Months(transactions);
    
    // Categorize spending
    const spending = categorizer.categorizeTransactions(recentTransactions);
    
    // Generate character sheet
    const characterSheet = characterGenerator.generateCharacterSheet(playerName, spending);
    
    res.json({
      success: true,
      data: characterSheet,
      transactionCount: recentTransactions.length
    });
  } catch (error) {
    console.error('Error generating character sheet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate character sheet'
    });
  }
});

/**
 * API endpoint to get raw transactions
 */
app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user';
    const transactions = await transactionService.fetchTransactions(userId);
    const recentTransactions = transactionService.filterLast6Months(transactions);
    
    // Add categories to transactions
    const categorizedTransactions = recentTransactions.map(t => ({
      ...t,
      category: categorizer.categorize(t)
    }));
    
    res.json({
      success: true,
      data: categorizedTransactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

/**
 * Serve the main HTML page
 */
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`🎲 DnD Spending Tracker running on http://localhost:${port}`);
  console.log(`📊 View your character sheet at http://localhost:${port}`);
});
