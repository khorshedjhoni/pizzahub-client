"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        Something went wrong!
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred while rendering this page."}
      </p>
      <Button
        onClick={() => reset()}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Try Again
      </Button>
    </div>
  );
}