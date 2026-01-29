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
    { id: "1", title: "Water Supply Issue in Sector 4", description: "Resolved by Worker EMP-8024", time: "2 hrs ago", status: "resolved" as const },
    { id: "2", title: "New Grievance #4021", description: "Reported by Citizen: 'Potholes on Main Rd'", time: "4 hrs ago", status: "pending" as const },
    { id: "3", title: "Worker Assigned", description: "EMP-4921 assigned to 'Street Light #91'", time: "5 hrs ago", status: "in-progress" as const },
    { id: "4", title: "Grievance Rejected", description: "Duplicate report #4010 was closed", time: "1 day ago", status: "rejected" as const },
];

export default function AdminDashboard() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Admin Dashboard"
                    description="Welcome back, Administrator. Here's what's happening."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {ADMIN_STATS.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chart Placeholder */}
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 h-80 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-blue-500/5 to-transparent opacity-50" />
                            <div className="text-center z-10">
                                <TrendingUp size={48} className="mx-auto text-slate-700 mb-4 group-hover:text-purple-500 transition-colors" />
                                <p className="text-slate-500 font-medium">Analytics & Reports Chart</p>
                                <p className="text-slate-600 text-sm mt-1 mb-4">(Visualize resolution trends here)</p>
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
