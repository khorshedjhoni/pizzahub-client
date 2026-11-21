"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  ShieldBan,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { toggleBlockUser } from "@/lib/action/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PH"
  );
}

const ROLE_META = {
  customer: { label: "Customer", variant: "secondary" },
  vendor: { label: "Vendor", variant: "default" },
  admin: { label: "Admin", variant: "premium" },
};

export default function UsersTable({ users = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workingId, setWorkingId] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        [user.name, user.email, user.restaurantName].some((value) =>
          String(value || "").toLowerCase().includes(term),
        );
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked" ? user.isBlocked : !user.isBlocked);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  async function handleToggle(user) {
    setWorkingId(user.id);
    const result = await toggleBlockUser(user.id, !user.isBlocked);
    setWorkingId(null);
    if (!result.success) {
      toast.error(result.error || "Could not update this user.");
      return;
    }
    toast.success(
      user.isBlocked
        ? `${user.name} has been unblocked.`
        : `${user.name} has been blocked.`,
    );
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total users",
            value: users.length,
            icon: Users,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Vendors",
            value: users.filter((user) => user.role === "vendor").length,
            icon: UserRound,
            tone: "bg-orange-500/10 text-orange-600",
          },
          {
            label: "Blocked",
            value: users.filter((user) => user.isBlocked).length,
            icon: ShieldBan,
            tone: "bg-destructive/10 text-destructive",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-4 py-3.5 shadow-sm"
            >
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="mt-0.5 font-display text-xl font-black">
                  {card.value}
                </p>
              </div>
              <span className={`flex size-9 items-center justify-center rounded-xl ${card.tone}`}>
                <Icon className="size-4" />
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or restaurant…"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-full border border-border p-1">
              {[
                { value: "all", label: "All roles" },
                { value: "customer", label: "Customers" },
                { value: "vendor", label: "Vendors" },
                { value: "admin", label: "Admins" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setRoleFilter(tab.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    roleFilter === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex rounded-full border border-border p-1">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "blocked", label: "Blocked" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === tab.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const role = ROLE_META[user.role] || ROLE_META.customer;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={user.image || ""} alt={user.name} />
                          <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="max-w-[12rem] truncate text-sm font-bold">
                            {user.name}
                          </p>
                          <p className="max-w-[14rem] truncate text-[11px] text-muted-foreground">
                            {user.restaurantName || user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.variant}>{role.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={user.plan === "premium" ? "premium" : "outline"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={user.isBlocked ? "outline" : "ghost"}
                              className={
                                user.isBlocked
                                  ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400"
                                  : "text-destructive hover:bg-destructive/10"
                              }
                              disabled={workingId === user.id}
                            >
                              {workingId === user.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : user.isBlocked ? (
                                <ShieldCheck className="size-3.5" />
                              ) : (
                                <ShieldBan className="size-3.5" />
                              )}
                              {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.isBlocked
                                  ? `Unblock ${user.name}?`
                                  : `Block ${user.name}?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {user.isBlocked
                                  ? "They will be able to sign in and use PizzaHub again."
                                  : "They will be signed out and cannot sign in until unblocked."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleToggle(user)}>
                                {user.isBlocked ? "Unblock user" : "Block user"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Users className="size-7 text-muted-foreground" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">No users found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {users.length
                ? "Try a different search, role or status filter."
                : "Users will appear here after they sign up."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
