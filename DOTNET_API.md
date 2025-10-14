# .NET Backend API Integration Guide

This document describes how to integrate the D&D Spending Tracker API with a Microsoft .NET backend for business extensions.

## 🔗 API Base URL

When running locally: `http://localhost:3000`

For production deployments, replace with your deployed API URL.

## 🔐 CORS Support

The API includes CORS (Cross-Origin Resource Sharing) support enabled by default, allowing .NET backend applications to make cross-origin requests.

## 📡 API Endpoints

### 1. Get Character Sheet

Generates a D&D character sheet based on spending patterns.

**Endpoint:** `GET /api/character-sheet`

**Query Parameters:**
- `name` (string, optional): The character/player name. Default: "Adventurer"
- `userId` (string, optional): User identifier for fetching transactions. Default: "demo-user"

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Adventurer",
    "level": 5,
    "stats": {
      "strength": 12,
      "dexterity": 12,
      "constitution": 18,
      "intelligence": 15,
      "wisdom": 27,
      "charisma": 12
    },
    "alignment": {
      "lawfulChaotic": "Neutral",
      "goodEvil": "Good",
      "full": "Neutral Good",
      "score": {
        "lawful": 15.54,
        "chaotic": 3.965,
        "good": 6.662,
        "evil": 0.6432
      }
    },
    "totalSpending": 5803.84,
    "spendingBreakdown": {
      "books": 1753.48,
      "cosmetics": 144.24,
      "gym": 110.00,
      "sports": 253.50,
      "food_health": 437.95,
      "technology": 999.00,
      "entertainment": 206.93,
      "travel": 498.25,
      "education": 61.99,
      "healthcare": 554.50,
      "gambling": 25.00,
      "charity": 150.00,
      "taxes": 609.00
    },
    "characterClass": "Cleric",
    "description": "A wise sage who seeks knowledge through books and continuous learning."
  },
  "transactionCount": 52
}
```

### 2. Get Transactions

Retrieves all categorized transactions from the past 6 months.

**Endpoint:** `GET /api/transactions`

**Query Parameters:**
- `userId` (string, optional): User identifier for fetching transactions. Default: "demo-user"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_1",
      "date": "2025-08-15T10:30:00.000Z",
      "amount": 45.99,
      "description": "Amazon Books - Kindle",
      "category": "books"
    },
    {
      "id": "txn_2",
      "date": "2025-09-20T14:22:00.000Z",
      "amount": 89.99,
      "description": "Sephora Cosmetics",
      "category": "cosmetics"
    }
  ]
}
```

## 🎯 Alignment System

The API now includes a D&D alignment calculation based on spending patterns:

### Alignment Axes

1. **Lawful vs Chaotic:**
   - **Lawful**: Spending on taxes, insurance, regular healthcare, organized payments
   - **Chaotic**: Gambling, spontaneous entertainment, irregular travel

2. **Good vs Evil:**
   - **Good**: Charity donations, healthcare, education
   - **Evil**: Excessive gambling (selfishness), excessive cosmetics (vanity)

### Income Consistency Factor

The alignment system also considers income transaction consistency:
- **Consistent income** (low variance) → Lawful tendency
- **Inconsistent income** (high variance) → Chaotic tendency

### Alignment Values

Possible alignment results:
- Lawful Good, Lawful Neutral, Lawful Evil
- Neutral Good, True Neutral, Neutral Evil
- Chaotic Good, Chaotic Neutral, Chaotic Evil

## 💼 .NET Integration Examples

### Example 1: HttpClient (C#)

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class DnDSpendingClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public DnDSpendingClient(string baseUrl = "http://localhost:3000")
    {
        _httpClient = new HttpClient();
        _baseUrl = baseUrl;
    }

    public async Task<CharacterSheetResponse> GetCharacterSheetAsync(string playerName, string userId = "demo-user")
    {
        var url = $"{_baseUrl}/api/character-sheet?name={Uri.EscapeDataString(playerName)}&userId={Uri.EscapeDataString(userId)}";
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<CharacterSheetResponse>(json);
    }

    public async Task<TransactionsResponse> GetTransactionsAsync(string userId = "demo-user")
    {
        var url = $"{_baseUrl}/api/transactions?userId={Uri.EscapeDataString(userId)}";
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<TransactionsResponse>(json);
    }
}

// Response models
public class CharacterSheetResponse
{
    public bool Success { get; set; }
    public CharacterSheetData Data { get; set; }
    public int TransactionCount { get; set; }
}

public class CharacterSheetData
{
    public string Name { get; set; }
    public int Level { get; set; }
    public DnDStats Stats { get; set; }
    public Alignment Alignment { get; set; }
    public double TotalSpending { get; set; }
    public Dictionary<string, double> SpendingBreakdown { get; set; }
    public string CharacterClass { get; set; }
    public string Description { get; set; }
}

public class DnDStats
{
    public int Strength { get; set; }
    public int Dexterity { get; set; }
    public int Constitution { get; set; }
    public int Intelligence { get; set; }
    public int Wisdom { get; set; }
    public int Charisma { get; set; }
}

public class Alignment
{
    public string LawfulChaotic { get; set; }
    public string GoodEvil { get; set; }
    public string Full { get; set; }
    public AlignmentScore Score { get; set; }
}

public class AlignmentScore
{
    public double Lawful { get; set; }
    public double Chaotic { get; set; }
    public double Good { get; set; }
    public double Evil { get; set; }
}

public class TransactionsResponse
{
    public bool Success { get; set; }
    public List<Transaction> Data { get; set; }
}

public class Transaction
{
    public string Id { get; set; }
    public DateTime Date { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
}
```

### Example 2: Minimal API (.NET 6+)

```csharp
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

var app = builder.Build();

app.MapGet("/business/character/{userId}", async (
    [FromRoute] string userId,
    [FromQuery] string? name,
    [FromServices] IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var dndApiUrl = "http://localhost:3000";
    
    var playerName = name ?? "Business User";
    var url = $"{dndApiUrl}/api/character-sheet?name={Uri.EscapeDataString(playerName)}&userId={Uri.EscapeDataString(userId)}";
    
    var response = await client.GetAsync(url);
    var content = await response.Content.ReadAsStringAsync();
    
    return Results.Content(content, "application/json");
});

app.Run();
```

### Example 3: ASP.NET Core Web API Controller

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

[ApiController]
[Route("api/[controller]")]
public class CharacterController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _dndApiBaseUrl;

    public CharacterController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _dndApiBaseUrl = configuration["DnDSpendingAPI:BaseUrl"] ?? "http://localhost:3000";
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCharacterSheet(string userId, [FromQuery] string? name)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var playerName = name ?? "Adventurer";
            var url = $"{_dndApiBaseUrl}/api/character-sheet?name={Uri.EscapeDataString(playerName)}&userId={Uri.EscapeDataString(userId)}";
            
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { error = "Failed to fetch character data", details = ex.Message });
        }
    }

    [HttpGet("{userId}/transactions")]
    public async Task<IActionResult> GetTransactions(string userId)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{_dndApiBaseUrl}/api/transactions?userId={Uri.EscapeDataString(userId)}";
            
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { error = "Failed to fetch transactions", details = ex.Message });
        }
    }
}
```

## ⚙️ Configuration

### appsettings.json (.NET Configuration)

```json
{
  "DnDSpendingAPI": {
    "BaseUrl": "http://localhost:3000",
    "Timeout": 30
  }
}
```

### Startup Configuration

```csharp
// Program.cs or Startup.cs
builder.Services.AddHttpClient("DnDSpendingAPI", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["DnDSpendingAPI:BaseUrl"]);
    client.Timeout = TimeSpan.FromSeconds(
        builder.Configuration.GetValue<int>("DnDSpendingAPI:Timeout"));
});
```

## 🔒 Security Considerations

1. **Authentication**: Currently, the API uses a simple `userId` parameter. For production, implement proper authentication (JWT, OAuth, etc.)

2. **Rate Limiting**: Consider implementing rate limiting on the .NET backend to prevent API abuse

3. **API Key**: Add API key validation for production deployments

4. **HTTPS**: Always use HTTPS in production environments

## 🚀 Deployment

### Docker Support

The D&D Spending Tracker can be containerized and deployed alongside your .NET application:

```yaml
# docker-compose.yml
version: '3.8'
services:
  dnd-api:
    build: ./DnDSpending
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
  
  dotnet-backend:
    build: ./YourDotNetApp
    ports:
      - "5000:80"
    environment:
      - DnDSpendingAPI__BaseUrl=http://dnd-api:3000
    depends_on:
      - dnd-api
```

## 📊 Business Extension Ideas

1. **Customer Engagement**: Show customers their "financial character" to make banking more engaging
2. **Financial Insights**: Use alignment and stats to provide personalized financial advice
3. **Gamification**: Create achievements and rewards based on character progression
4. **Comparative Analytics**: Compare user spending patterns (anonymized) across demographics
5. **Budget Goals**: Set goals to increase certain "stats" (e.g., improve Wisdom by increasing book spending)

## 🛠️ Troubleshooting

### CORS Issues

If experiencing CORS errors, ensure:
1. The API server has CORS enabled (already configured)
2. Your .NET app is not blocking cross-origin requests
3. Check browser console for specific CORS error messages

### Connection Refused

If the .NET app cannot connect:
1. Verify the API is running: `curl http://localhost:3000/api/character-sheet?name=Test`
2. Check firewall settings
3. Ensure correct base URL in configuration

## 📞 Support

For issues or questions regarding API integration, please open an issue on the GitHub repository.
