
import { PageTitle } from "@/components/page-title";
import { AiVisualizationsForm } from "@/components/ai-visualizations-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quantitative Strategy Analysis',
  description: 'Leverage AI to find the best visualizations for your quantitative trading strategy results and financial models.',
};

export default function AiVisualizationsPage() {
  return (
    <>
      <PageTitle
        title="Quantitative Strategy Analysis & Visualization Engine"
        description="Input your backtesting results, portfolio performance metrics, or model outputs. Our AI will suggest optimal visualizations to help you gain deeper insights."
      />
      <AiVisualizationsForm />
    </>
  );
}
