
"use client";

import { useEffect, useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Search, Settings2, Zap, Brain } from "lucide-react";
import Image from "next/image";
// Note: Metadata is typically defined in Server Components or page.js/layout.js for App Router.
// Since this is now a client component, metadata should be handled in a parent Server Component or layout if needed.
// export const metadata: Metadata = {
// title: 'Real-Time Data',
// description: 'Access and monitor real-time financial market data.',
// };

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
  const [instruments, setInstruments] = useState(initialInstruments);

  useEffect(() => {
    const interval = setInterval(() => {
      setInstruments(prevInstruments =>
        prevInstruments.map(inst => {
          if (inst.id === "sp500" || inst.id === "nasdaq") {
            const priceChange = (Math.random() - 0.5) * (inst.price * 0.001); // Smaller, more realistic changes
            const newPrice = parseFloat((inst.price + priceChange).toFixed(2));
            const changeValue = parseFloat((newPrice - (inst.price - parseFloat(inst.change))).toFixed(2));
            const changePercentValue = parseFloat(((changeValue / (newPrice - changeValue)) * 100).toFixed(2));

            return {
              ...inst,
              price: newPrice,
              change: `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}`,
              changePercent: `${changePercentValue >= 0 ? '+' : ''}${changePercentValue.toFixed(2)}%`,
            };
          }
          return inst;
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <PageTitle
        title="Real-Time Market Data & Insights"
        description="Monitor live financial instrument data, track price movements, analyze trading volumes, and view simulated AI-driven market insights."
        actions={<Button variant="outline"><Settings2 className="mr-2 h-4 w-4" />Configure Data Feeds</Button>}
      />
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Market Overview Chart</CardTitle>
          <CardDescription>Visual representation of key market indices or selected instruments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full rounded-lg bg-muted flex items-center justify-center">
             <Image src="https://placehold.co/800x400.png" alt="Market overview chart showing S&P 500 and NASDAQ trends" width={800} height={400} className="rounded-lg object-cover" data-ai-hint="S&P500 NASDAQ"/>
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
              {instruments.map((instrument) => (
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
              ))}
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
