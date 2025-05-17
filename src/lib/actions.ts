// @ts-nocheck
// Disabling TypeScript checking for this file due to known issues with experimental_taintObjectReference
// and type inference in complex Zod schemas within Server Actions.

"use server";

import { suggestChartTypes, type SuggestChartTypesInput, type SuggestChartTypesOutput } from "@/ai/flows/ai-chart-suggestions";
import { z } from "zod";
import { experimental_taintObjectReference as taintObjectReference } from 'react';

const SuggestionSchema = z.object({
  backtestingResults: z.string().min(10, { message: "Backtesting results must be at least 10 characters long." }),
});

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: SuggestChartTypesOutput;
}

export async function getAiChartSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SuggestionSchema.safeParse({
    backtestingResults: formData.get("backtestingResults"),
  });

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
      fields[key] = validatedFields.error.flatten().fieldErrors[key]!.join(", ");
    }
    return {
      message: "Error: Invalid input.",
      fields,
      issues: validatedFields.error.flatten().formErrors,
    };
  }

  try {
    const input: SuggestChartTypesInput = {
      backtestingResults: validatedFields.data.backtestingResults,
    };
    const result = await suggestChartTypes(input);
    
    if (process.env.NODE_ENV === 'development') {
      taintObjectReference(
        'Do not pass the entire result object to the client side in production.',
        result
      );
    }
    
    return {
      message: "Suggestions generated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error calling AI service:", error);
    return {
      message: "Error: Could not get suggestions from AI service. Please try again later.",
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
