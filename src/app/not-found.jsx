import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-6xl font-black text-red-600">404</span>
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The slice you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}