"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function OrderTimelineDialog({ order, open, onClose }) {
  if (!order) return null;

  const steps = order.timeline?.length
    ? order.timeline
    : [{ status: order.status, at: order.createdAt }];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Status Timeline — {order.itemName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {steps.map((step, idx) => (
            <div
              key={`${step.status}-${idx}`}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <Badge className="capitalize">{step.status}</Badge>
              <span className="text-xs text-muted-foreground">
                {step.at ? new Date(step.at).toLocaleString() : "Recorded"}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}