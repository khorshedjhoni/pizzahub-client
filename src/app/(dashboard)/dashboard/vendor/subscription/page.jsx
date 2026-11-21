"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const isPremium = session?.user?.subscriptionPlan === "premium";

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const headers = await getBearerHeader();
      const res = await fetch(`${API_URL}/payments/checkout-session`, {
        method: "POST",
        headers,
      });
      const json = await res.json();
      if (!res.ok || !json.data?.url) {
        toast.error(json.message || "Could not start Stripe Checkout");
        return;
      }

      window.location.href = json.data.url;
    } catch {
      toast.error("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vendor Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Upgrade to Premium to list unlimited pizzas and get featured placement
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={!isPremium ? "border-red-500" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free Plan</CardTitle>
              {!isPremium && <Badge>Current Plan</Badge>}
            </div>
            <p className="text-3xl font-bold pt-2">$0</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Up to 3 active menu items
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Receive &amp; manage customer orders
            </p>
          </CardContent>
        </Card>

        <Card className={isPremium ? "border-amber-500" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Premium Plan
              </CardTitle>
              {isPremium && (
                <Badge className="bg-amber-500 text-black">Active</Badge>
              )}
            </div>
            <p className="text-3xl font-bold pt-2">$29.00</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Unlimited active menu items
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Premium vendor badge on all menu cards
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Priority featured placement on Home &amp; Browse
              </li>
            </ul>

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isPremium || loading}
              onClick={handleUpgrade}
            >
              {isPremium
                ? "You Are on Premium"
                : loading
                ? "Redirecting to Stripe..."
                : "Upgrade with Stripe"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}