# DnDSpending

A banking application that transforms your spending data into a Dungeons & Dragons character sheet! This application fetches your transactions via open-banking APIs, analyzes your spending patterns over the past 6 months, and generates a D&D character profile that matches your spending habits.

## 🎲 Features

- **Transaction Fetching**: Integrates with open banking APIs to fetch your transaction history
- **Spending Analytics**: Analyzes spending patterns across various categories
- **D&D Character Generation**: Converts your spending into D&D character stats:
  - 💪 **Strength**: Spending on gym memberships and sports equipment
  - 🏃 **Dexterity**: Spending on sports and travel
  - ❤️ **Constitution**: Spending on healthcare and healthy food
  - 🧠 **Intelligence**: Spending on technology and education
  - 📖 **Wisdom**: Spending on books and education
  - ✨ **Charisma**: Spending on cosmetics and entertainment
- **Character Sheet Display**: Beautiful web interface displaying your D&D character
- **Level System**: Your character level is determined by total spending ($1000 = 1 level)
- **Character Class**: Automatically determined based on your highest stat

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Thorium/DnDSpending.git
cd DnDSpending
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

Or run in development mode:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📊 How It Works

### Spending Categories

The application categorizes your transactions into the following categories:

- **Books**: Bookstores, Amazon Books, Kindle, Audible
- **Cosmetics**: Beauty products, makeup, salons, spas
- **Gym**: Fitness centers, gym memberships
- **Sports**: Sports equipment, athletic wear
- **Health Food**: Organic food, health foods, vitamins
- **Technology**: Electronics, software, computers
- **Entertainment**: Movies, concerts, streaming services
- **Travel**: Airlines, hotels, ride-sharing
- **Education**: Courses, tuition, online learning
- **Healthcare**: Doctors, pharmacies, medical services

### Character Stats Calculation

Each $100 spent in a relevant category adds 1 point to the corresponding D&D stat:

- **Strength** = Gym spending + 0.5 × Sports spending
- **Dexterity** = 0.5 × Sports spending + 0.3 × Travel spending
- **Constitution** = 0.7 × Healthcare + Health Food + 0.3 × Gym
- **Intelligence** = Education + 0.5 × Technology
- **Wisdom** = Books + 0.5 × Education
- **Charisma** = Cosmetics + 0.5 × Entertainment

All stats start at a base value of 10 (standard D&D baseline).

### Character Classes

Your character class is determined by your highest stat:

- **Fighter**: High Strength
- **Rogue**: High Dexterity
- **Barbarian**: High Constitution
- **Wizard**: High Intelligence
- **Cleric**: High Wisdom
- **Bard**: High Charisma

## 🔌 API Endpoints

### Get Character Sheet
```
GET /api/character-sheet?name={playerName}
```

Returns a complete D&D character sheet based on spending data.

### Get Transactions
```
GET /api/transactions
```

Returns all categorized transactions from the past 6 months.

## 🛠️ Configuration

### Open Banking Integration

Currently, the application uses mock transaction data for demonstration purposes. To integrate with a real open banking API:

1. Update `src/services/TransactionService.ts`
2. Implement the `fetchTransactions()` method with your open banking API
3. Add API credentials to a `.env` file (not included in repository)

Example open banking APIs you could integrate:
- Plaid
- Yodlee
- TrueLayer
- Open Banking UK

## 📝 Development

### Project Structure

```
DnDSpending/
├── src/
│   ├── models/           # Data models
│   │   ├── Transaction.ts
│   │   └── CharacterSheet.ts
│   ├── services/         # Business logic
│   │   ├── TransactionService.ts
│   │   ├── TransactionCategorizer.ts
│   │   └── CharacterSheetGenerator.ts
│   └── server.ts         # Express server
├── public/
│   └── index.html        # Frontend UI
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## 🎨 Customization

### Adding New Spending Categories

1. Add the category to `SpendingCategory` enum in `src/models/Transaction.ts`
2. Add keywords to `TransactionCategorizer` in `src/services/TransactionCategorizer.ts`
3. Update stat calculations in `CharacterSheetGenerator.ts`

### Modifying Stat Calculations

Edit the `mapSpendingToStats()` method in `src/services/CharacterSheetGenerator.ts` to adjust how spending affects stats.

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

Created as a fun way to gamify personal finance tracking!
