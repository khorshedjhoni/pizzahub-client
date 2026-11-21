"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const headers = await getBearerHeader();
        const res = await fetch(`${API_URL}/users`, { headers });
        const json = await res.json();
        setUsers(json.data || []);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      setBusyId(userId);
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ role: nextRole }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not update role");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
      );
      toast.success(`Role updated to ${nextRole}`);
    } catch {
      toast.error("Error updating role");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleBlock = async (targetUser) => {
    const nextBlocked = !targetUser.isBlocked;
    try {
      setBusyId(targetUser._id);
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };
      const res = await fetch(`${API_URL}/users/${targetUser._id}/block`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isBlocked: nextBlocked }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not update status");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? { ...u, isBlocked: nextBlocked } : u
        )
      );
      toast.success(nextBlocked ? "User blocked" : "User unblocked");
    } catch {
      toast.error("Error updating user status");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-sm text-muted-foreground">
          Update user roles or manage account access
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium text-sm">
                    {u.name || "Unnamed User"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {u.subscriptionPlan || "free"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.isBlocked ? "destructive" : "secondary"}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.role || "customer"}
                      disabled={busyId === u._id}
                      onValueChange={(val) => handleRoleChange(u._id, val)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">customer</SelectItem>
                        <SelectItem value="vendor">vendor</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={u.isBlocked ? "outline" : "destructive"}
                      disabled={busyId === u._id}
                      onClick={() => handleToggleBlock(u)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}