"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        if (loading || !pathname) return;

        if (!user) {
            if (pathname.startsWith("/dashboard/admin")) router.replace("/auth/admin");
            else if (pathname.startsWith("/dashboard/worker")) router.replace("/auth/worker");
            else router.replace("/auth/citizen");
            return;
        }

        if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
            router.replace("/auth/admin");
            return;
        }

        if (pathname.startsWith("/dashboard/worker") && role !== "WORKER") {
            router.replace("/auth/worker");
            return;
        }

        if (pathname.startsWith("/dashboard/citizen") && role !== "USER") {
            router.replace("/auth/citizen");
        }
    }, [loading, pathname, role, router, user]);

    return <>{children}</>;
}
