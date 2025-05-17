
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAiChartSuggestions, type FormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Bot, Lightbulb, ListChecks, Terminal, FileText } from "lucide-react";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Analyzing Data...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get Visualization Suggestions
        </>
      )}
    </Button>
  );
}

export function AiVisualizationsForm() {
  const [state, formAction] = useActionState(getAiChartSuggestions, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.message !== "Suggestions generated successfully.") {
      if(state.issues && state.issues.length > 0) {
        toast({
          title: "Error",
          description: state.issues.join("\n") || state.message,
          variant: "destructive",
        });
      } else if (state.fields) {
         const fieldErrors = Object.values(state.fields).join("\n");
         toast({
          title: "Validation Error",
          description: fieldErrors || state.message,
          variant: "destructive",
        });
      } else {
         toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    } else if (state.message === "Suggestions generated successfully." && state.data) {
      toast({
        title: "Success!",
        description: "AI visualization suggestions have been generated.",
      });
      // Optionally reset form: formRef.current?.reset(); // if you want to clear after success
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            Strategy Data Input
          </CardTitle>
          <CardDescription>
            Paste your quantitative model's backtesting results, portfolio performance data, or any other structured financial data below. The AI will analyze it and suggest effective chart types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <Textarea
                name="backtestingResults"
                placeholder="Example:&#10;Strategy: AlphaMax, Date,NetProfit,MaxDrawdown,SharpeRatio&#10;Run1,2023-01-01,15030.25,-0.05,1.52&#10;Run1,2023-01-02,15105.50,-0.05,1.53&#10;..."
                rows={10}
                className="border-input focus:ring-primary"
                aria-label="Quantitative Strategy Data Input"
              />
              {state.fields?.backtestingResults && (
                <p className="mt-1 text-sm text-destructive">{state.fields.backtestingResults}</p>
              )}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.data && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ListChecks className="h-6 w-6 text-primary" />
              AI Visualization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Suggested Chart Types:</h3>
              {state.data.suggestedChartTypes && state.data.suggestedChartTypes.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {state.data.suggestedChartTypes.map((chartType, index) => (
                    <li key={index}>{chartType}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific chart types suggested.</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Reasoning:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {state.data.reasoning || "No reasoning provided."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
       {state.issues && state.issues.length > 0 && (
         <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>An Error Occurred</AlertTitle>
           <AlertDescription>
             {state.issues.join("\n")}
           </AlertDescription>
         </Alert>
       )}
    </div>
  );
}
