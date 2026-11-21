"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Signout({ asMenuItem = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/signin");
    router.refresh();
  };

  if (asMenuItem) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-muted rounded-sm"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="mr-1.5 h-4 w-4" />
      Logout
    </Button>
  );
}