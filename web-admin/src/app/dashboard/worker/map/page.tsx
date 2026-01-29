"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    CheckSquare,
    Navigation,
    Crosshair,
    Route,
    Clock,
    AlertTriangle
} from "lucide-react";

// FIX: Standard dynamic import for Default Export components
// Ensure src/components/dashboard/LiveMap.tsx has 'export default function LiveMap'
const LiveMap = dynamic(
    () => import("@/components/dashboard/LiveMap"),
    { 
        ssr: false, 
        loading: () => (
            <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p>Loading map...</p>
                </div>
            </div>
        )
    }
);

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Crosshair, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

// Task locations with real coordinates (New Delhi area)
const TASK_LOCATIONS = [
    {
        id: "T-101",
        title: "Fix Street Light #901",
        area: "Sector 4 Main Rd",
        lat: 28.6289,
        lng: 77.2065,
        eta: "12 min",
        priority: "High" as const,
        status: "In Progress"
    },
    {
        id: "T-102",
        title: "Pothole Repair",
        area: "Market Complex Entry",
        lat: 28.6139,
        lng: 77.2290,
        eta: "22 min",
        priority: "Medium" as const,
        status: "Assigned"
    },
    {
        id: "T-103",
        title: "Water Valve Inspection",
        area: "Block 7, Lane 3",
        lat: 28.5989,
        lng: 77.2190,
        eta: "35 min",
        priority: "Low" as const,
        status: "Queued"
    }
];

export default function WorkerMapView() {
    const [liveTracking, setLiveTracking] = useState(true);
    const [mapMounted, setMapMounted] = useState(false);

    useEffect(() => {
        setMapMounted(true);
    }, []);

    const handleOptimizeRoute = () => {
        alert("🚀 Route optimized! Tasks reordered by proximity for fastest completion.");
    };

    const handleNearbyAlerts = () => {
        alert("⚠️ Nearby Alerts:\n• Road construction on Main Rd (500m away)\n• Traffic congestion near Market Complex\n• Weather alert: Light rain expected");
    };

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <Header
                    title="Location Map"
                    description="Track active tasks, route progress, and nearby alerts."
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <Navigation size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Live Field Map</h3>
                                        <p className="text-sm text-slate-500">Showing active route and task markers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Crosshair size={14} className="text-emerald-400" />
                                        Live GPS: {liveTracking ? "Active" : "Paused"}
                                    </div>
                                    <button
                                        onClick={() => setLiveTracking(!liveTracking)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${liveTracking ? "bg-emerald-600" : "bg-slate-700"}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${liveTracking ? "left-6" : "left-1"}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="h-[420px] relative">
                                {mapMounted && <LiveMap tasks={TASK_LOCATIONS} liveTracking={liveTracking} />}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button onClick={handleOptimizeRoute} className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <Route size={18} />
                                    <span className="font-semibold">Optimize Route</span>
                                </div>
                                <p className="text-sm text-slate-500">Auto-arrange stops for fastest completion</p>
                            </button>
                            <button onClick={handleNearbyAlerts} className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-blue-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-blue-400 mb-2">
                                    <AlertTriangle size={18} />
                                    <span className="font-semibold">Nearby Alerts</span>
                                </div>
                                <p className="text-sm text-slate-500">View hazards and blocked access points</p>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Task Locations</h3>
                            <div className="space-y-4">
                                {TASK_LOCATIONS.map((task) => (
                                    <div key={task.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-white">{task.title}</span>
                                            <span className="text-xs text-emerald-400">{task.status}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">{task.area}</div>
                                        <div className="flex items-center justify-between mt-3 text-xs">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={12} />
                                                ETA {task.eta}
                                            </div>
                                            <span className="text-xs text-purple-300">{task.priority} Priority</span>
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