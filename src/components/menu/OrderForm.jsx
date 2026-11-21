"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { placeOrder } from "@/lib/action/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const DELIVERY_FEE = 2.99;

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function OrderForm({ item, user }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(todayISO());
  const [address, setAddress] = useState(user?.address || "");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => Number(item?.price || 0) * quantity,
    [item?.price, quantity],
  );
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!address.trim()) {
      toast.error("Please add a delivery address.");
      return;
    }
    if (!deliveryDate) {
      toast.error("Please choose a delivery date.");
      return;
    }

    setLoading(true);
    const result = await placeOrder({
      menuItemId: item.id,
      itemName: item.name,
      vendorId: item.vendorId || item.vendor?.id || null,
      vendorName: item.vendorName,
      quantity,
      unitPrice: Number(item.price) || 0,
      total,
      deliveryDate,
      deliveryAddress: address.trim(),
      specialInstructions: instructions.trim(),
    });
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Could not place your order.");
      return;
    }

    toast.success("Order placed! The kitchen has been notified.");
    router.push("/dashboard/customer/orders");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Place your order</h2>
          <p className="text-xs text-muted-foreground">
            Freshly made · pay on delivery
          </p>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Label>Quantity</Label>
          <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-bold">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery-date">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            Delivery date
          </Label>
          <Input
            id="delivery-date"
            type="date"
            min={todayISO()}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            <MapPin className="size-3.5 text-muted-foreground" />
            Delivery address
          </Label>
          <Textarea
            id="address"
            placeholder="Street, apartment, city, ZIP…"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">
            Special instructions{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="instructions"
            placeholder="Extra crispy, no onions, leave at the door…"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            className="min-h-16"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>
            Subtotal ({quantity} × {formatCurrency(item?.price)})
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Delivery fee</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(DELIVERY_FEE)}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <span className="font-bold">Total</span>
          <span className="font-display text-xl font-black text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-4 w-full"
        disabled={loading || item?.isAvailable === false}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CreditCard className="size-4" />
        )}
        {item?.isAvailable === false
          ? "Currently unavailable"
          : loading
            ? "Placing order…"
            : "Place order"}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-emerald-500" />
        Your order is protected and can be cancelled while pending.
      </p>
    </form>
  );
}
