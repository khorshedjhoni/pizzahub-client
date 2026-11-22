"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  PlusCircle,
  ClipboardList,
  Crown,
  Users,
  CheckSquare,
  Receipt,
  UserCog,
  Home,
} from "lucide-react";
import Signout from "@/components/shared/Signout";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "customer";

  const navByRole = {
    customer: [
      { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
      { label: "Profile Settings", href: "/dashboard/customer/profile", icon: UserCog },
    ],
    vendor: [
      { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
      { label: "My Menu Items", href: "/dashboard/vendor/menu", icon: Pizza },
      { label: "Add Menu Item", href: "/dashboard/vendor/menu?add=true", icon: PlusCircle },
      { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
      { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Crown },
      { label: "Profile Settings", href: "/dashboard/vendor/profile", icon: UserCog },
    ],
    admin: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Manage Menu Items", href: "/dashboard/admin/menu", icon: CheckSquare },
      { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
      { label: "Profile Settings", href: "/dashboard/admin/profile", icon: UserCog },
    ],
  };

  const links = navByRole[role] || navByRole.customer;

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r bg-card md:flex">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2 px-2">
         
         <div className="px-2">
  <Link href="/" className="group flex items-center gap-2">
    <Pizza className="h-6 w-6 shrink-0 text-red-600 transition-transform duration-200 group-hover:scale-105" />
    <div>
      <p className="font-bold text-lg leading-none transition-colors group-hover:text-red-600">
        PizzaHub
      </p>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {role} Panel
      </span>
    </div>
  </Link>
</div>
        </div>

        <nav className="space-y-1">
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <div className="px-1">
          <Signout />
        </div>
      </div>
    </aside>
  );
}