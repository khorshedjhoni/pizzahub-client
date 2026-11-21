import { Pizza } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Pizza className="h-9 w-9 animate-spin text-red-600" />
      <p className="text-sm font-medium text-muted-foreground">
        Loading PizzaHub...
      </p>
    </div>
  );
}