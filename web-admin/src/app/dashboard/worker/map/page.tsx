"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    Navigation,
    Crosshair,
    Route,
    Clock,
    AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useSettings } from "@/context/SettingsContext";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Crosshair, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const TASK_LOCATIONS = [
    {
        id: "T-101",
        title: "Fix Street Light #901",
        area: "Sector 4 Main Rd",
        eta: "12 min",
        priority: "High",
        status: "In Progress"
    },
    {
        id: "T-102",
        title: "Pothole Repair",
        area: "Market Complex Entry",
        eta: "22 min",
        priority: "Medium",
        status: "Assigned"
    },
    {
        id: "T-103",
        title: "Water Valve Inspection",
        area: "Block 7, Lane 3",
        eta: "35 min",
        priority: "Low",
        status: "Queued"
    }
];

export default function WorkerMapView() {
    const { t } = useSettings();
    const router = useRouter();
    const [liveTracking, setLiveTracking] = useState(true);

    useEffect(() => {
        router.replace("/dashboard/worker");
    }, [router]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title={t("Redirecting")}
                    description={t("Map view has been removed.")}
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 h-[420px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-transparent" />
                            <div className="flex items-center justify-between mb-6 z-10 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <Navigation size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{t("Live Field Map")}</h3>
                                        <p className="text-sm text-slate-500">{t("Showing active route and task markers")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLiveTracking(!liveTracking)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${liveTracking ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${liveTracking ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="h-full flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <MapPin size={48} className="mx-auto text-emerald-400 mb-3" />
                                    <p className="font-medium">{t("Map integration ready")}</p>
                                    <p className="text-xs text-slate-600">{t("Connect GIS/Maps API to render routes")}</p>
                                </div>
                            </div>

                            <div className="absolute left-6 bottom-6 flex items-center gap-3 text-xs text-slate-400">
                                <Crosshair size={14} className="text-emerald-400" />
                                {t("Live GPS")}: {liveTracking ? t("Active") : t("Paused")}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <Route size={18} />
                                    <span className="font-semibold">{t("Optimize Route")}</span>
                                </div>
                                <p className="text-sm text-slate-500">{t("Auto-arrange stops for fastest completion")}</p>
                            </button>
                            <button className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-blue-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-blue-400 mb-2">
                                    <AlertTriangle size={18} />
                                    <span className="font-semibold">{t("Nearby Alerts")}</span>
                                </div>
                                <p className="text-sm text-slate-500">{t("View hazards and blocked access points")}</p>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">{t("Task Locations")}</h3>
                            <div className="space-y-4">
                                {TASK_LOCATIONS.map((task) => (
                                    <div key={task.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-white">{task.title}</span>
                                            <span className="text-xs text-emerald-400">{t(task.status)}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">{task.area}</div>
                                        <div className="flex items-center justify-between mt-3 text-xs">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={12} />
                                                {t("ETA")} {task.eta}
                                            </div>
                                            <span className="text-xs text-purple-300">{t(task.priority)} {t("Priority")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


