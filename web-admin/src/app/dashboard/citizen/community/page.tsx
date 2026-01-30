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
    MapPin,
    Trophy,
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

type Grievance = {
    id: string;
    userId: string;
    category?: string;
    status?: string;
    createdAt?: any;
    title?: string;
};

type TopContributor = {
    rank: number;
    userId: string;
    name: string;
    count: number;
};

export default function CommunityImpactPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [loading, setLoading] = useState(true);
    const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
    const [stats, setStats] = useState({
        totalGrievances: 0,
        resolvedGrievances: 0,
        pendingGrievances: 0,
        resolutionRate: 0
    });

    useEffect(() => {
        if (!db) return;

        const grievancesQuery = query(
            collection(db, "grievances"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            const data = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Grievance[];

            setGrievances(data);

            // Calculate stats
            const total = data.length;
            const resolved = data.filter((g) => g.status === "Resolved" || g.status === "Closed").length;
            const pending = total - resolved;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

            setStats({
                totalGrievances: total,
                resolvedGrievances: resolved,
                pendingGrievances: pending,
                resolutionRate: rate
            });

            // Calculate top contributors (citizens who reported most grievances)
            const userCounts: Record<string, number> = {};
            data.forEach((g) => {
                if (g.userId) {
                    userCounts[g.userId] = (userCounts[g.userId] || 0) + 1;
                }
            });

            const sorted = Object.entries(userCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([userId, count], index) => ({
                    rank: index + 1,
                    userId,
                    name: `Citizen ${userId.slice(-4).toUpperCase()}`,
                    count
                }));

            setTopContributors(sorted);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Get category breakdown
    const categoryBreakdown = grievances.reduce((acc, g) => {
        const cat = g.category || "Other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

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
                <Header title="Community Impact" description="Track community achievements and civic participation." />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Category Breakdown */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-400">
                                <Shield className="fill-purple-500/10" /> Grievance Categories
                            </h2>
                            <div className="space-y-4">
                                {topCategories.length > 0 ? topCategories.map(([category, count], index) => (
                                    <div key={category} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                                                    {category}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {count} grievance{count !== 1 ? 's' : ''} reported in this category
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize
                                                ${index === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    index === 1 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                }
                                            `}>
                                                #{index + 1} Category
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <AlertTriangle size={16} />
                                                Issues Reported: <span className="text-white font-semibold">{count}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin size={16} />
                                                Active tracking
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center text-slate-400">
                                        No grievances reported yet. Be the first to report an issue!
                                    </div>
                                )}
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
                                {topContributors.length > 0 ? topContributors.map((contributor) => (
                                    <div key={contributor.userId} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                            ${contributor.rank === 1 ? 'bg-yellow-500 text-black' :
                                                contributor.rank === 2 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white'}
                                        `}>
                                            {contributor.rank}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">{contributor.name}</div>
                                            <div className="text-xs text-slate-400">Reported {contributor.count} issue{contributor.count !== 1 ? 's' : ''}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-slate-400 text-sm py-4">
                                        No contributors yet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Impact Stats</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.resolutionRate}%</div>
                                    <div className="text-sm text-emerald-200/70">Resolution Rate</div>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalGrievances}</div>
                                    <div className="text-sm text-blue-200/70">Total Grievances Reported</div>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="text-3xl font-bold text-purple-400 mb-1">{stats.resolvedGrievances}</div>
                                    <div className="text-sm text-purple-200/70">Issues Resolved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
