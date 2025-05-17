
"use client";

import { useEffect, useState, useCallback } from 'react';
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Search, Settings2, Zap, Brain, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { transformMarketData } from "@/lib/market-data";
import Script from "next/script";

// Define instrument type
interface Instrument {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: string;
  changePercent: string;
  volume: string;
  market: string;
}

// TradingView Widget Component
const TradingViewWidget = () => {
  useEffect(() => {
    // Create TradingView widget when component mounts
    const script = document.createElement('script');
    script.innerHTML = `
      new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": false,
        "studies": [
          "Volume@tv-basicstudies"
        ],
        "container_id": "tradingview_widget_symbol_overview"
      });
    `;
    
    // Only add the script if the container exists and TradingView is loaded
    const container = document.getElementById('tradingview_widget_symbol_overview');
    if (container && window.TradingView) {
      document.body.appendChild(script);
    }
    
    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <div id="tradingview_widget_symbol_overview" className="h-[700px] w-full"></div>
      <p className="text-center text-muted-foreground mt-2 text-xs">
        Market data provided by TradingView.
      </p>
    </>
  );
};

const initialInstruments = [
  { id: "sp500", ticker: "^GSPC", name: "S&P 500 Index", price: 5430.80, change: "+22.10", changePercent: "+0.41%", volume: "2.8B", market: "INDEX" },
  { id: "nasdaq", ticker: "^IXIC", name: "NASDAQ Composite", price: 17650.20, change: "+135.50", changePercent: "+0.77%", volume: "5.3B", market: "INDEX" },
  { id: "aapl", ticker: "AAPL", name: "Apple Inc.", price: 215.04, change: "+1.98", changePercent: "+0.93%", volume: "70M", market: "NASDAQ" },
  { id: "msft", ticker: "MSFT", name: "Microsoft Corp.", price: 440.50, change: "-0.75", changePercent: "-0.17%", volume: "22M", market: "NASDAQ" },
  { id: "googl", ticker: "GOOGL", name: "Alphabet Inc. C", price: 178.20, change: "+1.12", changePercent: "+0.63%", volume: "26M", market: "NASDAQ" },
  { id: "amzn", ticker: "AMZN", name: "Amazon.com Inc.", price: 185.60, change: "-1.05", changePercent: "-0.56%", volume: "48M", market: "NASDAQ" },
  { id: "nvda", ticker: "NVDA", name: "NVIDIA Corporation", price: 130.70, change: "+4.25", changePercent: "+3.36%", volume: "150M", market: "NASDAQ" },
  { id: "tsla", ticker: "TSLA", name: "Tesla, Inc.", price: 182.30, change: "+2.80", changePercent: "+1.56%", volume: "90M", market: "NASDAQ" },
  { id: "spy", ticker: "SPY", name: "SPDR S&P 500 ETF", price: 542.50, change: "+2.10", changePercent: "+0.39%", volume: "75M", market: "ARCA" },
  { id: "btc", ticker: "BTC/USD", name: "Bitcoin", price: 65890.00, change: "-1200.00", changePercent: "-1.79%", volume: "38K", market: "Crypto" },
  { id: "eth", ticker: "ETH/USD", name: "Ethereum", price: 3540.00, change: "+25.50", changePercent: "+0.73%", volume: "1.1M", market: "Crypto" },
];

const sampleInsights = [
  { id: 1, ticker: "NVDA", signal: "Strong Buy", reason: "Sustained momentum and positive earnings forecast.", type: "Technical" },
  { id: 2, ticker: "^GSPC", signal: "Neutral", reason: "Market consolidating after recent gains. Watch for key support levels.", type: "Market" },
  { id: 3, ticker: "AAPL", signal: "Accumulate", reason: "Potential product cycle upside. Favorable risk/reward.", type: "Fundamental" },
  { id: 4, ticker: "BTC/USD", signal: "Hold", reason: "Increased volatility expected. Awaiting clearer trend.", type: "Crypto" },
];


export default function RealTimeDataPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch market data - defined outside useEffect for reusability
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      
      // For development testing with a real API
      const symbols = initialInstruments.map(i => i.ticker).join(',');
      
      try {
        // Using Alpha Vantage API as an example (you'll need to sign up for a free API key)
        const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
        const endpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbols=${symbols}&apikey=${apiKey}`;
        
        console.log('Fetching data from:', endpoint);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Process the API response
        if (data && !data.Note) { // Alpha Vantage returns a Note property when rate limited
          // Transform the API response to our format
          const updatedInstruments = processAlphaVantageData(data, initialInstruments);
          setInstruments(updatedInstruments);
          setError(null);
        } else if (data.Note) {
          // Handle API rate limiting
          console.warn('API rate limit reached:', data.Note);
          throw new Error('API rate limit reached. Using sample data instead.');
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError(`${apiError.message}. Using sample data.`);
        
        // Use sample data with slight random variations to simulate real-time changes
        const randomizedData = initialInstruments.map(instrument => {
          // Add small random price changes to simulate live data
          const priceChange = (Math.random() * 2 - 1) * (instrument.price * 0.005); // ±0.5% change
          const newPrice = instrument.price + priceChange;
          const changeValue = parseFloat(instrument.change.replace(/[+\-$]/g, '')) + priceChange;
          const percentChange = (changeValue / (newPrice - changeValue)) * 100;
          
          return {
            ...instrument,
            price: newPrice,
            change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}`,
            changePercent: `${priceChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
          };
        });
        
        setInstruments(randomizedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Using sample data.');
      setInstruments(initialInstruments);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add this function to process Alpha Vantage data
  const processAlphaVantageData = (apiData, baseInstruments) => {
    const result = [...baseInstruments];
    
    // Alpha Vantage returns data in a specific format we need to parse
    Object.keys(apiData).forEach(key => {
      if (key.includes('Global Quote')) {
        const quote = apiData[key];
        const symbol = quote['01. symbol'];
        
        // Find the matching instrument in our data
        const instrumentIndex = result.findIndex(i => i.ticker === symbol);
        if (instrumentIndex >= 0) {
          const price = parseFloat(quote['05. price']);
          const change = parseFloat(quote['09. change']);
          const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
          
          result[instrumentIndex] = {
            ...result[instrumentIndex],
            price: price,
            change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`,
            changePercent: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          };
        }
      }
    });
    
    return result;
  };

  useEffect(() => {
    // Initial fetch
    fetchMarketData();
    
    // Set up polling interval - more frequent for a real-time feel
    const interval = setInterval(fetchMarketData, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Transform API response to our instrument format
  const transformApiData = (apiData: any): Instrument[] => {
    // This function would transform the API's response format to match our Instrument interface
    // Implementation depends on the actual API response structure
    
    // For now, returning sample data
    return initialInstruments;
  };

  return (
    <>
      <Script src="https://s3.tradingview.com/tv.js" strategy="afterInteractive" />
      <PageTitle
        title="Real-Time Market Data & Insights"
        description="Monitor live financial instrument data, track price movements, analyze trading volumes, and view simulated AI-driven market insights."
        actions={<Button variant="outline"><Settings2 className="mr-2 h-4 w-4" />Configure Data Feeds</Button>}
      />
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Market Overview Chart</CardTitle>
          <CardDescription>Interactive chart powered by TradingView</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden">
            <TradingViewWidget />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI-Driven Market Insights (Simulated)
          </CardTitle>
          <CardDescription>Conceptual AI-generated signals and market predictions. For illustrative purposes only.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sampleInsights.map(insight => (
              <Card key={insight.id} className="bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{insight.ticker}: <span className={insight.signal.includes("Buy") || insight.signal.includes("Accumulate") ? "text-accent-foreground" : insight.signal.includes("Sell") ? "text-destructive" : "text-foreground"}>{insight.signal}</span></CardTitle>
                  <Badge variant="outline" className="mt-1 w-fit">{insight.type}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-6 w-6 text-primary" />
                Instrument Watchlist
              </CardTitle>
              <CardDescription>
                Track your selected financial instruments in real-time. Key indices show simulated live updates.
              </CardDescription>
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search instruments..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Change %</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Market</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Show loading skeletons
                (Array(5).fill(0).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                )))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                instruments.map((instrument) => (
                  <TableRow key={instrument.id}>
                    <TableCell className="font-medium">{instrument.ticker}</TableCell>
                    <TableCell>{instrument.name}</TableCell>
                    <TableCell className="text-right">
                      ${instrument.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      {(instrument.id === "sp500" || instrument.id === "nasdaq") && <Zap className="ml-1 inline-block h-3 w-3 text-primary animate-pulse" />}
                    </TableCell>
                    <TableCell className={`text-right ${instrument.change.startsWith('+') ? 'text-accent-foreground' : 'text-destructive'}`}>
                      {instrument.change}
                    </TableCell>
                    <TableCell className={`text-right ${instrument.changePercent.startsWith('+') ? 'text-accent-foreground' : 'text-destructive'}`}>
                      {instrument.changePercent}
                    </TableCell>
                    <TableCell className="text-right">{instrument.volume}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={instrument.market === "Crypto" || instrument.market === "INDEX" ? "secondary" : "outline"}>{instrument.market}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button>Add Instrument</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
