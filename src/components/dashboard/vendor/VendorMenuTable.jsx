"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteMenuItem, updateMenuItem } from "@/lib/action/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import MenuItemForm from "@/components/dashboard/vendor/MenuFormDialog";
import { formatCurrency } from "@/lib/utils";

const STATUS_META = {
  approved: { label: "Approved", variant: "success" },
  pending: { label: "Pending review", variant: "warning" },
  rejected: { label: "Rejected", variant: "destructive" },
  unavailable: { label: "Unavailable", variant: "outline" },
};

function getCategoryLabel(category) {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name || "Uncategorized";
}

export default function VendorMenuTable({ items = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const categoryText = getCategoryLabel(item.category);
      const matchesSearch =
        !term ||
        [item.name, categoryText].some((value) =>
          String(value || "").toLowerCase().includes(term),
        );
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleToggleAvailability(item, checked) {
    setTogglingId(item.id);
    const result = await updateMenuItem(item.id, { isAvailable: checked });
    setTogglingId(null);
    if (!result.success) {
      toast.error(result.error || "Could not update availability.");
      return;
    }
    toast.success(checked ? "Item is now available." : "Item marked unavailable.");
    router.refresh();
  }

  async function handleDelete(id) {
    setDeletingId(id);
    const result = await deleteMenuItem(id);
    setDeletingId(null);
    if (!result.success) {
      toast.error(result.error || "Could not delete this item.");
      return;
    }
    toast.success("Menu item deleted.");
    router.refresh();
  }

  const counts = {
    total: items.length,
    approved: items.filter((item) => item.status === "approved").length,
    pending: items.filter((item) => item.status === "pending").length,
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total items", value: counts.total, tone: "bg-primary/10 text-primary" },
          { label: "Approved", value: counts.approved, tone: "bg-emerald-500/10 text-emerald-600" },
          { label: "Pending review", value: counts.pending, tone: "bg-amber-500/10 text-amber-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-4 py-3.5 shadow-sm"
          >
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-0.5 font-display text-xl font-black">{card.value}</p>
            </div>
            <span className={`flex size-9 items-center justify-center rounded-xl ${card.tone}`}>
              <ChefHat className="size-4" />
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your menu…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border p-1">
              {[
                { value: "all", label: "All" },
                { value: "approved", label: "Live" },
                { value: "pending", label: "Pending" },
                { value: "rejected", label: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Add pizza
            </Button>
          </div>
        </div>

        {filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pizza</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const meta = STATUS_META[item.status] || STATUS_META.pending;
                const categoryLabel = getCategoryLabel(item.category);
                return (
                  <TableRow key={item.id || item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-border pizza-gradient">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-lg">
                              🍕
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[12rem] truncate text-sm font-bold">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground sm:hidden">
                            {categoryLabel}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{categoryLabel}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isAvailable !== false}
                          disabled={togglingId === item.id}
                          onCheckedChange={(checked) =>
                            handleToggleAvailability(item, checked)
                          }
                        />
                        {togglingId === item.id ? (
                          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {item.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the pizza from your
                                menu. Orders already placed are not affected.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep it</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                              >
                                {deletingId === item.id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Trash2 className="size-4" />
                                )}
                                Delete pizza
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted text-3xl">
              🍕
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">
              {items.length ? "No matches" : "Your menu is empty"}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {items.length
                ? "Try a different search or status filter."
                : "Add your first pizza and get it in front of hungry customers."}
            </p>
            {!items.length ? (
              <Button className="mt-5" onClick={openCreate}>
                <Plus className="size-4" />
                Add your first pizza
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit pizza" : "Add a new pizza"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details below. Changes go back to admin review."
                : "Tell customers what makes this pizza special."}
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm
            item={editing}
            onCancel={() => setDialogOpen(false)}
            onSuccess={() => {
              setDialogOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}