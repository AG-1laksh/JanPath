"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    TrendingUp,
    CheckCircle,
    Activity
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

type StatusLog = {
    id: string;
    status?: string;
    remarks?: string;
    timestamp?: any;
};

export default function AdminDashboard() {
    const { t } = useSettings();
    const [grievances, setGrievances] = useState<any[]>([]);
    const [logs, setLogs] = useState<StatusLog[]>([]);

    useEffect(() => {
        if (!db) return;
        const grievancesQuery = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db) return;
        const logsQuery = query(collection(db, "statusLogs"), orderBy("timestamp", "desc"), limit(6));
        const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
            setLogs(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, []);

    const stats = useMemo(() => {
        const total = grievances.length;
        const pending = grievances.filter((g) => g.status === "Submitted" || g.status === "Assigned" || g.status === "In Progress").length;
        const resolved = grievances.filter((g) => g.status === "Resolved").length;
        const avgResponse = "-";
        return [
            { label: "Total Grievances", value: total.toString(), icon: FileText, color: "purple" },
            { label: "Pending Resolution", value: pending.toString(), icon: AlertTriangle, color: "rose" },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle, color: "emerald" },
            { label: "Avg Response Time", value: avgResponse, icon: Activity, color: "blue" },
        ];
    }, [grievances]);

    const recentActivity = useMemo(() => {
        return logs.map((log) => ({
            id: log.id,
            title: log.status || "Status Update",
            description: log.remarks || "",
            time: log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : "Just now",
            status: (log.status || "pending") as any,
        }));
    }, [logs]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-background text-foreground">
                <Header
                    title={t("Admin Dashboard")}
                    description={`${t("Welcome back")}, Administrator.`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} label={t(stat.label)} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chart Placeholder */}
                        <div className="p-6 rounded-3xl bg-card border border-border h-80 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-blue-500/5 to-transparent opacity-50" />
                            <div className="text-center z-10">
                                <TrendingUp size={48} className="mx-auto text-slate-700 mb-4 group-hover:text-purple-500 transition-colors" />
                                <p className="text-muted-foreground font-medium">{t("Analytics & Reports Chart")}</p>
                                <p className="text-muted-foreground/60 text-sm mt-1 mb-4">({t("Visualize resolution trends here")})</p>
                            </div>
                        </div>

                        {/* Additional Content / Table */}
                    </div>

                    <div className="lg:col-span-1">
                        <RecentActivity items={recentActivity} />
                    </div>
                </div>
            </main>
        </div>
    );
}
