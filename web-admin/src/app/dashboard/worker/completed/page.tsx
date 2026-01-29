"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    CheckSquare,
    Star,
    BadgeCheck,
    Filter,
    Download
} from "lucide-react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Star, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: BadgeCheck, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const COMPLETED_TASKS = [
    {
        id: "C-4021",
        title: "Pothole Repair",
        area: "Market Complex Entry",
        date: "Jan 26, 2026",
        rating: 4.6,
        verified: true
    },
    {
        id: "C-4018",
        title: "Garbage Collection Zone B",
        area: "Zone B South",
        date: "Jan 25, 2026",
        rating: 4.9,
        verified: true
    },
    {
        id: "C-4011",
        title: "Street Light Fix #901",
        area: "Sector 4 Main Rd",
        date: "Jan 23, 2026",
        rating: 4.4,
        verified: false
    }
];

export default function WorkerCompletedPage() {
    const [showVerified, setShowVerified] = useState(true);

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <Header
                    title="Completed Tasks"
                    description="Review closed tasks, ratings, and verification status."
                />

                <div className="max-w-4xl space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-slate-300 flex items-center gap-2">
                            <Filter size={14} />
                            This Month
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-slate-300 flex items-center gap-2">
                            <Download size={14} />
                            Export Report
                        </button>
                        <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
                            <span>Verified only</span>
                            <button
                                onClick={() => setShowVerified(!showVerified)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${showVerified ? "bg-emerald-600" : "bg-slate-700"}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${showVerified ? "left-6" : "left-1"}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {COMPLETED_TASKS.filter((task) => (showVerified ? task.verified : true)).map((task) => (
                            <div key={task.id} className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm text-slate-500">{task.id}</div>
                                        <div className="text-lg font-semibold text-white">{task.title}</div>
                                        <div className="text-sm text-slate-500">{task.area}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-500">Completed</div>
                                        <div className="text-sm text-white">{task.date}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Star size={14} className="text-yellow-400" />
                                        {task.rating}
                                    </div>
                                    <div className={`flex items-center gap-2 ${task.verified ? "text-emerald-400" : "text-slate-500"}`}>
                                        <BadgeCheck size={14} />
                                        {task.verified ? "Verified" : "Pending verification"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
