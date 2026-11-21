// src/app/(dashboard)/payment/success/page.jsx
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center space-y-4">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-sm text-muted-foreground">
        Your vendor account has been upgraded to Premium. You can now add
        unlimited pizza items.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link href="/dashboard/vendor/menu">Go to My Menu</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/vendor">Vendor Overview</Link>
        </Button>
      </div>
    </div>
  );
}