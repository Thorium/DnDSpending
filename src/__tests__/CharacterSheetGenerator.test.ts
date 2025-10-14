import { CharacterSheetGenerator } from '../services/CharacterSheetGenerator';
import { SpendingCategory } from '../models/Transaction';
import { BASE_STAT } from '../models/CharacterSheet';

describe('CharacterSheetGenerator', () => {
  let generator: CharacterSheetGenerator;

  beforeEach(() => {
    generator = new CharacterSheetGenerator();
  });

  test('should generate character sheet with base stats when no spending', () => {
    const spending = new Map<SpendingCategory, number>();
    const sheet = generator.generateCharacterSheet('TestPlayer', spending);

    expect(sheet.name).toBe('TestPlayer');
    expect(sheet.level).toBe(1);
    expect(sheet.stats.strength).toBe(BASE_STAT);
    expect(sheet.stats.dexterity).toBe(BASE_STAT);
    expect(sheet.stats.constitution).toBe(BASE_STAT);
    expect(sheet.stats.intelligence).toBe(BASE_STAT);
    expect(sheet.stats.wisdom).toBe(BASE_STAT);
    expect(sheet.stats.charisma).toBe(BASE_STAT);
  });

  test('should increase wisdom with book spending', () => {
    const spending = new Map<SpendingCategory, number>();
    spending.set(SpendingCategory.BOOKS, 500); // Should add 5 points
    
    const sheet = generator.generateCharacterSheet('BookLover', spending);
    
    expect(sheet.stats.wisdom).toBe(BASE_STAT + 5);
    expect(sheet.characterClass).toBe('Cleric'); // Highest wisdom
  });

  test('should increase strength with gym spending', () => {
    const spending = new Map<SpendingCategory, number>();
    spending.set(SpendingCategory.GYM, 1000); // Should add 10 points
    
    const sheet = generator.generateCharacterSheet('Athlete', spending);
    
    expect(sheet.stats.strength).toBe(BASE_STAT + 10);
    expect(sheet.characterClass).toBe('Fighter'); // Highest strength
  });

  test('should increase charisma with cosmetics spending', () => {
    const spending = new Map<SpendingCategory, number>();
    spending.set(SpendingCategory.COSMETICS, 300); // Should add 3 points
    
    const sheet = generator.generateCharacterSheet('Fashionista', spending);
    
    expect(sheet.stats.charisma).toBe(BASE_STAT + 3);
  });

  test('should calculate correct level based on total spending', () => {
    const spending = new Map<SpendingCategory, number>();
    spending.set(SpendingCategory.BOOKS, 2500);
    spending.set(SpendingCategory.GYM, 1500);
    // Total: 4000, should be level 4
    
    const sheet = generator.generateCharacterSheet('HighSpender', spending);
    
    expect(sheet.level).toBe(4);
    expect(sheet.totalSpending).toBe(4000);
  });

  test('should provide spending breakdown', () => {
    const spending = new Map<SpendingCategory, number>();
    spending.set(SpendingCategory.BOOKS, 250);
    spending.set(SpendingCategory.GYM, 150);
    
    const sheet = generator.generateCharacterSheet('Player', spending);
    
    expect(sheet.spendingBreakdown['books']).toBe(250);
    expect(sheet.spendingBreakdown['gym']).toBe(150);
  });

  test('should determine character class based on highest stat', () => {
    const testCases = [
      { category: SpendingCategory.GYM, amount: 1000, expectedClass: 'Fighter' },
      { category: SpendingCategory.BOOKS, amount: 1000, expectedClass: 'Cleric' },
      { category: SpendingCategory.EDUCATION, amount: 1000, expectedClass: 'Wizard' },
      { category: SpendingCategory.COSMETICS, amount: 1000, expectedClass: 'Bard' },
    ];

    testCases.forEach(({ category, amount, expectedClass }) => {
      const spending = new Map<SpendingCategory, number>();
      spending.set(category, amount);
      
      const sheet = generator.generateCharacterSheet('Player', spending);
      
      expect(sheet.characterClass).toBe(expectedClass);
    });
  });
});
