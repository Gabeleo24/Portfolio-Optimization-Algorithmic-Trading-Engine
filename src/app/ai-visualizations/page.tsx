import { PageTitle } from "@/components/page-title";
import { AiVisualizationsForm } from "@/components/ai-visualizations-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Visualizations',
  description: 'Get AI-powered suggestions for visualizing your financial data.',
};

export default function AiVisualizationsPage() {
  return (
    <>
      <PageTitle
        title="AI Visualizations Engine"
        description="Leverage artificial intelligence to get recommendations on the best ways to visualize your backtesting results, risk metrics, and portfolio performance."
      />
      <AiVisualizationsForm />
    </>
  );
}
