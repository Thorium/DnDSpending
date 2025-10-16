import { CharacterSheet, DnDStats, BASE_STAT, Alignment } from '../models/CharacterSheet';
import { SpendingCategory } from '../models/Transaction';

/**
 * Generates a D&D character sheet based on spending patterns
 */
export class CharacterSheetGenerator {
  
  /**
   * Converts spending amounts to stat bonuses
   * Every $100 spent adds 1 point to the relevant stat
   */
  private calculateStatBonus(amount: number): number {
    return Math.floor(amount / 100);
  }

  /**
   * Calculates alignment based on spending patterns and income consistency
   */
  private calculateAlignment(spending: Map<SpendingCategory, number>, transactions?: any[]): Alignment {
    const scores = {
      lawful: 0,
      chaotic: 0,
      good: 0,
      evil: 0
    };

    // Lawful: Taxes, insurance, regular payments, organized spending
    scores.lawful += (spending.get(SpendingCategory.TAXES) || 0) * 0.01;
    scores.lawful += (spending.get(SpendingCategory.INSURANCE) || 0) * 0.008;
    scores.lawful += (spending.get(SpendingCategory.HEALTHCARE) || 0) * 0.003;
    
    // Chaotic: Gambling, spontaneous entertainment, travel
    scores.chaotic += (spending.get(SpendingCategory.GAMBLING) || 0) * 0.015;
    scores.chaotic += (spending.get(SpendingCategory.ENTERTAINMENT) || 0) * 0.005;
    scores.chaotic += (spending.get(SpendingCategory.TRAVEL) || 0) * 0.004;
    
    // Good: Charity, healthcare, education
    scores.good += (spending.get(SpendingCategory.CHARITY) || 0) * 0.02;
    scores.good += (spending.get(SpendingCategory.HEALTHCARE) || 0) * 0.003;
    scores.good += (spending.get(SpendingCategory.EDUCATION) || 0) * 0.004;
    
    // Evil: Gambling (selfish), excessive cosmetics (vanity)
    scores.evil += (spending.get(SpendingCategory.GAMBLING) || 0) * 0.008;
    scores.evil += (spending.get(SpendingCategory.COSMETICS) || 0) * 0.003;

    // Income consistency affects lawful/chaotic
    if (transactions && transactions.length > 0) {
      const incomeTransactions = transactions.filter(t => t.amount < 0); // Income is negative
      if (incomeTransactions.length > 0) {
        const incomeVariance = this.calculateIncomeVariance(incomeTransactions);
        // Low variance = consistent income = lawful
        // High variance = inconsistent income = chaotic
        if (incomeVariance < 0.3) {
          scores.lawful += 10;
        } else if (incomeVariance > 0.7) {
          scores.chaotic += 10;
        }
      }
    }

    // Determine alignment axis values
    const lawfulChaotic = scores.lawful > scores.chaotic + 5 ? 'Lawful' : 
                          scores.chaotic > scores.lawful + 5 ? 'Chaotic' : 'Neutral';
    
    const goodEvil = scores.good > scores.evil + 3 ? 'Good' : 
                     scores.evil > scores.good + 3 ? 'Evil' : 'Neutral';
    
    const full = lawfulChaotic === 'Neutral' && goodEvil === 'Neutral' ? 
                 'True Neutral' : `${lawfulChaotic} ${goodEvil}`;

    return {
      lawfulChaotic,
      goodEvil,
      full,
      score: scores
    };
  }

  /**
   * Calculates income variance for consistency measurement
   */
  private calculateIncomeVariance(incomeTransactions: any[]): number {
    if (incomeTransactions.length < 2) return 0;
    
    const amounts = incomeTransactions.map(t => Math.abs(t.amount));
    const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    // Return coefficient of variation (normalized variance)
    return mean > 0 ? stdDev / mean : 0;
  }

  /**
   * Maps spending categories to D&D stats
   */
  private mapSpendingToStats(spending: Map<SpendingCategory, number>): DnDStats {
    const stats: DnDStats = {
      strength: BASE_STAT,
      dexterity: BASE_STAT,
      constitution: BASE_STAT,
      intelligence: BASE_STAT,
      wisdom: BASE_STAT,
      charisma: BASE_STAT
    };

    // Strength: Physical power (gym, sports)
    const strengthSpending = (spending.get(SpendingCategory.GYM) || 0) + 
                             (spending.get(SpendingCategory.SPORTS) || 0) * 0.5;
    stats.strength += this.calculateStatBonus(strengthSpending);

    // Dexterity: Agility and reflexes (sports, travel)
    const dexteritySpending = (spending.get(SpendingCategory.SPORTS) || 0) * 0.5 + 
                              (spending.get(SpendingCategory.TRAVEL) || 0) * 0.3;
    stats.dexterity += this.calculateStatBonus(dexteritySpending);

    // Constitution: Endurance and health (healthcare, healthy food)
    const constitutionSpending = (spending.get(SpendingCategory.HEALTHCARE) || 0) * 0.7 + 
                                 (spending.get(SpendingCategory.FOOD_HEALTH) || 0) + 
                                 (spending.get(SpendingCategory.GYM) || 0) * 0.3;
    stats.constitution += this.calculateStatBonus(constitutionSpending);

    // Intelligence: Learning and reasoning (technology, education)
    const intelligenceSpending = (spending.get(SpendingCategory.EDUCATION) || 0) + 
                                 (spending.get(SpendingCategory.TECHNOLOGY) || 0) * 0.5;
    stats.intelligence += this.calculateStatBonus(intelligenceSpending);

    // Wisdom: Awareness and insight (books, education)
    const wisdomSpending = (spending.get(SpendingCategory.BOOKS) || 0) + 
                          (spending.get(SpendingCategory.EDUCATION) || 0) * 0.5;
    stats.wisdom += this.calculateStatBonus(wisdomSpending);

    // Charisma: Force of personality (cosmetics, entertainment)
    const charismaSpending = (spending.get(SpendingCategory.COSMETICS) || 0) + 
                             (spending.get(SpendingCategory.ENTERTAINMENT) || 0) * 0.5;
    stats.charisma += this.calculateStatBonus(charismaSpending);

    return stats;
  }

  /**
   * Determines character class based on highest stat
   */
  private determineCharacterClass(stats: DnDStats): string {
    const statMap = {
      strength: 'Fighter',
      dexterity: 'Rogue',
      constitution: 'Barbarian',
      intelligence: 'Wizard',
      wisdom: 'Cleric',
      charisma: 'Bard'
    };

    let highestStat: keyof DnDStats = 'strength';
    let highestValue = stats.strength;

    for (const [stat, value] of Object.entries(stats) as [keyof DnDStats, number][]) {
      if (value > highestValue) {
        highestValue = value;
        highestStat = stat;
      }
    }

    return statMap[highestStat];
  }

  /**
   * Calculates character level based on total spending
   * Every $1000 spent = 1 level
   */
  private calculateLevel(totalSpending: number): number {
    return Math.max(1, Math.floor(totalSpending / 1000));
  }

  /**
   * Generates a character description based on stats and class
   */
  private generateDescription(characterClass: string, stats: DnDStats): string {
    const descriptions: Record<string, string> = {
      'Fighter': 'A disciplined warrior who trains rigorously and invests in physical prowess.',
      'Rogue': 'An agile adventurer who values mobility and exploration.',
      'Barbarian': 'A hardy individual who prioritizes health and endurance above all.',
      'Wizard': 'A learned scholar who invests heavily in knowledge and technology.',
      'Cleric': 'A wise sage who seeks knowledge through books and continuous learning.',
      'Bard': 'A charismatic performer who values appearance and entertainment.'
    };

    return descriptions[characterClass] || 'A balanced adventurer with diverse interests.';
  }

  /**
   * Generates a complete character sheet from spending data
   */
  generateCharacterSheet(
    playerName: string,
    spending: Map<SpendingCategory, number>,
    transactions?: any[],
    currency: string = 'USD'
  ): CharacterSheet {
    const stats = this.mapSpendingToStats(spending);
    const totalSpending = Array.from(spending.values()).reduce((sum, val) => sum + val, 0);
    const level = this.calculateLevel(totalSpending);
    const characterClass = this.determineCharacterClass(stats);
    const description = this.generateDescription(characterClass, stats);
    const alignment = this.calculateAlignment(spending, transactions);

    const spendingBreakdown: Record<string, number> = {};
    spending.forEach((value, key) => {
      spendingBreakdown[key] = value;
    });

    return {
      name: playerName,
      level,
      stats,
      alignment,
      totalSpending,
      spendingBreakdown,
      characterClass,
      description,
      currency
    };
  }
}
