import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// ============================================
// 1. Stock Dashboard - Obtener precio de acciones
// ============================================
export const getStockPrice = createServerFn({ method: "GET" })
  .validator((d: { symbol: string }) => z.object({ symbol: z.string().min(1).max(10) }).parse(d))
  .handler(async ({ data }) => {
    const { symbol } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        throw new Error(result["Error Message"]);
      }

      const quote = result["Global Quote"];
      if (!quote) {
        throw new Error("No data found for this symbol");
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
      throw new Error(error?.message || "Failed to fetch stock data");
    }
  });

// ============================================
// 2. Crypto Dashboard - Obtener criptomonedas
// ============================================
export const getCryptoPrices = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      // Usar CoinGecko API (gratis, sin clave)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch crypto data");
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
      throw new Error(error?.message || "Failed to fetch crypto data");
    }
  });

// ============================================
// 3. Fear & Greed Index
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
      const value = parseInt(latest.value);
      const classification = latest.value_classification;

      // Obtener historial (últimos 30 días)
      const historyResponse = await fetch("https://api.alternative.me/fng/?limit=30");
      const historyData = await historyResponse.json();

      const history = historyData.data.map((item: any) => ({
        date: item.timestamp,
        value: parseInt(item.value),
        classification: item.value_classification,
      }));

      return {
        current: {
          value,
          classification,
        },
        history: history.reverse(),
      };
    } catch (error: any) {
      console.error("Error fetching Fear & Greed index:", error);
      throw new Error(error?.message || "Failed to fetch Fear & Greed index");
    }
  });

// ============================================
// 4. Stock Screener (básico)
// ============================================
export const searchStocks = createServerFn({ method: "GET" })
  .validator((d: { query: string }) => z.object({ query: z.string().min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    const { query } = data;

    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();

      if (result["Error Message"]) {
        throw new Error(result["Error Message"]);
      }

      const matches = result["bestMatches"] || [];
      return matches.slice(0, 10).map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
      }));
    } catch (error: any) {
      console.error("Error searching stocks:", error);
      throw new Error(error?.message || "Failed to search stocks");
    }
  });