import { PageTitle } from '@/components/page-title';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface FeatureInfo {
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
  imageSrc: string;
  imageAlt: string;
  imageHint: string;
}

const features: FeatureInfo[] = [
  {
    title: 'AI Visualizations',
    description: 'Generate optimal charts for backtesting results and portfolio performance with AI-powered suggestions.',
    link: '/ai-visualizations',
    icon: BrainCircuit,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'AI analyzing financial charts',
    imageHint: 'financial charts'
  },
  {
    title: 'Risk Analytics',
    description: 'Assess portfolio VaR and CVaR. Stress-test your strategies and manage risk effectively.',
    link: '/risk-analytics',
    icon: ShieldCheck,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Risk assessment dashboard',
    imageHint: 'risk dashboard'
  },
  {
    title: 'Real-Time Data Feeds',
    description: 'Access real-time stock data from various financial APIs. Supports multiple financial instruments.',
    link: '/real-time-data',
    icon: LineChart,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Real-time stock market data stream',
    imageHint: 'stock market'
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageTitle
        title="Welcome to QuantPulse"
        description="Your comprehensive financial modeling and algorithmic trading engine."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <div className="relative h-48 w-full">
              <Image
                src={feature.imageSrc}
                alt={feature.imageAlt}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={feature.imageHint}
              />
            </div>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <feature.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.link}>
                  Explore Feature <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>A snapshot of your current portfolio performance and key metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold text-primary">$1,567,890.12</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day's Gain/Loss</p>
              <p className="text-2xl font-semibold text-destructive">-$5,123.45</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Return</p>
              <p className="text-2xl font-semibold text-accent-foreground">+23.50%</p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full rounded-lg bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Portfolio Performance Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
