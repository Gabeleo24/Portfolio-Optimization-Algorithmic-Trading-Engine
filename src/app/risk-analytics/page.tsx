"use client";

import { useState, useEffect, useCallback } from "react";
import { PageTitle } from "@/components/page-title"; // Assuming this is a pre-existing component
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Assuming shadcn/ui
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming shadcn/ui
import { Alert, AlertDescription } from "@/components/ui/alert"; // Assuming shadcn/ui
import Image from "next/image";
import { 
  ShieldAlert, TrendingDown, TrendingUp, RefreshCw, AlertCircle, 
  LineChart, BarChart3, Info, PlusCircle, Trash2, Zap, FileText, Activity 
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Define a type for individual risk metric data
interface RiskMetric {
  label: string;
  value: number;
  description: string;
}

// Define the structure for the overall risk data
interface RiskDataState {
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
  lastUpdated: Date;
  isLoading: boolean; // Global loading state for all metrics
}

// Add these interfaces for chart data
interface ChartDataPoint {
  name: string;
  value: number;
}

interface HistoricalRiskData {
  timestamp: Date;
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
}

// Initial risk metrics data
const initialRiskData: RiskDataState = {
  var95: -15780,
  var99: -25320,
  cvar95: -22500,
  cvar99: -31800,
  lastUpdated: new Date(),
  isLoading: false
};

// Reusable Risk Display Card Component
interface RiskDisplayCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  metrics: RiskMetric[];
  isLoading: boolean;
  onCalculate: () => void;
  calculateButtonText: string;
  chartPlaceholderText: string;
  chartIcon?: React.ElementType;
  chartData?: any[];
  chartType?: "line" | "distribution" | "none";
}

const RiskDisplayCard: React.FC<RiskDisplayCardProps> = ({
  title,
  description,
  icon: Icon,
  metrics,
  isLoading,
  onCalculate,
  calculateButtonText,
  chartPlaceholderText,
  chartIcon: ChartIcon = BarChart3,
  chartData,
  chartType = "line"
}) => {
  // Keep the formatCurrency function inside the component for local use
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mt-1" />
              ) : (
                <p className={`text-2xl font-semibold ${metric.value >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                  {formatCurrency(metric.value)}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="h-40 w-full rounded-lg bg-muted flex flex-col items-center justify-center p-4">
          {isLoading ? (
            <>
              <ChartIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {chartPlaceholderText}
              </p>
            </>
          ) : chartType === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatChartTime} 
                  stroke="#6B7280"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#6B7280" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `$${Math.abs(value/1000)}k`}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [formatChartCurrency(value), ""]}
                  labelFormatter={(label) => formatChartTime(label)}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', fontSize: '12px' }}
                />
                {title.includes("VaR") ? (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="var95" 
                      name="95% VaR" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="var99" 
                      name="99% VaR" 
                      stroke="#EC4899" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </>
                ) : (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="cvar95" 
                      name="95% CVaR" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cvar99" 
                      name="99% CVaR" 
                      stroke="#EC4899" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </>
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : chartType === "distribution" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#6B7280" 
                  tick={{ fontSize: 10 }}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [`Frequency: ${value}`, ""]}
                  labelFormatter={(label) => `Value: ${formatChartCurrency(Number(label))}`}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill={title.includes("VaR") ? "#8B5CF6" : "#EC4899"} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <>
              <ChartIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {chartPlaceholderText}
              </p>
            </>
          )}
        </div>
        <Button 
          variant="outline" 
          className="mt-auto w-full" // mt-auto pushes button to bottom
          onClick={onCalculate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {calculateButtonText}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};


// Move the formatChartCurrency function outside of the component to make it accessible everywhere
const formatChartCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Format time for chart labels
const formatChartTime = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export default function RiskAnalyticsPage() {
  const [riskData, setRiskData] = useState<RiskDataState>(initialRiskData);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add these state variables for the refresh timer
  const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>("");

  // Add these state variables to track historical data
  const [varChartData, setVarChartData] = useState<HistoricalRiskData[]>([]);
  const [cvarChartData, setCvarChartData] = useState<HistoricalRiskData[]>([]);
  const [varDistributionData, setVarDistributionData] = useState<ChartDataPoint[]>([]);
  const [cvarDistributionData, setCvarDistributionData] = useState<ChartDataPoint[]>([]);
  
  // Add these state variables for stress testing
  const [stressTestType, setStressTestType] = useState<string>("historical");
  const [customShocks, setCustomShocks] = useState<Array<{id: string; parameter: string; changeValue: string}>>([
    { id: "1", parameter: "S&P 500", changeValue: "-20%" }
  ]);
  const [shockDuration, setShockDuration] = useState<string>("3");
  const [recoveryPeriod, setRecoveryPeriod] = useState<string>("12");
  const [scenarioSeverity, setScenarioSeverity] = useState<number[]>([60]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationConfidence, setSimulationConfidence] = useState<number | null>(null);
  const [stressTestChartData, setStressTestChartData] = useState<any[]>([]);

  // Enhanced function to calculate new risk metrics
  const calculateRiskMetrics = useCallback(async () => {
    try {
      setRiskData(prev => ({ ...prev, isLoading: true }));
      setError(null);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate market movements with slightly different logic for VaR and CVaR
      const baseRandomFactor = 0.95 + Math.random() * 0.1; // Base volatility: 0.95 to 1.05

      // VaR calculation - tends to be less volatile in this simulation
      const varRandomFactor = baseRandomFactor * (0.98 + Math.random() * 0.04); // More stable: 0.98 to 1.02 of base
      const newVar95 = Math.round(riskData.var95 * varRandomFactor);
      const newVar99 = Math.round(riskData.var99 * varRandomFactor);
      
      // CVaR calculation - can be more volatile or show larger deviations
      // CVaR is typically worse than VaR. We'll ensure it stays negative and generally larger in magnitude.
      const cvarFactor95 = 1.3 + Math.random() * 0.2; // CVaR is 1.3x to 1.5x VaR
      const cvarFactor99 = 1.2 + Math.random() * 0.2; // CVaR is 1.2x to 1.4x VaR
      
      const newCvar95 = Math.min(-1, Math.round(newVar95 * cvarFactor95)); // Ensure it's negative
      const newCvar99 = Math.min(-1, Math.round(newVar99 * cvarFactor99));
      
      const newTimestamp = new Date();
      
      // Update historical data for charts
      setVarChartData(prev => {
        const newData = [...prev, { 
          timestamp: newTimestamp, 
          var95: newVar95, 
          var99: newVar99,
          cvar95: 0, // Not used in VaR chart
          cvar99: 0  // Not used in VaR chart
        }];
        // Keep only the last 10 data points
        return newData.slice(-10);
      });
      
      setCvarChartData(prev => {
        const newData = [...prev, { 
          timestamp: newTimestamp,
          var95: 0, // Not used in CVaR chart
          var99: 0, // Not used in CVaR chart
          cvar95: newCvar95, 
          cvar99: newCvar99 
        }];
        // Keep only the last 10 data points
        return newData.slice(-10);
      });
      
      // Generate distribution data for VaR
      const newVarDistribution = generateDistributionData(newVar95, 10);
      setVarDistributionData(newVarDistribution);
      
      // Generate distribution data for CVaR
      const newCvarDistribution = generateDistributionData(newCvar95, 10);
      setCvarDistributionData(newCvarDistribution);
      
      setRiskData({
        var95: newVar95,
        var99: newVar99,
        cvar95: newCvar95,
        cvar99: newCvar99,
        lastUpdated: newTimestamp,
        isLoading: false
      });
    } catch (err) {
      console.error("Error calculating risk metrics:", err);
      setError("Failed to update risk metrics. Please try again.");
      setRiskData(prev => ({ ...prev, isLoading: false }));
    }
  }, [riskData.var95, riskData.var99]); // Dependencies remain the same as they are the base for new calculations

  // Set up auto-refresh
  useEffect(() => {
    if (!isAutoRefresh) {
      setNextRefreshTime(null);
      setTimeUntilRefresh("");
      return;
    }
    
    // Set initial next refresh time
    const refreshInterval = 60000; // 1 minute in milliseconds
    const nextTime = new Date(Date.now() + refreshInterval);
    setNextRefreshTime(nextTime);
    
    // Set up the interval for auto-refresh
    const refreshId = setInterval(() => {
      calculateRiskMetrics();
      setNextRefreshTime(new Date(Date.now() + refreshInterval));
    }, refreshInterval);
    
    // Set up a timer to update the countdown every second
    const countdownId = setInterval(() => {
      if (nextRefreshTime) {
        const timeLeft = nextRefreshTime.getTime() - Date.now();
        if (timeLeft <= 0) {
          setTimeUntilRefresh("Refreshing...");
        } else {
          const seconds = Math.floor(timeLeft / 1000);
          setTimeUntilRefresh(`${seconds}s`);
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(refreshId);
      clearInterval(countdownId);
    };
  }, [isAutoRefresh, calculateRiskMetrics]);

  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const varMetrics: RiskMetric[] = [
    { label: "var95", value: riskData.var95, description: "95% VaR (1-day)" },
    { label: "var99", value: riskData.var99, description: "99% VaR (1-day)" },
  ];

  const cvarMetrics: RiskMetric[] = [
    { label: "cvar95", value: riskData.cvar95, description: "95% CVaR (1-day)" },
    { label: "cvar99", value: riskData.cvar99, description: "99% CVaR (1-day)" },
  ];

  // Add this function to generate stress test chart data
  const generateStressTestChartData = (severity: number, duration: number) => {
    const data = [];
    const initialValue = 100;
    const maxDrop = severity * 0.8 / 100; // Convert percentage to decimal, max 80% of severity
    
    // Initial stable period
    for (let i = 0; i < 3; i++) {
      data.push({
        month: i,
        value: initialValue - (i * 0.5) // Slight decline before shock
      });
    }
    
    // Shock period
    const shockDepth = initialValue * maxDrop;
    for (let i = 0; i < duration; i++) {
      const dropFactor = i === 0 ? 0.6 : (1 - (i / duration)); // Steeper drop initially
      const monthValue = initialValue - (shockDepth * dropFactor * (i + 1) / duration);
      data.push({
        month: i + 3,
        value: monthValue
      });
    }
    
    // Recovery period
    const lowestPoint = data[data.length - 1].value;
    const recoveryStart = duration + 3;
    const recoveryDuration = duration * 4; // Recovery takes longer than shock
    
    for (let i = 0; i < recoveryDuration; i++) {
      const recoveryFactor = Math.sqrt(i / recoveryDuration); // Square root for slower initial recovery
      const monthValue = lowestPoint + ((initialValue - lowestPoint) * recoveryFactor);
      data.push({
        month: recoveryStart + i,
        value: monthValue
      });
    }
    
    return data;
  };

  // Add this function to run the stress test simulation
  const runStressTestSimulation = () => {
    setIsSimulating(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Set simulation confidence to a random value between 70-95%
      const confidenceScore = Math.floor(70 + Math.random() * 25);
      setSimulationConfidence(confidenceScore);
      setIsSimulating(false);
    }, 2000);
  };

  // Helper function to generate distribution data
  const generateDistributionData = (centerValue: number, numPoints: number): ChartDataPoint[] => {
    const result: ChartDataPoint[] = [];
    const absValue = Math.abs(centerValue);
    const step = absValue * 0.4 / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
      const value = centerValue - (absValue * 0.2) + (i * step);
      // Create a normal-like distribution with higher values in the middle
      const frequency = Math.round(100 * Math.exp(-0.5 * Math.pow((i - numPoints/2) / (numPoints/4), 2)));
      result.push({
        name: value.toFixed(0),
        value: frequency
      });
    }
    
    return result;
  };

  // Initialize chart data on component mount
  useEffect(() => {
    // Generate initial distribution data
    const initialVarDistribution = generateDistributionData(riskData.var95, 10);
    setVarDistributionData(initialVarDistribution);
    
    const initialCvarDistribution = generateDistributionData(riskData.cvar95, 10);
    setCvarDistributionData(initialCvarDistribution);
    
    // Set initial historical data point
    const initialTimestamp = new Date();
    setVarChartData([{ 
      timestamp: initialTimestamp, 
      var95: riskData.var95, 
      var99: riskData.var99,
      cvar95: 0,
      cvar99: 0
    }]);
    
    setCvarChartData([{ 
      timestamp: initialTimestamp,
      var95: 0,
      var99: 0,
      cvar95: riskData.cvar95, 
      cvar99: riskData.cvar99 
    }]);
  }, []);

  // Update the useEffect to reset simulation confidence to null
  useEffect(() => {
    // Reset simulation confidence when parameters change
    setSimulationConfidence(null);
    
    // Generate new chart data
    const data = generateStressTestChartData(scenarioSeverity[0], parseInt(shockDuration));
    setStressTestChartData(data);
  }, [scenarioSeverity, shockDuration, recoveryPeriod, stressTestType]);

  return (
    <div className="container mx-auto py-8 px-4"> {/* Added container for better spacing */}
      <PageTitle
        title="Risk Analytics Dashboard"
        description="Comprehensive tools for assessing and managing portfolio risk, including VaR, CVaR, and stress testing."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAutoRefresh(prev => !prev)} // Use functional update for state toggles
              className={`w-full sm:w-auto ${isAutoRefresh ? "bg-primary/10 border-primary text-primary" : ""}`}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
              {isAutoRefresh ? "Auto-Refresh (1m)" : "Auto-Refresh Off"}
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={calculateRiskMetrics}
              disabled={riskData.isLoading}
              className="w-full sm:w-auto"
            >
              {riskData.isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Refresh All Now"
              )}
            </Button>
          </div>
        }
      />

      {error && (
        <Alert variant="destructive" className="my-6"> {/* Added my-6 for better spacing */}
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle> {/* Added AlertTitle for better semantics */}
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4 text-sm text-muted-foreground text-right"> {/* Spacing and alignment */}
        Last updated: {formatTime(riskData.lastUpdated)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RiskDisplayCard
          title="Value at Risk (VaR)"
          description="Estimate the maximum potential loss over a specific time period at a given confidence level."
          icon={ShieldAlert}
          metrics={varMetrics}
          isLoading={riskData.isLoading}
          onCalculate={calculateRiskMetrics} // Could have specific VaR calculation if logic diverged more
          calculateButtonText="Recalculate VaR"
          chartPlaceholderText="VaR Distribution Chart Placeholder. Visualizing potential loss distribution."
          chartData={varDistributionData}
          chartType="distribution"
        />

        <RiskDisplayCard
          title="Conditional Value at Risk (CVaR)"
          description="Measure the expected loss if the VaR threshold is breached, providing insight into tail risk."
          icon={TrendingDown}
          metrics={cvarMetrics}
          isLoading={riskData.isLoading}
          onCalculate={calculateRiskMetrics} // Could have specific CVaR calculation
          calculateButtonText="Recalculate CVaR"
          chartPlaceholderText="CVaR Analysis Chart Placeholder. Focus on tail-end loss expectations."
          chartIcon={TrendingUp} // Example of using a different icon for this card's chart
          chartData={cvarDistributionData}
          chartType="distribution"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" />
              VaR Historical Trend
            </CardTitle>
            <CardDescription>Track how VaR metrics have changed over time with each recalculation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {varChartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={varChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatChartTime} 
                      stroke="#6B7280"
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickFormatter={(value) => `$${Math.abs(value/1000)}k`}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [formatChartCurrency(value), ""]}
                      labelFormatter={(label) => formatChartTime(new Date(label))}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="var95" 
                      name="95% VaR" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="var99" 
                      name="99% VaR" 
                      stroke="#EC4899" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Recalculate VaR multiple times to see historical trends.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              CVaR Historical Trend
            </CardTitle>
            <CardDescription>Track how CVaR metrics have changed over time with each recalculation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {cvarChartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={cvarChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatChartTime} 
                      stroke="#6B7280"
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickFormatter={(value) => `$${Math.abs(value/1000)}k`}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [formatChartCurrency(value), ""]}
                      labelFormatter={(label) => formatChartTime(new Date(label))}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cvar95" 
                      name="95% CVaR" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cvar99" 
                      name="99% CVaR" 
                      stroke="#EC4899" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Recalculate CVaR multiple times to see historical trends.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TooltipProvider>
        <div className="mt-6">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle>Stress Testing Module</CardTitle>
              <CardDescription>Simulate portfolio performance under various market stress scenarios.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Scenario Configuration</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stressTestType">Scenario Type</Label>
                      <Select value={stressTestType} onValueChange={setStressTestType}>
                        <SelectTrigger id="stressTestType" className="bg-card border-input">
                          <SelectValue placeholder="Select scenario type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="historical">Historical Crisis</SelectItem>
                          <SelectItem value="custom">Custom Scenario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {stressTestType === "historical" && (
                      <div>
                        <Label htmlFor="historicalEvent">Historical Event</Label>
                        <Select defaultValue="2000">
                          <SelectTrigger id="historicalEvent" className="bg-card border-input">
                            <SelectValue placeholder="Select historical event" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2008">2008 Financial Crisis</SelectItem>
                            <SelectItem value="2000">2000 Dot-com Bubble</SelectItem>
                            <SelectItem value="2020">2020 COVID-19 Crash</SelectItem>
                            <SelectItem value="1987">1987 Black Monday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {stressTestType === "custom" && (
                      <div className="space-y-3">
                        <Label>Custom Market Shocks</Label>
                        {customShocks.map(shock => (
                          <div key={shock.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                            <div className="sm:col-span-2">
                              <Label htmlFor={`shockParam-${shock.id}`} className="text-xs">Parameter</Label>
                              <Input 
                                id={`shockParam-${shock.id}`} 
                                placeholder="e.g., S&P 500" 
                                value={shock.parameter} 
                                onChange={(e) => updateCustomShock(shock.id, 'parameter', e.target.value)}
                                className="bg-card border-input" 
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <Label htmlFor={`shockVal-${shock.id}`} className="text-xs">Change</Label>
                              <Input 
                                id={`shockVal-${shock.id}`} 
                                placeholder="-20%" 
                                value={shock.changeValue} 
                                onChange={(e) => updateCustomShock(shock.id, 'changeValue', e.target.value)}
                                className="bg-card border-input" 
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeCustomShock(shock.id)} 
                              className="mt-1 sm:mt-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addCustomShock} className="w-full">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Shock
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shockDuration">Shock Duration (Months)</Label>
                        <Input 
                          type="number" 
                          id="shockDuration" 
                          value={shockDuration} 
                          onChange={(e) => setShockDuration(e.target.value)} 
                          placeholder="e.g., 3"
                          className="bg-card border-input" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="recoveryPeriod">Assumed Recovery Period (Months)</Label>
                        <Input 
                          type="number" 
                          id="recoveryPeriod" 
                          value={recoveryPeriod} 
                          onChange={(e) => setRecoveryPeriod(e.target.value)} 
                          placeholder="e.g., 12"
                          className="bg-card border-input" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="scenarioSeverity" className="mb-2 block">Scenario Severity</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Mild</span>
                        <Slider
                          id="scenarioSeverity"
                          min={0} max={100} step={10}
                          value={scenarioSeverity}
                          onValueChange={setScenarioSeverity}
                          className="flex-grow"
                        />
                        <span className="text-xs text-muted-foreground">Extreme</span>
                        <span className="text-sm font-medium w-10 text-right">{scenarioSeverity[0]}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Impact Overview */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Simulated Impact Overview</h3>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground">Portfolio Value Change:</span>
                      {simulationConfidence ? (
                        <span className="font-medium text-destructive">-{Math.floor(15 + scenarioSeverity[0]/5)}%</span>
                      ) : (
                        <Skeleton className="h-5 w-20" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground">Max Drawdown:</span>
                      {simulationConfidence ? (
                        <span className="font-medium text-destructive">-{Math.floor(20 + scenarioSeverity[0]/4)}%</span>
                      ) : (
                        <Skeleton className="h-5 w-16" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground">Stressed VaR (99%):</span>
                      {simulationConfidence ? (
                        <span className="font-medium text-destructive">${Math.floor(30000 + scenarioSeverity[0] * 500)}</span>
                      ) : (
                        <Skeleton className="h-5 w-24" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground">Stressed CVaR (99%):</span>
                      {simulationConfidence ? (
                        <span className="font-medium text-destructive">${Math.floor(40000 + scenarioSeverity[0] * 600)}</span>
                      ) : (
                        <Skeleton className="h-5 w-24" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground">Recovery Time Estimate:</span>
                      {simulationConfidence ? (
                        <span className="font-medium">{Math.floor(Number(recoveryPeriod) * (1 + scenarioSeverity[0]/100))} months</span>
                      ) : (
                        <Skeleton className="h-5 w-28" />
                      )}
                    </div>
                    
                    <div className="mt-4 h-32 w-full rounded-lg bg-background">
                      {simulationConfidence ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stressTestChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis 
                              dataKey="month" 
                              stroke="#6B7280"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(value) => `M${value}`}
                            />
                            <YAxis 
                              stroke="#6B7280"
                              tick={{ fontSize: 10 }}
                              domain={['dataMin - 5', 'dataMax + 5']}
                              tickFormatter={(value) => `${value.toFixed(0)}`}
                            />
                            <RechartsTooltip 
                              formatter={(value: number) => [`Portfolio Value: ${value.toFixed(2)}%`, ""]}
                              labelFormatter={(label) => `Month ${label}`}
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', fontSize: '12px' }}
                            />
                            <defs>
                              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#EC4899" 
                              fillOpacity={1}
                              fill="url(#portfolioGradient)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center">
                          <BarChart3 className="h-10 w-10 text-muted-foreground mb-1 opacity-30" />
                          <p className="text-xs text-muted-foreground">Run simulation to view impact chart</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3"/>Simulation Confidence:
                      </span>
                      {simulationConfidence ? (
                        <span className="text-xs font-medium">{simulationConfidence}%</span>
                      ) : (
                        <Skeleton className="h-4 w-12" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Advanced simulations are computationally intensive. Results are illustrative.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={!simulationConfidence}
                  className="bg-card border-input"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Report (PDF)
                </Button>
                <Button 
                  variant="default" 
                  className="bg-primary text-primary-foreground"
                  onClick={runStressTestSimulation}
                  disabled={isSimulating}
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run Stress Test Simulation
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </TooltipProvider>
    </div>
  );
}
