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
  { ticker: "AAPL", name: "Apple Inc.", price: 170.34, change: "+1.25", changePercent: "+0.74%", volume: "75M", market: "NASDAQ" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 420.72, change: "-0.50", changePercent: "-0.12%", volume: "22M", market: "NASDAQ" },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 150.10, change: "+2.80", changePercent: "+1.90%", volume: "30M", market: "NASDAQ" },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 180.55, change: "+0.15", changePercent: "+0.08%", volume: "45M", market: "NASDAQ" },
  { ticker: "BTC/USD", name: "Bitcoin", price: 65030.00, change: "+1200.00", changePercent: "+1.88%", volume: "35K", market: "Crypto" },
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
