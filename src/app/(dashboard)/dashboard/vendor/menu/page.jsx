"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MenuFormDialog from "@/components/dashboard/vendor/MenuFormDialog";
import { Plus, Pencil, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function VendorMenuContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      const headers = await getBearerHeader();
      const res = await fetch(`${API_URL}/menu/vendor/my-items`, { headers });
      const json = await res.json();
      setItems(json.data || []);
    } catch {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyItems();
  }, []);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setEditItem(null);
      setDialogOpen(true);
    }
  }, [searchParams]);

  const isPremium = session?.user?.subscriptionPlan === "premium";
  const activeCount = items.filter(
    (i) => ["pending", "approved"].includes(i.status) && i.isAvailable
  ).length;
  const reachedFreeLimit = !isPremium && activeCount >= 3;

  const handleToggleAvailability = async (item) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };
      const res = await fetch(`${API_URL}/menu/${item._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not update availability");
        return;
      }
      toast.success(
        !item.isAvailable ? "Item marked available" : "Item paused"
      );
      loadMyItems();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item permanently?")) return;
    try {
      const headers = await getBearerHeader();
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        toast.error("Failed to delete item");
        return;
      }
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Menu item deleted");
    } catch {
      toast.error("Error deleting item");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Menu Items</h1>
          <p className="text-sm text-muted-foreground">
            {isPremium
              ? "Premium Plan: Unlimited active menu items"
              : `Free Plan: ${activeCount} / 3 active items used`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {reachedFreeLimit && (
            <Button
              asChild
              variant="outline"
              className="border-amber-500 text-amber-600"
            >
              <Link href="/dashboard/vendor/subscription">
                <Crown className="mr-1.5 h-4 w-4" />
                Upgrade for Unlimited
              </Link>
            </Button>
          )}
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={reachedFreeLimit}
            onClick={() => {
              setEditItem(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Admin Approval</TableHead>
              <TableHead>Availability</TableHead>
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
                  No menu items yet. Click &quot;Add Menu Item&quot; to get started.
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
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.isAvailable ? "Active" : "Paused"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditItem(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => handleDelete(item._id)}
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

      <MenuFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editItem={editItem}
        onSaved={loadMyItems}
      />
    </div>
  );
}

export default function VendorMenuPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <VendorMenuContent />
    </Suspense>
  );
}