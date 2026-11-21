import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Signout from "@/components/shared/Signout";

export default function DashboardHeader({ user }) {
  const role = user?.role || "customer";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/menu" className="text-sm font-medium hover:text-red-600">
          Browse Menu
        </Link>
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
        {role === "vendor" && (
          <Badge className="capitalize bg-amber-500 text-black hover:bg-amber-500">
            {user?.subscriptionPlan || "free"} plan
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={user?.name} />
            <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium">
            {user?.name}
          </span>
        </div>
        <div className="md:hidden">
          <Signout />
        </div>
      </div>
    </header>
  );
}