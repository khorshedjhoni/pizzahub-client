import { asArray, serverSafeRequest as safeRequest } from "@/lib/api/server";
import { itemId } from "@/lib/utils";

export function normalizeTransaction(transaction) {
  if (!transaction) return null;
  return {
    ...transaction,
    id: itemId(transaction),
    amount: Number(transaction.amount ?? transaction.total ?? 0) / 100,
    currency: (transaction.currency || "usd").toUpperCase(),
    status: transaction.status || transaction.paymentStatus || "pending",
    customerEmail:
      transaction.customerEmail ||
      transaction.email ||
      transaction.user?.email ||
      "—",
    plan: transaction.plan || transaction.metadata?.plan || "premium",
    type: transaction.type || transaction.metadata?.type || "subscription",
    createdAt: transaction.createdAt || transaction.created || transaction.date,
  };
}

/** GET /payments/transactions — read-only Stripe log for admins. */
export async function getTransactions(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  const payload = await safeRequest(
    `/payments/transactions${suffix}`,
    { auth: true },
    null,
  );
  return asArray(payload, ["transactions", "payments"]).map(
    normalizeTransaction,
  );
}
