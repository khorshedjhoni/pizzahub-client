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
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminManageMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    async function loadAllMenu() {
      try {
        setLoading(true);
        const headers = await getBearerHeader();
        const res = await fetch(`${API_URL}/menu/admin/all`, { headers });
        const json = await res.json();
        setItems(json.data || []);
      } catch {
        toast.error("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }
    loadAllMenu();
  }, []);

 const handleStatusChange = async (itemId, status) => {
  try {
    setBusyId(itemId);
    const headers = {
      "Content-Type": "application/json",
      ...(await getBearerHeader()),
    };
    const res = await fetch(`${API_URL}/menu/admin/${itemId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message || "Could not update status");
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, status } : item))
    );
    toast.success(`Menu item ${status}`);
  } catch {
    toast.error("Error updating item status");
  } finally {
    setBusyId(null);
  }
};

  const handleDelete = async (itemId) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      setBusyId(itemId);
      const headers = await getBearerHeader();
      const res = await fetch(`${API_URL}/menu/${itemId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        toast.error("Failed to delete item");
        return;
      }
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Menu item deleted");
    } catch {
      toast.error("Error deleting item");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Menu Items</h1>
        <p className="text-sm text-muted-foreground">
          Approve, reject, or remove vendor pizza listings
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading menu items...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No menu items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.vendorName}</TableCell>
                  <TableCell className="text-sm">{item.category}</TableCell>
                  <TableCell className="font-semibold text-sm">
                    ${Number(item.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "approved"
                          ? "default"
                          : item.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {item.status !== "approved" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-green-600"
                        disabled={busyId === item._id}
                        onClick={() => handleStatusChange(item._id, "approved")}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-amber-600"
                        disabled={busyId === item._id}
                        onClick={() => handleStatusChange(item._id, "rejected")}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600"
                      disabled={busyId === item._id}
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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