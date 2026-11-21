"use client";

import { useState } from "react";
import { ArrowRight, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/action/payments";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UpgradeButton({
  className,
  label = "Upgrade to Premium",
  plan = "premium",
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const result = await createCheckoutSession({ plan });
      if (!result.success) {
        toast.error(result.error || "Could not start checkout.");
        return;
      }
      window.location.assign(result.url);
    } catch (error) {
      toast.error(error.message || "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      size="lg"
      className={cn("w-full", className)}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Crown className="size-4" />
      )}
      {loading ? "Opening Stripe…" : label}
      {!loading ? <ArrowRight className="size-4" /> : null}
    </Button>
  );
}
