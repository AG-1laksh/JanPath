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
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useMemo, useState } from "react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Hammer, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

type WorkerTask = {
    id: string;
    title?: string;
    description?: string;
    status?: string;
    createdAt?: any;
};

export default function WorkerDashboard() {
    const { t } = useSettings();
    const { user, profile } = useAuth();
    const [tasks, setTasks] = useState<WorkerTask[]>([]);

    useEffect(() => {
        if (!db || !user) return;
        const tasksQuery = query(
            collection(db, "grievances"),
            where("assignedWorkerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            setTasks(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as WorkerTask[]);
        });
        return () => unsubscribe();
    }, [user]);

    const workerStats = useMemo(() => {
        const assigned = tasks.length;
        const inProgress = tasks.filter((t) => t.status === "In Progress" || t.status === "Assigned").length;
        const pending = tasks.filter((t) => t.status === "Submitted").length;
        return [
            { label: "Assigned Tasks", value: assigned.toString(), icon: Hammer, color: "blue" },
            { label: "In Progress", value: inProgress.toString(), icon: Clock, color: "orange" },
            { label: "Avg Resolution", value: "-", icon: Calendar, color: "emerald" },
            { label: "Pending", value: pending.toString(), icon: AlertCircle, color: "rose" },
        ];
    }, [tasks]);
    const handleAction = (action: string) => {
        alert(`${action} reported/updated successfully!`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title={t("Field Dashboard")}
                    description={`${t("Good Morning")}, ${profile?.name || "Worker"} | ${t("Department")}: ${t(profile?.department || "N/A")}`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {workerStats.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <RecentActivity items={tasks.map((task) => ({
                            id: task.id,
                            title: task.title || "Assigned Task",
                            description: task.description || "",
                            time: task.createdAt?.toDate ? task.createdAt.toDate().toLocaleString() : "",
                            status: (task.status || "pending") as any,
                        }))} />

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

