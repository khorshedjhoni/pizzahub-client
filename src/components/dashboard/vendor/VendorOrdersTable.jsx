"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  ShoppingBag,
  WifiOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { acceptOrder, rejectOrder } from "@/lib/action/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES = {
  pending: { label: "Awaiting decision", variant: "warning" },
  confirmed: { label: "Accepted", variant: "secondary" },
  preparing: { label: "Preparing", variant: "warning" },
  delivering: { label: "Out for delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  rejected: { label: "Rejected", variant: "destructive" },
};

function StatusBadge({ status }) {
  const meta = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

function itemsSummary(order) {
  if (order?.items?.length) {
    return order.items
      .map((item) => `${item.quantity || 1}× ${item.name}`)
      .join(", ");
  }
  return order?.itemName || "Pizza order";
}

export default function VendorOrdersTable({ orders = [] }) {
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const [working, setWorking] = useState("");

  const filtered = useMemo(() => {
    if (tab === "pending") {
      return orders.filter((order) => order.status === "pending");
    }
    if (tab === "active") {
      return orders.filter((order) =>
        ["confirmed", "preparing", "delivering"].includes(order.status),
      );
    }
    if (tab === "history") {
      return orders.filter((order) =>
        ["delivered", "cancelled", "rejected"].includes(order.status),
      );
    }
    return orders;
  }, [orders, tab]);

  async function runAction(orderId, action) {
    const key = `${orderId}-${action}`;
    setWorking(key);
    const result =
      action === "accept" ? await acceptOrder(orderId) : await rejectOrder(orderId);
    setWorking("");
    if (!result.success) {
      toast.error(result.error || "Could not update this order.");
      return;
    }
    toast.success(
      action === "accept"
        ? "Order accepted. Time to fire up the oven!"
        : "Order rejected and the customer notified.",
    );
    router.refresh();
  }

  const pendingCount = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="active">In progress</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          You can accept or reject each order once.
        </p>
      </div>

      {filtered.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead className="hidden lg:table-cell">Delivery</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => {
              const busyAccept = working === `${order.id}-accept`;
              const busyReject = working === `${order.id}-reject`;
              const decided = order.status !== "pending";

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-mono text-xs font-bold">
                      #{String(order.id).slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(order.createdAt, true)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold">{order.customerName}</p>
                    <p className="max-w-[12rem] truncate text-[11px] text-muted-foreground">
                      {order.customerEmail || order.deliveryAddress}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="max-w-[15rem] truncate text-sm">
                      {itemsSummary(order)}
                    </p>
                    {order.specialInstructions ? (
                      <p className="max-w-[15rem] truncate text-[11px] italic text-muted-foreground">
                        “{order.specialInstructions}”
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm">
                      {formatDate(order.deliveryDate || order.createdAt)}
                    </p>
                    <p className="max-w-[12rem] truncate text-[11px] text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </TableCell>
                  <TableCell className="font-display text-sm font-black">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      {decided ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <WifiOff className="size-3" />
                          Decision made
                        </span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                            disabled={Boolean(working)}
                            onClick={() => runAction(order.id, "accept")}
                          >
                            {busyAccept ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Accept
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                disabled={Boolean(working)}
                              >
                                {busyReject ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <X className="size-3.5" />
                                )}
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Reject this order?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Order #
                                  {String(order.id).slice(-6).toUpperCase()} from{" "}
                                  {order.customerName} will be rejected. This
                                  decision is final.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Go back</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => runAction(order.id, "reject")}
                                >
                                  Reject order
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-7 text-muted-foreground" />
          </span>
          <h3 className="mt-4 font-display text-xl font-bold">
            No orders in this tab
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {orders.length
              ? "Nothing here right now. New orders will show up automatically."
              : "When customers order your pizzas, they will appear here for you to accept."}
          </p>
        </div>
      )}
    </div>
  );
}
