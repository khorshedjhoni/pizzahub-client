"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteMenuItem,
  updateMenuItemStatus,
} from "@/lib/action/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { formatCurrency } from "@/lib/utils";

const STATUS_META = {
  approved: { label: "Approved", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export default function AdminMenuTable({ items = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending");
  const [working, setWorking] = useState("");

  const counts = useMemo(
    () => ({
      all: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      approved: items.filter((item) => item.status === "approved").length,
      rejected: items.filter((item) => item.status === "rejected").length,
    }),
    [items],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTab = tab === "all" || item.status === tab;
      const matchesSearch =
        !term ||
        [item.name, item.vendorName, item.category].some((value) =>
          String(value || "").toLowerCase().includes(term),
        );
      return matchesTab && matchesSearch;
    });
  }, [items, tab, search]);

  async function setStatus(item, status) {
    if (item.status === status) return;
    const key = `${item.id}-${status}`;
    setWorking(key);
    const result = await updateMenuItemStatus(item.id, status);
    setWorking("");
    if (!result.success) {
      toast.error(result.error || "Could not update this item.");
      return;
    }
    toast.success(`${item.name} marked ${status}.`);
    router.refresh();
  }

  async function handleDelete(item) {
    const key = `${item.id}-delete`;
    setWorking(key);
    const result = await deleteMenuItem(item.id);
    setWorking("");
    if (!result.success) {
      toast.error(result.error || "Could not delete this item.");
      return;
    }
    toast.success(`${item.name} deleted.`);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-1 rounded-full border border-border p-1">
            {[
              { value: "pending", label: `Pending (${counts.pending})` },
              { value: "approved", label: `Approved (${counts.approved})` },
              { value: "rejected", label: `Rejected (${counts.rejected})` },
              { value: "all", label: `All (${counts.all})` },
            ].map((entry) => (
              <button
                key={entry.value}
                type="button"
                onClick={() => setTab(entry.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  tab === entry.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pizzas or vendors…"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length ? (
          <div className="divide-y divide-border/70">
            {filtered.map((item) => {
              const meta = STATUS_META[item.status] || STATUS_META.pending;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-muted/30 sm:flex-row sm:items-center"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border pizza-gradient">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-2xl">
                        🍕
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold">{item.name}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {item.vendorName}
                      </span>
                      <span>{item.category}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Select
                      value={item.status}
                      onValueChange={(value) => setStatus(item, value)}
                    >
                      <SelectTrigger size="sm" className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    {item.status !== "approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400"
                        disabled={Boolean(working)}
                        onClick={() => setStatus(item, "approved")}
                      >
                        {working === `${item.id}-approved` ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        Approve
                      </Button>
                    ) : null}

                    {item.status !== "rejected" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={Boolean(working)}
                        onClick={() => setStatus(item, "rejected")}
                      >
                        {working === `${item.id}-rejected` ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                        Reject
                      </Button>
                    ) : null}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the item from the platform permanently.
                            Existing orders keep their history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item)}
                            disabled={working === `${item.id}-delete`}
                          >
                            {working === `${item.id}-delete` ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShieldCheck className="size-7 text-muted-foreground" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">
              Nothing to review
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {items.length
                ? "No items match this tab or search."
                : "Vendor submissions will appear here for approval."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
