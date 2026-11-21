import Link from "next/link";
import { Pizza } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/50 dark:bg-background px-4 py-12">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-600"
      >
        <Pizza className="h-7 w-7 text-orange-500" />
        <span>PizzaHub</span>
      </Link>

      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </div>
  );
}