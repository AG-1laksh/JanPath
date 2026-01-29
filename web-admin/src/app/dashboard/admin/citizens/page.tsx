"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    UserCheck,
    UserPlus,
    UserX,
    Activity,
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    MoreVertical
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

interface Citizen {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    sector?: string;
    grievancesCount?: number;
    resolvedCount?: number;
    status?: "active" | "inactive" | "blocked";
    joinedAt?: string;
    lastActive?: string;
}

export default function CitizensPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sectorFilter, setSectorFilter] = useState<string>("all");
    const [citizens, setCitizens] = useState<Citizen[]>([]);
    const [grievances, setGrievances] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;
        const usersQuery = query(collection(db, "users"), where("role", "==", "USER"));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            setCitizens(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Citizen[]);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db) return;
        const grievancesQuery = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "inactive": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            case "blocked": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const enrichedCitizens = useMemo(() => {
        return citizens.map((citizen) => {
            const userGrievances = grievances.filter((g) => g.userId === citizen.id);
            const resolved = userGrievances.filter((g) => g.status === "Resolved" || g.status === "Closed").length;
            return {
                ...citizen,
                grievancesCount: userGrievances.length,
                resolvedCount: resolved,
                status: citizen.status || "active",
            };
        });
    }, [citizens, grievances]);

    const filteredCitizens = enrichedCitizens.filter(citizen => {
        const matchesSearch = (citizen.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (citizen.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            citizen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (citizen.phone || "").includes(searchTerm);
        const matchesStatus = statusFilter === "all" || citizen.status === statusFilter;
        const matchesSector = sectorFilter === "all" || citizen.sector === sectorFilter;
        return matchesSearch && matchesStatus && matchesSector;
    });

    const sectors = Array.from(new Set(enrichedCitizens.map(c => c.sector).filter(Boolean))) as string[];

    const citizenStats = useMemo(() => {
        const total = citizens.length;
        const active = enrichedCitizens.filter((c) => c.status === "active").length;
        const newThisMonth = enrichedCitizens.filter((c) => c.joinedAt).length;
        const avgGrievances = total ? (grievances.length / total).toFixed(1) : "0";
        return [
            { label: "Total Citizens", value: total.toString(), icon: Users, color: "purple" },
            { label: "Active Users", value: active.toString(), icon: UserCheck, color: "emerald" },
            { label: "New This Month", value: newThisMonth.toString(), icon: UserPlus, color: "blue" },
            { label: "Avg Grievances", value: avgGrievances, icon: Activity, color: "yellow" },
        ];
    }, [citizens.length, enrichedCitizens, grievances.length]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Citizen Management"
                    description="Manage and monitor registered citizens"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {citizenStats.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="mb-6 p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, ID, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                        </select>

                        {/* Sector Filter */}
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Sectors</option>
                            {sectors.map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Citizens Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCitizens.map((citizen) => (
                        <div
                            key={citizen.id}
                            className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {(citizen.name || "C").charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{citizen.name || "Citizen"}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{citizen.id}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border capitalize ${getStatusColor(citizen.status)}`}>
                                    {citizen.status}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-slate-500" />
                                    <span className="text-slate-300 truncate">{citizen.email || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{citizen.phone || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{citizen.address || "-"} {citizen.sector || ""}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Grievances</div>
                                    <div className="text-lg font-semibold text-white">{citizen.grievancesCount || 0}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Resolved</div>
                                    <div className="text-lg font-semibold text-emerald-400">{citizen.resolvedCount || 0}</div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500">
                                    Joined {citizen.joinedAt || "-"}
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                        <Eye size={14} className="text-slate-400 group-hover:text-purple-400" />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                        <MoreVertical size={14} className="text-slate-400 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCitizens.length === 0 && (
                    <div className="py-12 text-center rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <Users size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-400">No citizens found matching your filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}


