// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides AI-powered suggestions for visualizing backtesting results.
 *
 * - suggestChartTypes - A function that suggests chart types based on backtesting data.
 * - SuggestChartTypesInput - The input type for the suggestChartTypes function.
 * - SuggestChartTypesOutput - The return type for the suggestChartTypes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartTypesInputSchema = z.object({
  backtestingResults: z.string().describe('Backtesting results data as a string.'),
});
export type SuggestChartTypesInput = z.infer<typeof SuggestChartTypesInputSchema>;

const SuggestChartTypesOutputSchema = z.object({
  suggestedChartTypes: z
    .array(z.string())
    .describe('Suggested chart types for visualizing the data.'),
  reasoning: z.string().describe('Reasoning for the chart type suggestions.'),
});
export type SuggestChartTypesOutput = z.infer<typeof SuggestChartTypesOutputSchema>;

export async function suggestChartTypes(input: SuggestChartTypesInput): Promise<SuggestChartTypesOutput> {
  return suggestChartTypesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTypesPrompt',
  input: {schema: SuggestChartTypesInputSchema},
  output: {schema: SuggestChartTypesOutputSchema},
  prompt: `You are an AI assistant specializing in data visualization. Given backtesting results, you will suggest the best chart types to visualize the data, so that the user can quickly understand their portfolio performance.

Backtesting Results: {{{backtestingResults}}}

Suggest chart types and explain your reasoning.`,
});

const suggestChartTypesFlow = ai.defineFlow(
  {
    name: 'suggestChartTypesFlow',
    inputSchema: SuggestChartTypesInputSchema,
    outputSchema: SuggestChartTypesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
