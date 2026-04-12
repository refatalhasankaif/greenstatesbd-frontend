"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import {
    Home, Compass, Sparkles, Building2, LifeBuoy, LayoutDashboard,
    ChevronDown, Menu, MessageSquare, Flag, LogOut, UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ui/theme-switcher";
import { IUser } from "@/types/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ─────────────────────────────────────────────
// User store backed by localStorage
// ─────────────────────────────────────────────
const USER_STORE_EVENT = "user-store-update";

/**
 * Module-level cache so getStoredUser returns the same object
 * reference when data hasn't changed — required by useSyncExternalStore.
 */
let _cachedRaw: string | null | undefined = undefined; // undefined = not yet read
let _cachedUser: IUser | null = null;

function getStoredUser(): IUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("user"); // null if missing
        // ✅ Same raw string → return the exact same object reference
        if (raw === _cachedRaw) return _cachedUser;

        _cachedRaw = raw;

        if (!raw) {
            _cachedUser = null;
            return null;
        }

        const parsed = JSON.parse(raw) as IUser;
        if (!parsed?.id || !parsed?.email || !parsed?.name) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            _cachedRaw = null;
            _cachedUser = null;
            return null;
        }

        _cachedUser = parsed;
        return _cachedUser;
    } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        _cachedRaw = null;
        _cachedUser = null;
        return null;
    }
}

function subscribeToUserStore(callback: () => void): () => void {
    window.addEventListener(USER_STORE_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
        window.removeEventListener(USER_STORE_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

/** Call after writing/deleting user in localStorage so the navbar re-syncs. */
export function notifyUserStore() {
    _cachedRaw = undefined; // bust the cache so the next snapshot re-parses
    window.dispatchEvent(new Event(USER_STORE_EVENT));
}

// ─────────────────────────────────────────────
// Role helpers
// ─────────────────────────────────────────────
const PRO_ROLES = ["ADMIN", "MANAGER", "MODERATOR", "SUPPORT_AGENT"];
const hasProAccess = (role?: string) => (role ? PRO_ROLES.includes(role) : false);

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────
function Avatar({ user, size = 32 }: { user: IUser; size?: number }) {
    const initials = (user.name ?? "U")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (user.profileImage) {
        return (
            <Image
                src={user.profileImage}
                alt={user.name ?? "User"}
                width={size}
                height={size}
                className="rounded-full object-cover shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold select-none shrink-0"
            style={{ width: size, height: size }}
        >
            {initials}
        </div>
    );
}

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────
const Navbar = ({ className }: { className?: string }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const user = useSyncExternalStore(
        subscribeToUserStore,
        getStoredUser,
        () => null, // server snapshot — always null, matches SSR output
    );

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
            if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    const handleLogout = async () => {
        try { await signOut(auth); } catch { /* best effort */ }
        Cookies.remove("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        notifyUserStore();
        setProfileOpen(false);
        window.location.href = "/";
    };

    const menu = [
        {
            title: "Home",
            icon: <Home size={16} />,
            items: [
                { title: "Hero", url: "/#hero" },
                { title: "Our Services", url: "/#service" },
                { title: "Property Showcase", url: "/#showcase" },
                { title: "Why Trust Us", url: "/#why-trust-us" },
                { title: "Certification", url: "/#certification" },
                { title: "Our Service Area", url: "/#service-area" },
                { title: "About Us", url: "/#about" },
                { title: "Frequently Asked Questions", url: "/#faq" },
            ],
        },
        {
            title: "Explore",
            icon: <Compass size={16} />,
            items: [
                { title: "Gallery", url: "/gallery" },
                { title: "Blogs", url: "/blogs" },
            ],
        },
        { title: "Properties", icon: <Building2 size={16} />, url: "/properties" },
        { title: "Support", icon: <LifeBuoy size={16} />, url: "/support" },
        { title: "Dashboard", icon: <LayoutDashboard size={16} />, url: "/dashboard" },
        ...(user && hasProAccess(user.role)
            ? [{ title: "Pro Panel", icon: <Sparkles size={16} />, url: "/pro-panel" }]
            : []),
        { title: "AI", icon: <Sparkles size={16} />, url: "/ai" },
    ];

    const profileLinks = [
        { title: "Profile", href: "/profile", icon: <UserCircle size={15} /> },
        { title: "Chats", href: "/chats", icon: <MessageSquare size={15} /> },
        { title: "Reports", href: "/reports", icon: <Flag size={15} /> },
    ];

    return (
        <header className={cn("sticky top-0 z-50 border-b bg-background/80 backdrop-blur", className)}>
            <div ref={navRef} className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image src="/logo.png" alt="logo" width={32} height={32} />
                        <span className="font-semibold">GreenStatesBD</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {menu.map((item) =>
                            item.items ? (
                                <div key={item.title} className="relative">
                                    <button
                                        onClick={() => setOpenMenu((p) => (p === item.title ? null : item.title))}
                                        className="flex items-center gap-1.5 h-9 px-3 rounded-md text-sm hover:bg-muted transition cursor-pointer"
                                    >
                                        {item.icon}{item.title}
                                        <ChevronDown
                                            size={13}
                                            className={cn("transition-transform duration-200", openMenu === item.title && "rotate-180")}
                                        />
                                    </button>
                                    {openMenu === item.title && (
                                        <div className="absolute left-0 top-full mt-2 w-52 rounded-lg border bg-popover shadow-lg p-1.5 z-50">
                                            {item.items.map((sub) => (
                                                <Link
                                                    key={sub.title}
                                                    href={sub.url}
                                                    onClick={() => setOpenMenu(null)}
                                                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition"
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.title}
                                    href={item.url!}
                                    className="flex items-center gap-1.5 h-9 px-3 rounded-md text-sm hover:bg-muted transition"
                                >
                                    {item.icon}{item.title}
                                </Link>
                            )
                        )}
                    </nav>
                </div>

                {/* Desktop right */}
                <div className="hidden lg:flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                        <ModeToggle />
                    </div>

                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen((v) => !v)}
                                className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-muted transition cursor-pointer"
                            >
                                <Avatar user={user} size={30} />
                                <span className="text-sm font-medium max-w-30 truncate">{user.name}</span>
                                <ChevronDown
                                    size={13}
                                    className={cn("transition-transform duration-200 text-muted-foreground", profileOpen && "rotate-180")}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border bg-popover shadow-lg p-1.5 z-50">
                                    <div className="px-3 py-2 mb-1">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="border-t my-1" />
                                    {profileLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition"
                                        >
                                            {link.icon}{link.title}
                                        </Link>
                                    ))}
                                    <div className="border-t my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition cursor-pointer"
                                    >
                                        <LogOut size={15} />Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" className="h-9" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button size="sm" className="h-9" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile right */}
                <div className="lg:hidden flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                        <ModeToggle />
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="h-9 w-9">
                                <Menu size={16} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-0 overflow-y-auto">
                            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                            <div className="flex flex-col p-5 gap-1">
                                {user && (
                                    <div className="flex items-center gap-3 pb-4 mb-2 border-b">
                                        <Avatar user={user} size={40} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {menu.map((item) => (
                                    <div key={item.title}>
                                        {item.items ? (
                                            <>
                                                <button
                                                    onClick={() => setMobileOpen((p) => (p === item.title ? null : item.title))}
                                                    className="flex w-full items-center justify-between py-2.5 px-2 text-sm font-medium cursor-pointer rounded-md hover:bg-muted transition"
                                                >
                                                    <span className="flex items-center gap-2">{item.icon}{item.title}</span>
                                                    <ChevronDown
                                                        size={13}
                                                        className={cn("transition-transform duration-200", mobileOpen === item.title && "rotate-180")}
                                                    />
                                                </button>
                                                {mobileOpen === item.title && (
                                                    <div className="ml-2 my-1 flex flex-col border-l pl-4">
                                                        {item.items.map((sub) => (
                                                            <Link
                                                                key={sub.title}
                                                                href={sub.url}
                                                                className="py-2 text-sm text-muted-foreground hover:text-foreground transition"
                                                            >
                                                                {sub.title}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                href={item.url!}
                                                className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium rounded-md hover:bg-muted transition"
                                            >
                                                {item.icon}{item.title}
                                            </Link>
                                        )}
                                    </div>
                                ))}

                                <div className="border-t mt-3 pt-3 flex flex-col gap-1">
                                    {user ? (
                                        <>
                                            {profileLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium rounded-md hover:bg-muted transition"
                                                >
                                                    {link.icon}{link.title}
                                                </Link>
                                            ))}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition cursor-pointer mt-1"
                                            >
                                                <LogOut size={15} />Log out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="w-full h-10" asChild>
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button className="w-full h-10 mt-1" asChild>
                                                <Link href="/register">Register</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    );
};

export { Navbar };