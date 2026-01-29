"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
    LayoutDashboard,
    Hammer,
    MapPin,
    Calendar,
    CheckSquare,
    Clock,
    Navigation,
    AlertCircle
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Hammer, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const WORKER_STATS = [
    { label: "Assigned Tasks", value: "12", icon: Hammer, color: "blue", trend: "3 new", trendUp: true },
    { label: "In Progress", value: "4", icon: Clock, color: "orange" },
    { label: "Avg Resolution", value: "2 Days", icon: Calendar, color: "emerald", trend: "-10%", trendUp: true },
    { label: "Pending", value: "1", icon: AlertCircle, color: "rose" },
];

const WORKER_TASKS = [
    { id: "1", title: "Fix Street Light #901", description: "Priority: High • Location: Sector 4 Main Rd", time: "Assigned 2 hrs ago", status: "in-progress" as const },
    { id: "2", title: "Garbage Collection Zone B", description: "Route: Daily Routine", time: "Due Today", status: "pending" as const },
    { id: "3", title: "Pothole Repair", description: "Location: Market Complex Entry", time: "Completed yesterday", status: "resolved" as const },
];

export default function WorkerDashboard() {
    const { t } = useSettings();
    const handleAction = (action: string) => {
        alert(`${action} reported/updated successfully!`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title={t("Field Dashboard")}
                    description="Good Morning, Worker EMP-8024. You have 12 active tasks."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {WORKER_STATS.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <RecentActivity items={WORKER_TASKS} />

                        {/* Map Placeholder */}
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 h-64 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-900/10" />
                            <Navigation size={48} className="text-emerald-500/50 mb-4" />
                            <div className="absolute inset-x-0 bottom-4 text-center">
                                <p className="text-emerald-400 font-medium text-sm">Live GPS Tracking Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Quick Actions or Notifications */}
                        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Urgent Actions</h3>
                            <button
                                onClick={() => handleAction("Obstruction")}
                                className="w-full py-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-3 hover:bg-orange-500/20 transition-all font-medium text-sm"
                            >
                                Report Obstruction
                            </button>
                            <button
                                onClick={() => handleAction("Task Completion")}
                                className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-medium text-sm"
                            >
                                Mark Current Task Complete
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

