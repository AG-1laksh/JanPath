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
    Plus,
    Filter,
    Search,
    MapPin,
    Calendar,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

const MOCK_GRIEVANCES = [
    {
        id: "GRV-2024-001",
        category: "Sanitation",
        title: "Garbage Pileup at Sector 4 Market",
        status: "Pending",
        date: "29 Jan 2026",
        location: "Sector 4, Bokaro",
        description: "Large pile of garbage has been accumulating for 3 days."
    },
    {
        id: "GRV-2024-002",
        category: "Roads",
        title: "Deep Pothole near School Entrance",
        status: "In Progress",
        date: "25 Jan 2026",
        location: "Main Road, Dhanbad",
        description: "Dangerous pothole causing traffic issues."
    },
    {
        id: "GRV-2023-089",
        category: "Street Lights",
        title: "Street Light Malfunction",
        status: "Resolved",
        date: "10 Jan 2026",
        location: "Lane 5, Ranchi",
        description: "Street light #402 blinking continuously."
    }
];

export default function CitizenGrievances() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="My Grievances" description="Track and manage your submitted reports." />

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search grievance ID or title..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>

                    <Link href="/dashboard/citizen/grievances/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                        >
                            <Plus size={20} />
                            New Grievance
                        </motion.button>
                    </Link>
                </div>

                {/* Grievances List */}
                <div className="grid gap-4">
                    {MOCK_GRIEVANCES.map((grievance, index) => (
                        <motion.div
                            key={grievance.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-purple-400">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                                {grievance.id}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${grievance.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    grievance.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {grievance.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{grievance.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{grievance.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {grievance.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} />
                                        {grievance.location}
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}

