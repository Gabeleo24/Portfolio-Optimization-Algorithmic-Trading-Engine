// Market data utilities

export interface MarketDataResponse {
  // Define based on your chosen API's response structure
  symbols: Array<{
    symbol: string;
    price: number;
    change: number;
    percentChange: number;
    volume: number;
    // other fields...
  }>;
}

export interface Instrument {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: string;
  changePercent: string;
  volume: string;
  market: string;
}

// Map of ticker symbols to instrument names and markets
export const instrumentMeta: Record<string, { name: string; market: string }> = {
  "^GSPC": { name: "S&P 500 Index", market: "INDEX" },
  "^IXIC": { name: "NASDAQ Composite", market: "INDEX" },
  "AAPL": { name: "Apple Inc.", market: "NASDAQ" },
  "MSFT": { name: "Microsoft Corp.", market: "NASDAQ" },
  // Add more instruments as needed
};

// Transform API data to our application format
export function transformMarketData(apiData: MarketDataResponse): Instrument[] {
  return apiData.symbols.map(item => {
    const meta = instrumentMeta[item.symbol] || { 
      name: item.symbol, 
      market: "UNKNOWN" 
    };
    
    return {
      id: item.symbol.toLowerCase().replace(/[^a-z0-9]/g, ''),
      ticker: item.symbol,
      name: meta.name,
      price: item.price,
      change: `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}`,
      changePercent: `${item.percentChange >= 0 ? '+' : ''}${item.percentChange.toFixed(2)}%`,
      volume: formatVolume(item.volume),
      market: meta.market
    };
  });
}

// Format large numbers for volume display
function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toString();
}