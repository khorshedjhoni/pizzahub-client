"use client";

import { useMemo, useState } from "react";
import { CreditCard, Lock, Receipt, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_META = {
  succeeded: { label: "Succeeded", variant: "success" },
  paid: { label: "Paid", variant: "success" },
  complete: { label: "Complete", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  open: { label: "Open", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "outline" },
  canceled: { label: "Cancelled", variant: "destructive" },
};

export default function TransactionsTable({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesSearch =
        !term ||
        [
          transaction.id,
          transaction.customerEmail,
          transaction.plan,
          transaction.type,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term),
        );
      const matchesStatus =
        statusFilter === "all" ||
        String(transaction.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const total = transactions
    .filter((transaction) =>
      ["succeeded", "paid", "complete"].includes(
        String(transaction.status).toLowerCase(),
      ),
    )
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Processed volume</p>
          <p className="mt-1 font-display text-2xl font-black text-primary">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="mt-1 font-display text-2xl font-black">
            {transactions.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Read-only log
          </p>
          <p className="mt-1 text-sm font-semibold">
            Payment records cannot be edited
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email, transaction or plan…"
              className="pl-9"
            />
          </div>
          <div className="flex rounded-full border border-border p-1">
            {[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
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
        </div>

        {filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((transaction) => {
                const meta =
                  STATUS_META[String(transaction.status).toLowerCase()] || {
                    label: transaction.status,
                    variant: "outline",
                  };
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Receipt className="size-4" />
                        </span>
                        <div>
                          <p className="max-w-[10rem] truncate font-mono text-xs font-bold">
                            {transaction.id}
                          </p>
                          <p className="text-[11px] capitalize text-muted-foreground">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[14rem] truncate text-sm">
                        {transaction.customerEmail}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={transaction.plan === "premium" ? "premium" : "outline"}>
                        {transaction.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt, true)}
                    </TableCell>
                    <TableCell className="font-display text-sm font-black">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <CreditCard className="size-7 text-muted-foreground" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">
              No transactions yet
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Stripe subscription payments will be logged here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
