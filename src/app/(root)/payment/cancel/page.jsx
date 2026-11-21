// src/app/(dashboard)/payment/cancel/page.jsx
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center space-y-4">
      <XCircle className="mx-auto h-14 w-14 text-red-600" />
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>
      <p className="text-sm text-muted-foreground">
        No charges were made. You can upgrade your vendor subscription anytime.
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard/vendor/subscription">Back to Subscription</Link>
      </Button>
    </div>
  );
}