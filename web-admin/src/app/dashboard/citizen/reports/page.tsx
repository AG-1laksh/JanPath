"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    FileText,
    Users,
    Eye,
    MessageSquare,
    BarChart,
    PieChart,
    Map
} from "lucide-react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

export default function ReportsPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Reports & Analytics" description="Visual insights into city performance." />

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Resolution Trends Chart (CSS Bar Chart) */}
                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart className="text-purple-400" /> Resolution Trends
                            </h3>
                            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 text-slate-400 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last Month</option>
                            </select>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                            {[40, 65, 30, 85, 55, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-purple-900/50 to-purple-500 rounded-t-lg transition-all group-hover:bg-purple-400 relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">Day {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Complaint Category Distribution */}
                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                            <PieChart className="text-blue-400" /> Category Distribution
                        </h3>
                        <div className="space-y-5">
                            {[
                                { label: "Sanitation", val: 45, color: "bg-blue-500" },
                                { label: "Roads", val: 30, color: "bg-orange-500" },
                                { label: "Water", val: 15, color: "bg-cyan-500" },
                                { label: "Electricity", val: 10, color: "bg-yellow-500" }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">{item.label}</span>
                                        <span className="text-slate-500">{item.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Map className="text-rose-400" /> Issue Heatmap (Density by Sector)
                    </h3>

                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                        {Array.from({ length: 48 }).map((_, i) => {
                            // Generate random density
                            const density = Math.random();
                            const color = density > 0.8 ? 'bg-rose-500/80' :
                                density > 0.5 ? 'bg-orange-500/60' :
                                    density > 0.2 ? 'bg-yellow-500/40' : 'bg-emerald-500/20';

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-md ${color} hover:scale-110 transition-transform cursor-pointer relative group`}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/50 opacity-0 group-hover:opacity-100">
                                        S-{i + 1}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-6 mt-6 text-xs text-slate-500 justify-end">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20" /> Low</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/40" /> Moderate</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500/60" /> High</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500/80" /> Critical</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

