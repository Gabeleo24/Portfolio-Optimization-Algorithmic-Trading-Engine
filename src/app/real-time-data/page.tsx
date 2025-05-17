
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Search, Settings2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real-Time Data',
  description: 'Access and monitor real-time financial market data.',
};

const sampleInstruments = [
  { ticker: "^GSPC", name: "S&P 500 Index", price: 5430.80, change: "+22.10", changePercent: "+0.41%", volume: "2.8B", market: "INDEX" },
  { ticker: "^IXIC", name: "NASDAQ Composite", price: 17650.20, change: "+135.50", changePercent: "+0.77%", volume: "5.3B", market: "INDEX" },
  { ticker: "AAPL", name: "Apple Inc.", price: 215.04, change: "+1.98", changePercent: "+0.93%", volume: "70M", market: "NASDAQ" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 440.50, change: "-0.75", changePercent: "-0.17%", volume: "22M", market: "NASDAQ" },
  { ticker: "GOOGL", name: "Alphabet Inc. C", price: 178.20, change: "+1.12", changePercent: "+0.63%", volume: "26M", market: "NASDAQ" },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 185.60, change: "-1.05", changePercent: "-0.56%", volume: "48M", market: "NASDAQ" },
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 130.70, change: "+4.25", changePercent: "+3.36%", volume: "150M", market: "NASDAQ" },
  { ticker: "TSLA", name: "Tesla, Inc.", price: 182.30, change: "+2.80", changePercent: "+1.56%", volume: "90M", market: "NASDAQ" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 542.50, change: "+2.10", changePercent: "+0.39%", volume: "75M", market: "ARCA" },
  { ticker: "BTC/USD", name: "Bitcoin", price: 65890.00, change: "-1200.00", changePercent: "-1.79%", volume: "38K", market: "Crypto" },
  { ticker: "ETH/USD", name: "Ethereum", price: 3540.00, change: "+25.50", changePercent: "+0.73%", volume: "1.1M", market: "Crypto" },
];

export default function RealTimeDataPage() {
  return (
    <>
      <PageTitle
        title="Real-Time Market Data"
        description="Monitor live financial instrument data, track price movements, and analyze trading volumes."
        actions={<Button variant="outline"><Settings2 className="mr-2 h-4 w-4" />Configure Data Feeds</Button>}
      />
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Market Overview Chart</CardTitle>
          <CardDescription>Visual representation of key market indices or selected instruments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full rounded-lg bg-muted flex items-center justify-center">
             <Image src="https://placehold.co/800x400.png" alt="Market overview chart of major indices" width={800} height={400} className="rounded-lg object-cover" data-ai-hint="market indices"/>
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
                Track your selected financial instruments in real-time.
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
              {sampleInstruments.map((instrument) => (
                <TableRow key={instrument.ticker}>
                  <TableCell className="font-medium">{instrument.ticker}</TableCell>
                  <TableCell>{instrument.name}</TableCell>
                  <TableCell className="text-right">${instrument.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
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
