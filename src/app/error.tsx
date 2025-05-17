"use client"; 

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">
        Something went wrong!
      </h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again later."}
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
        size="lg"
      >
        Try again
      </Button>
    </div>
  );
}
