# 🎲 D&D Spending Tracker - Feature Summary

## New Features Added

### 1. ⚖️ Alignment System

Your character now has a D&D alignment based on your spending patterns!

**Alignment Axes:**

#### Lawful ⚖️ vs Chaotic 🎲
- **Lawful behaviors**: Paying taxes, maintaining insurance, regular healthcare
- **Chaotic behaviors**: Gambling, spontaneous entertainment, irregular travel
- **Income consistency**: Regular income → Lawful; Irregular income → Chaotic

#### Good 😇 vs Evil 😈
- **Good behaviors**: Charity donations, education, healthcare
- **Evil behaviors**: Excessive gambling (selfish), vanity spending (cosmetics overload)

**Possible Alignments:**
- Lawful Good, Lawful Neutral, Lawful Evil
- Neutral Good, True Neutral, Neutral Evil
- Chaotic Good, Chaotic Neutral, Chaotic Evil

### 2. 🐉 D&D Themed UI

The interface now features a classic Dungeons & Dragons aesthetic:

- **Color Scheme**: Black, purple, and green (inspired by old ASCII BBS games like LORD)
- **Visual Effects**: Glowing text, ethereal shadows, retro vibes
- **D&D Imagery**: Dragon and Beholder emojis decorating the background
- **Immersive Design**: Feel like you're opening an ancient spellbook!

### 3. 🔌 .NET Backend API Integration

The application now includes full support for Microsoft .NET backend integration:

#### Features:
- **CORS Enabled**: Cross-origin requests supported for external backends
- **RESTful API**: Standard HTTP endpoints for easy integration
- **Comprehensive Documentation**: See `DOTNET_API.md` for complete guide

#### Included Examples:
- HttpClient implementation (C#)
- Minimal API (.NET 6+)
- ASP.NET Core Web API Controller
- Docker deployment configuration
- Response model classes

### 4. 📊 New Spending Categories

Additional categories for better alignment tracking:

- **Gambling** 🎰: Casinos, sports betting, lottery (→ Chaotic/Evil)
- **Charity** ❤️: Donations, nonprofits (→ Good)
- **Taxes** 📋: Government fees, tax payments, licenses (→ Lawful)
- **Insurance** 🛡️: Insurance premiums (→ Lawful)

## Quick Start Guide

### View Your Character
1. Visit `http://localhost:3000`
2. Enter your name
3. Click "Generate Character Sheet"
4. See your alignment, stats, and class!

### API Integration
```bash
# Get character sheet
curl http://localhost:3000/api/character-sheet?name=YourName

# Get transactions
curl http://localhost:3000/api/transactions
```

### For .NET Developers
See `DOTNET_API.md` for complete integration guide with code examples.

## Example Character

**Name**: Adventurer  
**Class**: Cleric  
**Level**: 5  
**Alignment**: Lawful Neutral  

**Stats:**
- 💪 Strength: 12 (+1)
- 🏃 Dexterity: 12 (+1)
- ❤️ Constitution: 16 (+3)
- 🧠 Intelligence: 15 (+2)
- 📖 Wisdom: 27 (+8) ← Highest stat!
- ✨ Charisma: 12 (+1)

**Why Lawful Neutral?**
- High tax and insurance spending → Lawful
- Balanced good/evil behaviors → Neutral

**Why Cleric?**
- Highest Wisdom stat from book spending!

## Technical Details

### Alignment Calculation
The system uses a weighted scoring system:
- Each spending category contributes to alignment scores
- Income consistency affects Lawful/Chaotic axis
- Thresholds determine final alignment designation

### Theme Colors
- Background: Dark blue gradients (`#1a0a2e`, `#16213e`, `#0f3460`)
- Primary: Neon green (`#6aff6a`)
- Secondary: Purple (`#b19cd9`)
- Accents: Black with glowing effects

## Future Enhancements

Potential additions:
- More alignment-affecting categories
- Achievements and badges
- Historical alignment tracking
- Multi-user comparison
- Real open banking API integration

## Support

For questions or issues:
1. Check `README.md` for general information
2. Check `DOTNET_API.md` for .NET integration
3. Open an issue on GitHub

---

*May your spending be wise and your alignment true!* 🎲
