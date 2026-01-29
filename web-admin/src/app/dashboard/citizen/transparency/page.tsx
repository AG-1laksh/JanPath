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
    Clock,
    CheckCircle,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

const PUBLIC_GRIEVANCES = [
    {
        id: "PUB-102",
        title: "Major Bridge Repair - Sector 9",
        status: "In Progress",
        stage: 2, // 0: Reported, 1: Verified, 2: In Progress, 3: Completed
        updates: [
            { date: "Jan 28", text: "Contractor assigned. Materials arrived." },
            { date: "Jan 25", text: "Structural safety audit completed." },
            { date: "Jan 20", text: "Issue reported by 45 citizens." }
        ],
        votes: 342
    },
    {
        id: "PUB-105",
        title: "Street Cleaning Drive - Main Avenue",
        status: "Completed",
        stage: 3,
        updates: [
            { date: "Jan 29", text: "Drive completed successfully. 2 tons waste removed." },
            { date: "Jan 28", text: "Team deployed at 6:00 AM." }
        ],
        votes: 120
    }
];

export default function TransparencyWallPage() {
    return (
        <div className="flex h-screen bg-[#F0F4F8] text-slate-800 overflow-hidden font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Transparency Wall" description="Real-time public tracking of major civic issues." />

                <div className="grid gap-6">
                    {PUBLIC_GRIEVANCES.map((grievance, idx) => (
                        <div key={grievance.id} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left: Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                                            {grievance.id}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-purple-400 font-medium">
                                            <Users size={12} /> {grievance.votes} Citizens tracking
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{grievance.title}</h3>

                                    {/* Timeline */}
                                    <div className="border-l-2 border-white/10 ml-2 space-y-6 pl-6 relative py-2">
                                        {grievance.updates.map((update, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[#0a0a0a]" />
                                                <div className="text-sm font-semibold text-white">{update.text}</div>
                                                <div className="text-xs text-slate-500">{update.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Progress Visual */}
                                <div className="w-full md:w-80 shrink-0 bg-white/5 rounded-2xl p-6 flex flex-col justify-center">
                                    <h4 className="text-sm font-medium text-slate-400 mb-6 text-center uppercase tracking-wider">Current Status</h4>

                                    <div className="flex justify-between items-center relative mb-8 px-2">
                                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10" />

                                        {[0, 1, 2, 3].map((step) => (
                                            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-[#1a1a1a] transition-colors
                                                ${step <= grievance.stage ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}
                                            `}>
                                                {step === 3 ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <div className={`text-xl font-bold ${grievance.status === 'Completed' ? 'text-emerald-400' : 'text-purple-400'
                                            }`}>
                                            {grievance.status}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {grievance.status === 'Completed' ? "Issue resolved and verified." : "Work is currently underway."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
