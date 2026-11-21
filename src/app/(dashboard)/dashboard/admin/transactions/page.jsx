import { headers } from "next/headers";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

async function getTransactions() {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/payments/transactions`, {
      headers: { ...authHeaders, Cookie: (await headers()).toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Read-only log of vendor subscription payments
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-medium text-sm">
                    {tx.vendorEmail}
                  </TableCell>
                  <TableCell className="capitalize text-sm">
                    {tx.plan || "premium"}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    ${Number(tx.amount || 29).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.status === "paid" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString()
                      : "-"}
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