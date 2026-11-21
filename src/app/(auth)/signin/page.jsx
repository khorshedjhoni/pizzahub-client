import { Suspense } from "react";
import SigninForm from "@/components/auth/SigninForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your PizzaHub account to order or manage pizzas.",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      }
    >
      <SigninForm />
    </Suspense>
  );
}
