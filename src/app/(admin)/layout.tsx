"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-token";
import { IUser } from "@/types/auth";
import { Loader2, Menu, X, Home, Users, Building2, FileText, Gavel, Flag, LogOut, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";

const DASHBOARD_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["ADMIN"] },
  { href: "/dashboard/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/dashboard/properties", label: "Properties", icon: Building2, roles: ["ADMIN", "MANAGER"] },
  { href: "/dashboard/bids", label: "Bids", icon: Gavel, roles: ["ADMIN", "MANAGER"] },
  { href: "/dashboard/reports", label: "Reports", icon: Flag, roles: ["ADMIN", "MODERATOR"] },
  { href: "/dashboard/blogs", label: "Blogs", icon: FileText, roles: ["ADMIN"] },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images, roles: ["ADMIN"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData) as IUser;
        setUser(parsed);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const filteredItems = DASHBOARD_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold">Dashboard</span>
        <div className="w-9" />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Admin Panel</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {filteredItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/10 text-destructive transition mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block fixed left-0 top-0 bottom-0 bg-background border-r border-border transition-all", sidebarCollapsed ? "w-16" : "w-64")}>
        <div className="flex flex-col h-full">
          <div className={cn("p-4 border-b border-border flex items-center justify-between", sidebarCollapsed && "flex-col gap-2")}>
            {!sidebarCollapsed && <span className="font-bold text-lg">Admin Panel</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-accent rounded-lg"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <item.icon size={18} />
                {!sidebarCollapsed && item.label}
              </Link>
            ))}
          </nav>
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/10 text-destructive transition"
            >
              <LogOut size={18} />
              {!sidebarCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("transition-all min-h-screen", sidebarCollapsed ? "lg:pl-16" : "lg:pl-64")}>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
