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

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

const ADMIN_STATS = [
    { label: "Total Grievances", value: "1,284", icon: FileText, color: "purple", trend: "+12.5%", trendUp: true },
    { label: "Pending Resolution", value: "342", icon: AlertTriangle, color: "rose", trend: "+4.2%", trendUp: false },
    { label: "Resolved This Week", value: "856", icon: CheckCircle, color: "emerald", trend: "+18.2%", trendUp: true },
    { label: "Avg Response Time", value: "4.2 hrs", icon: Activity, color: "blue", trend: "-1.5 hrs", trendUp: true },
];

const RECENT_ACTIVITY = [
    { id: "1", title: "New Grievance Report", description: "Water supply issue in Sector 4", time: "2 min ago", status: "pending" as const },
    { id: "2", title: "Worker Assigned", description: "Ramesh assigned to Road Repair", time: "15 min ago", status: "in-progress" as const },
    { id: "3", title: "Grievance Resolved", description: "Street light fixed in Block C", time: "1 hour ago", status: "resolved" as const },
    { id: "4", title: "System Update", description: "Maintenance scheduled for tonight", time: "3 hours ago" },
];

export default function AdminDashboard() {
    const { t } = useSettings();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-background text-foreground">
                <Header
                    title={t("Admin Dashboard")}
                    description={`${t("Welcome back")}, Administrator.`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {ADMIN_STATS.map((stat, i) => (
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
                        <RecentActivity items={RECENT_ACTIVITY} />
                    </div>
                </div>
            </main>
        </div>
    );
}
