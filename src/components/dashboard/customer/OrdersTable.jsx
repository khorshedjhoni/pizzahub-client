// src/components/dashboard/customer/OrdersTable.jsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderTimelineDialog from "./OrderTimelineDialog";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function OrdersTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);
      const headers = await getBearerHeader();
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not cancel order");
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const badgeVariant = (status) => {
    if (status === "accepted") return "default";
    if (status === "rejected" || status === "cancelled") return "destructive";
    return "secondary";
  };

  return (
    <>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  You haven&apos;t placed any orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={order.itemImage}
                        alt={order.itemName}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{order.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          ${Number(order.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{order.vendorName}</TableCell>
                  <TableCell className="text-sm">{order.deliveryDate}</TableCell>
                  <TableCell className="text-sm max-w-[180px] truncate">
                    {order.deliveryAddress}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Timeline
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancel(order._id)}
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderTimelineDialog
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}