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
    Shield,
    AlertTriangle,
    Users as UsersIcon,
    MapPin,
    Trophy
} from "lucide-react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

const STRICT_ZONES = [
    {
        id: 1,
        name: "No Parking Zone: Sector 4 Market",
        status: "Active Enforcement",
        fines: 124,
        description: "Strict towing of vehicles parked in unauthorized areas.",
        color: "rose"
    },
    {
        id: 2,
        name: "Plastic-Free Zone: City Park",
        status: "Monitoring",
        fines: 45,
        description: "₹500 fine for usage of single-use plastics.",
        color: "orange"
    },
    {
        id: 3,
        name: "Silence Zone: Hospital Road",
        status: "Strict Complaint",
        fines: 12,
        description: "Honking prohibited. Automatic noise level detection active.",
        color: "purple"
    }
];

export default function CommunityImpactPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Community Impact" description="Track strict jurisdiction zones and community achievements." />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Strict Zones */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-rose-400">
                                <Shield className="fill-rose-500/10" /> Strict Jurisdiction Zones
                            </h2>
                            <div className="space-y-4">
                                {STRICT_ZONES.map((zone) => (
                                    <div key={zone.id} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                                                    {zone.name}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">{zone.description}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize
                                                ${zone.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    zone.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                }
                                            `}>
                                                {zone.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <AlertTriangle size={16} />
                                                Violations Reported: <span className="text-white font-semibold">{zone.fines}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin size={16} />
                                                Active since Jan 2026
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Champions */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-400" /> Community Champions
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                            ${i === 1 ? 'bg-yellow-500 text-black' :
                                                i === 2 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white'}
                                        `}>
                                            {i}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">Citizen #{8000 + i}</div>
                                            <div className="text-xs text-slate-400">Reported {10 - i} critical issues</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Impact Stats</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-3xl font-bold text-emerald-400 mb-1">12%</div>
                                    <div className="text-sm text-emerald-200/70">Reduction in Traffic Violations</div>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-3xl font-bold text-blue-400 mb-1">850kg</div>
                                    <div className="text-sm text-blue-200/70">Plastic Waste Collected</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

