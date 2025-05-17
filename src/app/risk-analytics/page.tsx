import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Analytics',
  description: 'Analyze and manage portfolio risk with VaR, CVaR, and stress testing.',
};

export default function RiskAnalyticsPage() {
  return (
    <>
      <PageTitle
        title="Risk Analytics Dashboard"
        description="Comprehensive tools for assessing and managing portfolio risk, including VaR, CVaR, and stress testing."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              Value at Risk (VaR)
            </CardTitle>
            <CardDescription>
              Estimate the maximum potential loss over a specific time period at a given confidence level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">95% VaR (1-day)</p>
                <p className="text-2xl font-semibold text-destructive">-$15,780</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">99% VaR (1-day)</p>
                <p className="text-2xl font-semibold text-destructive">-$25,320</p>
              </div>
            </div>
            <div className="h-40 w-full rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">VaR Distribution Chart Placeholder</p>
            </div>
             <Button variant="outline" className="mt-4 w-full">Calculate New VaR</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-primary" />
              Conditional Value at Risk (CVaR)
            </CardTitle>
            <CardDescription>
              Measure the expected loss if the VaR threshold is breached, providing insight into tail risk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">95% CVaR (1-day)</p>
                <p className="text-2xl font-semibold text-destructive">-$22,500</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">99% CVaR (1-day)</p>
                <p className="text-2xl font-semibold text-destructive">-$31,800</p>
              </div>
            </div>
            <div className="h-40 w-full rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">CVaR Analysis Chart Placeholder</p>
            </div>
            <Button variant="outline" className="mt-4 w-full">Run CVaR Scenarios</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Stress Testing Module</CardTitle>
          <CardDescription>Simulate portfolio performance under various market stress scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This module is under development. It will allow you to define custom stress scenarios (e.g., market crashes, interest rate hikes) and see their impact on your portfolio.
          </p>
          <div className="mt-4 flex justify-center">
            <Image src="https://placehold.co/600x300.png" alt="Stress testing diagram" width={600} height={300} className="rounded-lg" data-ai-hint="financial stress"/>
          </div>
           <Button disabled className="mt-6 w-full sm:w-auto">Run Stress Test (Coming Soon)</Button>
        </CardContent>
      </Card>
    </>
  );
}
