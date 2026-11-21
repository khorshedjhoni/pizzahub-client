import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import PizzaCard from "@/components/shared/PizzaCard";
import { Button } from "@/components/ui/button";
import { demoMenuItems } from "@/lib/api/menu";

export default function FeaturedPizzas({ items = [] }) {
  const approved = (items || []).filter(
    (item) => item?.status === "approved" && item?.isAvailable !== false,
  );
  const featured = approved.slice(0, 6);

  // Keep the required 6-card layout filled while the API is still empty.
  const merged = [...featured];
  for (const fallback of demoMenuItems) {
    if (merged.length >= 6) break;
    if (!merged.some((item) => item.id === fallback.id)) merged.push(fallback);
  }

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <Flame className="size-3.5" />
            Straight from the oven
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Featured pizzas
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            The pies our community keeps coming back for. Freshly approved,
            always made to order.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/menu">
            View full menu
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((item) => (
          <PizzaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
