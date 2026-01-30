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
    CheckCircle,
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

type StatusLog = {
    id: string;
    grievanceId: string;
    status: string;
    remarks?: string;
    timestamp?: any;
};

type Grievance = {
    id: string;
    title: string;
    status: string;
    category?: string;
    createdAt?: any;
    upvotes?: string[];
    statusLogs?: StatusLog[];
};

function getStageFromStatus(status: string): number {
    switch (status) {
        case "Submitted":
            return 0;
        case "Assigned":
        case "Verified":
            return 1;
        case "In Progress":
            return 2;
        case "Resolved":
        case "Closed":
        case "Completed":
            return 3;
        default:
            return 0;
    }
}

function formatDate(timestamp: any): string {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TransparencyWallPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [statusLogs, setStatusLogs] = useState<Record<string, StatusLog[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        // Fetch recent grievances
        const grievancesQuery = query(
            collection(db, "grievances"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubGrievances = onSnapshot(grievancesQuery, (snapshot) => {
            const data = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Grievance[];

            // Filter to only show public grievances (isPublic !== false for backward compatibility)
            const publicData = data.filter((g: any) => g.isPublic !== false);

            setGrievances(publicData);
            setLoading(false);
        });

        // Fetch status logs
        const logsQuery = query(
            collection(db, "statusLogs"),
            orderBy("timestamp", "desc")
        );

        const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
            const logs = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as StatusLog[];

            // Group by grievanceId
            const grouped: Record<string, StatusLog[]> = {};
            logs.forEach((log) => {
                if (log.grievanceId) {
                    if (!grouped[log.grievanceId]) {
                        grouped[log.grievanceId] = [];
                    }
                    grouped[log.grievanceId].push(log);
                }
            });
            setStatusLogs(grouped);
        });

        return () => {
            unsubGrievances();
            unsubLogs();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
                <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />
                <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white flex items-center justify-center">
                    <Loader2 className="animate-spin" size={32} />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Transparency Wall" description="Real-time public tracking of civic issues." />

                <div className="grid gap-6">
                    {grievances.length === 0 ? (
                        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 text-center">
                            <p className="text-slate-400">No grievances reported yet. Be the first to report an issue!</p>
                        </div>
                    ) : (
                        grievances.map((grievance) => {
                            const logs = statusLogs[grievance.id] || [];
                            const stage = getStageFromStatus(grievance.status);
                            const voteCount = grievance.upvotes?.length || 0;

                            return (
                                <div key={grievance.id} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Left: Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                                                    {grievance.id.slice(-6).toUpperCase()}
                                                </span>
                                                {grievance.category && (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                                                        {grievance.category}
                                                    </span>
                                                )}
                                                {voteCount > 0 && (
                                                    <div className="flex items-center gap-1 text-xs text-purple-400 font-medium">
                                                        <Users size={12} /> {voteCount} Citizens tracking
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-4">{grievance.title}</h3>

                                            {/* Timeline */}
                                            <div className="border-l-2 border-white/10 ml-2 space-y-6 pl-6 relative py-2">
                                                {logs.length > 0 ? logs.slice(0, 5).map((log, i) => (
                                                    <div key={log.id} className="relative">
                                                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[#0a0a0a]" />
                                                        <div className="text-sm font-semibold text-white">
                                                            {log.remarks || `Status updated to ${log.status}`}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {formatDate(log.timestamp)} • {log.status}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="relative">
                                                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[#0a0a0a]" />
                                                        <div className="text-sm font-semibold text-white">Issue reported</div>
                                                        <div className="text-xs text-slate-500">{formatDate(grievance.createdAt)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Progress Visual */}
                                        <div className="w-full md:w-80 shrink-0 bg-white/5 rounded-2xl p-6 flex flex-col justify-center">
                                            <h4 className="text-sm font-medium text-slate-400 mb-6 text-center uppercase tracking-wider">Current Status</h4>

                                            <div className="flex justify-between items-center relative mb-8 px-2">
                                                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10" />

                                                {[0, 1, 2, 3].map((step) => (
                                                    <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-[#1a1a1a] transition-colors
                                                        ${step <= stage ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}
                                                    `}>
                                                        {step === 3 ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-center">
                                                <div className={`text-xl font-bold ${stage === 3 ? 'text-emerald-400' : 'text-purple-400'}`}>
                                                    {grievance.status}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {stage === 3 ? "Issue resolved and verified." :
                                                        stage === 2 ? "Work is currently underway." :
                                                            stage === 1 ? "Issue verified and assigned." :
                                                                "Issue submitted and under review."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
