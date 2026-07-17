import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// ============================================
// 1. Crypto Prices - con fallback
// ============================================
export const getCryptoPrices = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
      }));
    } catch (error: any) {
      console.error("Error fetching crypto prices:", error);
      // ✅ Devolver datos de ejemplo en caso de error
      return getMockCryptoData();
    }
  });

// Datos de ejemplo para criptos
function getMockCryptoData() {
  return [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 64120, marketCap: 1286000000000, volume: 28000000000, change24h: -1.2, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", high24h: 65000, low24h: 64000 },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 1878, marketCap: 226600000000, volume: 15000000000, change24h: -2.5, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", high24h: 1920, low24h: 1870 },
    { id: "tether", symbol: "USDT", name: "Tether", price: 1, marketCap: 184000000000, volume: 80000000000, change24h: 0, image: "https://assets.coingecko.com/coins/images/325/small/Tether.png", high24h: 1, low24h: 1 },
    { id: "bnb", symbol: "BNB", name: "BNB", price: 575, marketCap: 76700000000, volume: 2000000000, change24h: -0.8, image: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2.png", high24h: 580, low24h: 570 },
    { id: "usd-coin", symbol: "USDC", name: "USDC", price: 1, marketCap: 73250000000, volume: 6000000000, change24h: 0, image: "https://assets.coingecko.com/coins/images/6319/small/USDC.png", high24h: 1, low24h: 1 },
    { id: "xrp", symbol: "XRP", name: "XRP", price: 1.09, marketCap: 68500000000, volume: 3000000000, change24h: -2.1, image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol.png", high24h: 1.12, low24h: 1.08 },
    { id: "solana", symbol: "SOL", name: "Solana", price: 75.8, marketCap: 44200000000, volume: 2500000000, change24h: -2.5, image: "https://assets.coingecko.com/coins/images/4128/small/solana.png", high24h: 78, low24h: 75 },
    { id: "tron", symbol: "TRX", name: "TRON", price: 0.323, marketCap: 30600000000, volume: 1000000000, change24h: -0.3, image: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png", high24h: 0.325, low24h: 0.32 },
  ];
}

// ============================================
// 2. Fear & Greed Index
// ============================================
export const getFearGreedIndex = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await fetch("https://api.alternative.me/fng/");
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error("No Fear & Greed data available");
      }

      const latest = data.data[0];
      return {
        current: {
          value: parseInt(latest.value),
          classification: latest.value_classification,
        },
      };
    } catch (error: any) {
      console.error("Error fetching Fear & Greed index:", error);
      // ✅ Devolver datos de ejemplo
      return {
        current: {
          value: 45,
          classification: "Neutral",
        },
      };
    }
  });

// ============================================
// 3. Stock Price - con fallback
// ============================================
export const getStockPrice = createServerFn({ method: "GET" })
  .validator((d: { symbol: string }) => z.object({ symbol: z.string().min(1).max(10) }).parse(d))
  .handler(async ({ data }) => {
    const { symbol } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      return getMockStockData(symbol);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        console.warn(`Alpha Vantage error for ${symbol}:`, result["Error Message"]);
        return getMockStockData(symbol);
      }

      const quote = result["Global Quote"];
      if (!quote || Object.keys(quote).length === 0) {
        return getMockStockData(symbol);
      }

      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: quote["10. change percent"],
        volume: parseInt(quote["06. volume"]),
        high: parseFloat(quote["03. high"]),
        low: parseFloat(quote["04. low"]),
        open: parseFloat(quote["02. open"]),
        previousClose: parseFloat(quote["08. previous close"]),
      };
    } catch (error: any) {
      console.error("Error fetching stock price:", error);
      return getMockStockData(symbol);
    }
  });

// Datos de ejemplo para acciones
function getMockStockData(symbol: string) {
  const mockData: Record<string, any> = {
    AAPL: { symbol: "AAPL", price: 333.26, change: 5.76, changePercent: "+1.76%", volume: 62500000, high: 334.68, low: 326.79, open: 328.00, previousClose: 327.50 },
    TSLA: { symbol: "TSLA", price: 245.50, change: 2.30, changePercent: "+0.95%", volume: 45000000, high: 248.00, low: 242.00, open: 243.50, previousClose: 243.20 },
    MSFT: { symbol: "MSFT", price: 425.80, change: 3.20, changePercent: "+0.76%", volume: 32000000, high: 428.00, low: 422.00, open: 423.00, previousClose: 422.60 },
    GOOGL: { symbol: "GOOGL", price: 185.60, change: 1.20, changePercent: "+0.65%", volume: 28000000, high: 187.00, low: 184.00, open: 184.50, previousClose: 184.40 },
    AMZN: { symbol: "AMZN", price: 198.50, change: 2.80, changePercent: "+1.43%", volume: 35000000, high: 200.00, low: 196.00, open: 197.00, previousClose: 195.70 },
    NVDA: { symbol: "NVDA", price: 125.80, change: 1.50, changePercent: "+1.21%", volume: 40000000, high: 127.00, low: 124.00, open: 124.50, previousClose: 124.30 },
  };
  
  const data = mockData[symbol] || { symbol, price: 100.00, change: 0, changePercent: "0%", volume: 1000000, high: 101, low: 99, open: 100, previousClose: 100 };
  return data;
}

// ============================================
// 4. Search Stocks
// ============================================
export const searchStocks = createServerFn({ method: "GET" })
  .validator((d: { query: string }) => z.object({ query: z.string().min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    const { query } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      return getMockSearchResults(query);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        console.warn("Alpha Vantage search error:", result["Error Message"]);
        return getMockSearchResults(query);
      }

      const matches = result["bestMatches"] || [];
      if (matches.length === 0) {
        return getMockSearchResults(query);
      }

      return matches.slice(0, 10).map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
      }));
    } catch (error: any) {
      console.error("Error searching stocks:", error);
      return getMockSearchResults(query);
    }
  });

// Resultados de ejemplo para búsqueda
function getMockSearchResults(query: string) {
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", type: "Equity", region: "United States" },
    { symbol: "TSLA", name: "Tesla Inc.", type: "Equity", region: "United States" },
    { symbol: "MSFT", name: "Microsoft Corporation", type: "Equity", region: "United States" },
    { symbol: "GOOGL", name: "Alphabet Inc.", type: "Equity", region: "United States" },
    { symbol: "AMZN", name: "Amazon.com Inc.", type: "Equity", region: "United States" },
    { symbol: "NVDA", name: "NVIDIA Corporation", type: "Equity", region: "United States" },
    { symbol: "META", name: "Meta Platforms Inc.", type: "Equity", region: "United States" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", type: "Equity", region: "United States" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF", type: "ETF", region: "United States" },
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "ETF", region: "United States" },
  ];

  const filtered = popularStocks.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.length > 0 ? filtered : popularStocks.slice(0, 5);
}

// ============================================
// 5. ETF Screener
// ============================================
export const searchETF = createServerFn({ method: "GET" })
  .validator((d: { query: string }) => z.object({ query: z.string().min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    const { query } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      return getMockETFResults(query);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        console.warn("Alpha Vantage ETF search error:", result["Error Message"]);
        return getMockETFResults(query);
      }

      const matches = result["bestMatches"] || [];
      return matches
        .filter((match: any) => match["3. type"] === "ETF")
        .slice(0, 10)
        .map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          type: match["3. type"],
          region: match["4. region"],
        }));
    } catch (error: any) {
      console.error("Error searching ETFs:", error);
      return getMockETFResults(query);
    }
  });

// Resultados de ejemplo para ETFs
function getMockETFResults(query: string) {
  const popularETFs = [
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "ETF", region: "United States" },
    { symbol: "IVV", name: "iShares Core S&P 500 ETF", type: "ETF", region: "United States" },
    { symbol: "VOO", name: "Vanguard S&P 500 ETF", type: "ETF", region: "United States" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", type: "ETF", region: "United States" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF", type: "ETF", region: "United States" },
    { symbol: "BND", name: "Vanguard Total Bond Market ETF", type: "ETF", region: "United States" },
    { symbol: "VXUS", name: "Vanguard Total International Stock ETF", type: "ETF", region: "United States" },
    { symbol: "IWF", name: "iShares Russell 1000 Growth ETF", type: "ETF", region: "United States" },
    { symbol: "IWM", name: "iShares Russell 2000 ETF", type: "ETF", region: "United States" },
    { symbol: "XLK", name: "Technology Select Sector SPDR Fund", type: "ETF", region: "United States" },
  ];

  const filtered = popularETFs.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.length > 0 ? filtered : popularETFs.slice(0, 5);
}

// ============================================
// 6. Dividend Data
// ============================================
export const getDividendData = createServerFn({ method: "GET" })
  .validator((d: { symbol: string }) => z.object({ symbol: z.string().min(1).max(10) }).parse(d))
  .handler(async ({ data }) => {
    const { symbol } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      return getMockDividendData(symbol);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        console.warn("Alpha Vantage dividend error:", result["Error Message"]);
        return getMockDividendData(symbol);
      }

      const priceData = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const priceResult = await priceData.json();
      const quote = priceResult["Global Quote"] || {};

      return {
        symbol: result.Symbol || symbol,
        name: result.Name || symbol,
        dividendYield: result.DividendYield || "0",
        dividendPerShare: result.DividendPerShare || "0",
        payoutRatio: result.PayoutRatio || "0",
        exDividendDate: result.ExDividendDate || "N/A",
        dividendDate: result.DividendDate || "N/A",
        price: parseFloat(quote["05. price"]) || 0,
        change: parseFloat(quote["09. change"]) || 0,
        changePercent: quote["10. change percent"] || "0%",
      };
    } catch (error: any) {
      console.error("Error fetching dividend data:", error);
      return getMockDividendData(symbol);
    }
  });

// Datos de ejemplo para dividendos
function getMockDividendData(symbol: string) {
  const mockData: Record<string, any> = {
    AAPL: { symbol: "AAPL", name: "Apple Inc.", dividendYield: "1.2", dividendPerShare: "0.25", payoutRatio: "25", exDividendDate: "2026-08-10", dividendDate: "2026-08-25" },
    KO: { symbol: "KO", name: "Coca-Cola Co.", dividendYield: "3.5", dividendPerShare: "0.48", payoutRatio: "45", exDividendDate: "2026-07-20", dividendDate: "2026-08-05" },
    JNJ: { symbol: "JNJ", name: "Johnson & Johnson", dividendYield: "2.8", dividendPerShare: "1.20", payoutRatio: "40", exDividendDate: "2026-07-15", dividendDate: "2026-08-01" },
  };
  
  const data = mockData[symbol] || { symbol, name: symbol, dividendYield: "2.0", dividendPerShare: "0.50", payoutRatio: "30", exDividendDate: "N/A", dividendDate: "N/A" };
  return { ...data, price: 100, change: 0, changePercent: "0%" };
}

// ============================================
// 7. Popular ETFs
// ============================================
export const getPopularETFs = createServerFn({ method: "GET" })
  .handler(async () => {
    const popularETFs = ["SPY", "IVV", "VOO", "QQQ", "VTI", "BND", "VXUS", "IWF", "IWM", "XLK"];
    const results = [];

    for (const symbol of popularETFs) {
      try {
        const data = await getStockPrice({ data: { symbol } });
        results.push({
          symbol: data.symbol,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          volume: data.volume,
        });
      } catch (error) {
        console.error(`Error fetching ETF ${symbol}:`, error);
        results.push({
          symbol,
          price: 100,
          change: 0,
          changePercent: "0%",
          volume: 0,
        });
      }
    }
    return results;
  });

// ============================================
// 8. Economic Calendar
// ============================================
export const getEconomicCalendar = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      if (!ALPHA_VANTAGE_API_KEY) {
        return getMockEconomicData();
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        console.warn("Alpha Vantage economic calendar error:", result["Error Message"]);
        return getMockEconomicData();
      }

      const feed = result["feed"] || [];
      if (feed.length === 0) {
        return getMockEconomicData();
      }

      return feed.slice(0, 10).map((item: any) => ({
        title: item.title,
        summary: item.summary,
        source: item.source,
        url: item.url,
        time: item.time_published,
        sentiment: item.overall_sentiment_score,
        topics: item.topics?.map((t: any) => t.topic) || [],
      }));
    } catch (error: any) {
      console.error("Error fetching economic calendar:", error);
      return getMockEconomicData();
    }
  });

// Datos de ejemplo para el calendario económico
function getMockEconomicData() {
  const today = new Date();
  return [
    {
      title: "Federal Reserve Interest Rate Decision",
      summary: "The Fed announces its decision on interest rates, with markets expecting a 0.25% cut.",
      source: "Federal Reserve",
      time: today.toISOString(),
      sentiment: 0.2,
      topics: ["Interest Rates", "Monetary Policy"],
    },
    {
      title: "US GDP Growth Report",
      summary: "Q3 GDP growth comes in at 2.5%, beating expectations of 2.3%.",
      source: "Bureau of Economic Analysis",
      time: new Date(today.getTime() + 86400000).toISOString(),
      sentiment: 0.3,
      topics: ["GDP", "Economy"],
    },
    {
      title: "Employment Situation Report",
      summary: "Jobs report shows 250,000 new jobs added, unemployment rate drops to 4.0%.",
      source: "Bureau of Labor Statistics",
      time: new Date(today.getTime() + 172800000).toISOString(),
      sentiment: 0.4,
      topics: ["Jobs", "Employment"],
    },
    {
      title: "CPI Inflation Data",
      summary: "Consumer Price Index rises 0.2% month-over-month, core CPI up 2.8% year-over-year.",
      source: "Bureau of Labor Statistics",
      time: new Date(today.getTime() + 259200000).toISOString(),
      sentiment: -0.1,
      topics: ["Inflation", "CPI"],
    },
    {
      title: "Bank of England Interest Rate Decision",
      summary: "Bank of England holds rates steady at 5.25%, citing persistent inflation concerns.",
      source: "Bank of England",
      time: new Date(today.getTime() + 345600000).toISOString(),
      sentiment: 0.1,
      topics: ["Interest Rates", "Bank of England"],
    },
  ];
}