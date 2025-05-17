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
  { ticker: "AAPL", name: "Apple Inc.", price: 172.50, change: "+2.15", changePercent: "+1.26%", volume: "68M", market: "NASDAQ" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 418.90, change: "-1.30", changePercent: "-0.31%", volume: "25M", market: "NASDAQ" },
  { ticker: "GOOGL", name: "Alphabet Inc. C", price: 155.60, change: "+0.45", changePercent: "+0.29%", volume: "28M", market: "NASDAQ" },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 182.10, change: "-0.95", changePercent: "-0.52%", volume: "50M", market: "NASDAQ" },
  { ticker: "TSLA", name: "Tesla, Inc.", price: 175.80, change: "+3.50", changePercent: "+2.03%", volume: "95M", market: "NASDAQ" },
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 903.50, change: "+12.75", changePercent: "+1.43%", volume: "45M", market: "NASDAQ" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 510.20, change: "+1.80", changePercent: "+0.35%", volume: "85M", market: "ARCA" },
  { ticker: "BTC/USD", name: "Bitcoin", price: 67250.00, change: "-850.00", changePercent: "-1.25%", volume: "42K", market: "Crypto" },
  { ticker: "ETH/USD", name: "Ethereum", price: 3480.00, change: "+55.00", changePercent: "+1.60%", volume: "1.2M", market: "Crypto" },
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
             <Image src="https://placehold.co/800x400.png" alt="Market overview chart" width={800} height={400} className="rounded-lg object-cover" data-ai-hint="stock chart"/>
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
                    <Badge variant={instrument.market === "Crypto" ? "secondary" : "outline"}>{instrument.market}</Badge>
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
