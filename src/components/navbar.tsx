"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
    Home,
    Compass,
    Sparkles,
    Building2,
    LifeBuoy,
    LayoutDashboard,
    ChevronDown,
    Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ui/theme-switcher";
import { SheetTitle } from "@/components/ui/sheet";

const Navbar = ({ className }: { className?: string }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState<string | null>(null);

    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!navRef.current?.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const toggleMenu = (name: string) => {
        setOpenMenu((prev) => (prev === name ? null : name));
    };

    const toggleMobile = (name: string) => {
        setMobileOpen((prev) => (prev === name ? null : name));
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
        {
            title: "AI",
            icon: <Sparkles size={16} />,
            items: [
                { title: "AI Chat", url: "/ai" },
                { title: "Voice Assistant", url: "/voice-assistant" },
            ],
        },
        {
            title: "Properties",
            icon: <Building2 size={16} />,
            url: "/properties",
        },
        {
            title: "Support",
            icon: <LifeBuoy size={16} />,
            url: "/support",
        },
        {
            title: "Dashboard",
            icon: <LayoutDashboard size={16} />,
            url: "/dashboard",
        },
    ];

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b bg-background/80 backdrop-blur",
                className
            )}
        >
            <div
                ref={navRef}
                className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between"
            >
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="logo" width={32} height={32} />
                        <span className="font-semibold">GreenStatesBD</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-2">
                        {menu.map((item) => {
                            if (item.items) {
                                return (
                                    <div key={item.title} className="relative">
                                        <button
                                            onClick={() => toggleMenu(item.title)}
                                            className="flex items-center gap-2 h-10 px-3 rounded-md text-sm hover:bg-muted transition cursor-pointer"
                                        >
                                            {item.icon}
                                            {item.title}
                                            <ChevronDown
                                                size={14}
                                                className={cn(
                                                    "transition-transform",
                                                    openMenu === item.title && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        {openMenu === item.title && (
                                            <div className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-popover shadow-md p-2 z-50">
                                                {item.items.map((sub) => (
                                                    <Link
                                                        key={sub.title}
                                                        href={sub.url}
                                                        onClick={() => setOpenMenu(null)}
                                                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer"
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.title}
                                    href={item.url!}
                                    className="flex items-center gap-2 h-10 px-3 rounded-md text-sm hover:bg-muted cursor-pointer"
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                        <ModeToggle />
                    </div>

                    <Button variant="outline" size="sm" className="h-10">
                        <Link href="/login">Login</Link>
                    </Button>

                    <Button size="sm" className="h-10">
                        <Link href="/register">Register</Link>
                    </Button>
                </div>

                <div className="lg:hidden flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                        <ModeToggle />
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 lg:h-10 lg:w-10"
                            >
                                <Menu size={16} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-70 p-6">
                            <SheetTitle className="sr-only">
                                Mobile Navigation Menu
                            </SheetTitle>
                            <div className="flex flex-col gap-4 mt-6">
                                {menu.map((item) => (
                                    <div key={item.title}>
                                        {item.items ? (
                                            <>
                                                <button
                                                    onClick={() => toggleMobile(item.title)}
                                                    className="flex w-full items-center justify-between py-2 text-sm font-medium cursor-pointer"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {item.icon}
                                                        {item.title}
                                                    </span>

                                                    <ChevronDown
                                                        size={14}
                                                        className={cn(
                                                            "transition-transform",
                                                            mobileOpen === item.title && "rotate-180"
                                                        )}
                                                    />
                                                </button>

                                                {mobileOpen === item.title && (
                                                    <div className="ml-0 mt-2 flex flex-col gap-2 border-l pl-3">
                                                        {item.items.map((sub) => (
                                                            <Link
                                                                key={sub.title}
                                                                href={sub.url}
                                                                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
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
                                                className="flex items-center gap-2 py-2 text-sm font-medium cursor-pointer"
                                            >
                                                {item.icon}
                                                {item.title}
                                            </Link>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-6 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full h-10">
                                        <Link href="/login">Login</Link>
                                    </Button>

                                    <Button className="w-full h-10">
                                        <Link href="/register">Register</Link>
                                    </Button>
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