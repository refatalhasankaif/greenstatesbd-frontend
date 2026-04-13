"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Users, Building2, FileText, Gavel, Flag, TrendingUp, Images } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers?: number;
  totalProperties?: number;
  activeProperties?: number;
  totalBids?: number;
  activeBids?: number;
  totalBlogs?: number;
  totalReports?: number;
  pendingReports?: number;
  totalGallery?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.role);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.data?.data?.stats || {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Users - Admin only */}
        {userRole === "ADMIN" && (
          <Link href="/dashboard/users" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </Link>
        )}

        {/* Properties - Admin and Manager */}
        {(userRole === "ADMIN" || userRole === "MANAGER") && (
          <Link href="/dashboard/properties" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.activeProperties || stats.totalProperties || 0}</p>
            <p className="text-sm text-muted-foreground">Properties</p>
          </Link>
        )}

        {/* Bids - Admin and Manager */}
        {(userRole === "ADMIN" || userRole === "MANAGER") && (
          <Link href="/dashboard/bids" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Gavel className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.activeBids || stats.totalBids || 0}</p>
            <p className="text-sm text-muted-foreground">Bids</p>
          </Link>
        )}

        {/* Reports - Admin and Moderator */}
        {(userRole === "ADMIN" || userRole === "MODERATOR") && (
          <Link href="/dashboard/reports" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Flag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.pendingReports || stats.totalReports || 0}</p>
            <p className="text-sm text-muted-foreground">Reports</p>
          </Link>
        )}

        {/* Blogs - Admin only */}
        {userRole === "ADMIN" && (
          <Link href="/dashboard/blogs" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalBlogs || 0}</p>
            <p className="text-sm text-muted-foreground">Blogs</p>
          </Link>
        )}

        {/* Gallery - Admin only */}
        {userRole === "ADMIN" && (
          <Link href="/dashboard/gallery" className="bg-card border border-border rounded-xl p-4 hover:border-primary transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Images className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalGallery || 0}</p>
            <p className="text-sm text-muted-foreground">Gallery</p>
          </Link>
        )}
      </div>
    </div>
  );
}
