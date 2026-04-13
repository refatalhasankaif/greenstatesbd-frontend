"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/lib/auth-token";
import { Loader2 } from "lucide-react";

interface User {
    id: string;
    role: "USER" | "MANAGER" | "ADMIN" | "MODERATOR";
    name: string;
    email: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                const currentUser = data.data;
                setUser(currentUser);


                const isAdmin = currentUser.role === "ADMIN";
                const isManager = currentUser.role === "MANAGER";
                const isModerator = currentUser.role === "MODERATOR";


                if (pathname === "/dashboard") {
                    if (isAdmin) {
                        setAuthorized(true);
                    } else if (isManager) {
                        router.push("/dashboard/properties");
                    } else if (isModerator) {
                        router.push("/dashboard/reports");
                    } else {
                        router.push("/");
                    }
                    return;
                }

                const dashboardRoutes = pathname.replace("/dashboard", "").split("/")[1];

                if (isAdmin) {

                    setAuthorized(true);
                } else if (isManager) {

                    if (dashboardRoutes === "properties" || dashboardRoutes === "bids") {
                        setAuthorized(true);
                    } else {

                        router.push("/dashboard/properties");
                    }
                } else if (isModerator) {

                    if (dashboardRoutes === "reports") {
                        setAuthorized(true);
                    } else {

                        router.push("/dashboard/reports");
                    }
                } else {

                    router.push("/");
                }
            } catch (error) {
                console.error("Failed to check access:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Checking access...</p>
                    <Loader2 className="animate-spin mx-auto" size={32} />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
