export interface DnDStats {
  strength: number;      // Physical power (gym, sports)
  dexterity: number;     // Agility and reflexes (sports, travel)
  constitution: number;  // Endurance and health (healthcare, healthy food)
  intelligence: number;  // Learning and reasoning (technology, education)
  wisdom: number;        // Awareness and insight (books, education)
  charisma: number;      // Force of personality (cosmetics, entertainment)
}

export interface Alignment {
  lawfulChaotic: string;  // 'Lawful', 'Neutral', or 'Chaotic'
  goodEvil: string;       // 'Good', 'Neutral', or 'Evil'
  full: string;           // Combined alignment (e.g., 'Lawful Good')
  score: {
    lawful: number;       // Lawful score (higher = more lawful)
    chaotic: number;      // Chaotic score (higher = more chaotic)
    good: number;         // Good score (higher = more good)
    evil: number;         // Evil score (higher = more evil)
  };
}

export interface CharacterSheet {
  name: string;
  level: number;
  stats: DnDStats;
  alignment: Alignment;
  totalSpending: number;
  spendingBreakdown: Record<string, number>;
  characterClass: string;
  description: string;
}

export const BASE_STAT = 10;
