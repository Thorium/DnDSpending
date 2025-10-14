export interface DnDStats {
  strength: number;      // Physical power (gym, sports)
  dexterity: number;     // Agility and reflexes (sports, travel)
  constitution: number;  // Endurance and health (healthcare, healthy food)
  intelligence: number;  // Learning and reasoning (technology, education)
  wisdom: number;        // Awareness and insight (books, education)
  charisma: number;      // Force of personality (cosmetics, entertainment)
}

export interface CharacterSheet {
  name: string;
  level: number;
  stats: DnDStats;
  totalSpending: number;
  spendingBreakdown: Record<string, number>;
  characterClass: string;
  description: string;
}

export const BASE_STAT = 10;
