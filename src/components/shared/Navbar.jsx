"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pizza, Sun, Moon, LayoutDashboard, UserCog } from "lucide-react";
import Signout from "./Signout";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();
  const user = session?.user;

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "vendor"
      ? "/dashboard/vendor"
      : "/dashboard/customer";

  const profileHref =
    user?.role === "admin"
      ? "/dashboard/admin/profile"
      : user?.role === "vendor"
      ? "/dashboard/vendor/profile"
      : "/dashboard/customer/profile";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-red-600"
        >
          <Pizza className="h-7 w-7 text-orange-500" />
          <span>PizzaHub</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-red-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium hover:text-red-600 transition-colors"
          >
            Browse Menu
          </Link>

          {!isPending && user && (
            <Link
              href={dashboardHref}
              className="hidden sm:inline-block text-sm font-medium hover:text-red-600 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border p-1 pr-3 hover:bg-muted transition-colors"
                  />
                }
              >
                <Avatar className="h-7 w-7">
  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
  <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
    {user?.name?.charAt(0)?.toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user.name}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs font-normal capitalize text-muted-foreground">
                      {user.role || "customer"}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    nativeButton={false}
                    render={
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    nativeButton={false}
                    render={
                      <Link
                        href={profileHref}
                        className="flex items-center gap-2"
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    }
                  />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Signout asMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                nativeButton={false}
                variant="ghost"
                size="sm"
                render={<Link href="/signin">Sign In</Link>}
              />
              <Button
                nativeButton={false}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                render={<Link href="/signup">Sign Up</Link>}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}