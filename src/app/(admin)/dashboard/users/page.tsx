"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, UserCheck, UserX, MoreVertical } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  profileImage?: string;
}

const ROLES = ["USER", "MANAGER", "ADMIN", "MODERATOR"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchUsers = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const token = getToken();
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenData.sub || tokenData.id);
      } catch (err) {
        console.error("Failed to parse token", err);
      }
    }
    fetchUsers(page);
  }, [page]);

  const toggleBlock = async (userId: string, currentStatus: boolean) => {

    if (userId === currentUserId) {
      toast.error("You cannot block yourself");
      return;
    }
    
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !currentStatus } : u));
      toast.success(!currentStatus ? "User blocked" : "User unblocked");
    } catch {
      toast.error("Failed to update user");
    }
    setOpenMenu(null);
  };

  const updateRole = async (userId: string, newRole: string) => {

    if (userId === currentUserId) {
      toast.error("You cannot change your own role");
      setUsers([...users]);
      return;
    }
    
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
    setOpenMenu(null);
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={user.id === currentUserId}
                        className={`${user.id === currentUserId ? "opacity-50 cursor-not-allowed" : ""} bg-background border border-border rounded px-2 py-1 text-sm text-foreground`}
                        title={user.id === currentUserId ? "Cannot change your own role" : ""}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="p-2 hover:bg-accent rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-4 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 py-1 min-w-32">
                          <button
                            onClick={() => toggleBlock(user.id, user.isBlocked)}
                            disabled={user.id === currentUserId || ["ADMIN", "MODERATOR", "MANAGER"].includes(user.role)}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${
                              user.id === currentUserId || ["ADMIN", "MODERATOR", "MANAGER"].includes(user.role)
                                ? "opacity-50 cursor-not-allowed text-muted-foreground"
                                : "hover:bg-accent"
                            }`}
                            title={user.id === currentUserId ? "Cannot block yourself" : ["ADMIN", "MODERATOR", "MANAGER"].includes(user.role) ? "Cannot block staff" : ""}
                          >
                            {user.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
