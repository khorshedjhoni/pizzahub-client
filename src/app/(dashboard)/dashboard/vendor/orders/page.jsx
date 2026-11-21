"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const headers = await getBearerHeader();
        const res = await fetch(`${API_URL}/orders/vendor`, { headers });
        const json = await res.json();
        setOrders(json.data || []);
      } catch {
        toast.error("Failed to load incoming orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleDecision = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not update order");
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      toast.success(`Order ${status}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Orders</h1>
        <p className="text-sm text-muted-foreground">
          Accept or reject incoming pizza delivery requests
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pizza Item</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Delivery Date &amp; Address</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No customer orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-sm">
                    {order.itemName} (${Number(order.price).toFixed(2)})
                  </TableCell>
                  <TableCell className="text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p className="font-medium">{order.deliveryDate}</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {order.deliveryAddress}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                    {order.message || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "accepted"
                          ? "default"
                          : order.status === "rejected" ||
                            order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {order.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={updatingId === order._id}
                          onClick={() => handleDecision(order._id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updatingId === order._id}
                          onClick={() => handleDecision(order._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Finalized
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}