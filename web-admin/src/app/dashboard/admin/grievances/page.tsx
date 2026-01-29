"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Filter,
    Eye,
    UserCheck,
    MoreVertical
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

type Grievance = {
    id: string;
    title?: string;
    category?: string;
    status?: string;
    priority?: string;
    assignedWorkerId?: string | null;
    createdAt?: any;
    location?: { address?: string } | null;
    userId?: string;
};

export default function GrievancesPage() {
    const { t } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!db) return;
        const grievancesQuery = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Grievance[]);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db) return;
        const usersQuery = query(collection(db, "users"));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            const map: Record<string, string> = {};
            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data() as any;
                map[docSnap.id] = data?.name || data?.email || docSnap.id;
            });
            setUserMap(map);
        });
        return () => unsubscribe();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "in-progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "resolved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "rejected": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "text-rose-400";
            case "medium": return "text-yellow-400";
            case "low": return "text-slate-400";
            default: return "text-slate-400";
        }
    };

    const normalizeStatus = (status?: string) => {
        if (!status) return "pending";
        if (status === "Resolved" || status === "Closed") return "resolved";
        if (status === "Rejected") return "rejected";
        if (status === "In Progress") return "in-progress";
        return "pending";
    };

    const normalizePriority = (priority?: string) => {
        if (!priority) return "low";
        return priority.toLowerCase();
    };

    const filteredGrievances = useMemo(() => {
        return grievances.filter((grievance) => {
            const citizenName = grievance.userId ? userMap[grievance.userId] || grievance.userId : "";
            const title = grievance.title || "";
            const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || normalizeStatus(grievance.status) === statusFilter;
            const matchesPriority = priorityFilter === "all" || normalizePriority(grievance.priority) === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [grievances, searchTerm, statusFilter, priorityFilter, userMap]);

    const grievanceStats = useMemo(() => {
        const total = grievances.length;
        const pending = grievances.filter((g) => normalizeStatus(g.status) === "pending" || normalizeStatus(g.status) === "in-progress").length;
        const resolved = grievances.filter((g) => normalizeStatus(g.status) === "resolved").length;
        const rejected = grievances.filter((g) => normalizeStatus(g.status) === "rejected").length;
        return [
            { label: "Total Grievances", value: total.toString(), icon: FileText, color: "purple" },
            { label: "Pending", value: pending.toString(), icon: Clock, color: "yellow" },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle, color: "emerald" },
            { label: "Rejected", value: rejected.toString(), icon: XCircle, color: "rose" },
        ];
    }, [grievances]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title={t("Grievance Management")}
                    description={t("Manage and monitor all citizen grievances")}
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {grievanceStats.map((stat, i) => (
                        <StatCard key={i} {...stat} label={t(stat.label)} delay={i * 0.1} />
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
                                placeholder={t("Search by ID, title, or citizen name...")}
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
                            <option value="all">{t("All Status")}</option>
                            <option value="pending">{t("Pending")}</option>
                            <option value="in-progress">{t("In Progress")}</option>
                            <option value="resolved">{t("Resolved")}</option>
                            <option value="rejected">{t("Rejected")}</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">{t("All Priority")}</option>
                            <option value="high">{t("High")}</option>
                            <option value="medium">{t("Medium")}</option>
                            <option value="low">{t("Low")}</option>
                        </select>
                    </div>
                </div>

                {/* Grievances Table */}
                <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("ID")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Title")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Citizen")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Category")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Priority")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Status")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Assigned To")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Created")}</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrievances.map((grievance) => (
                                    <tr
                                        key={grievance.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-purple-400 font-mono text-sm">{grievance.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-white font-medium mb-1">{grievance.title || "Untitled"}</div>
                                                <div className="text-xs text-slate-500">{grievance.location?.address || ""}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {grievance.userId ? userMap[grievance.userId] || grievance.userId : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-400">{t(grievance.category || "General")}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium capitalize ${getPriorityColor(normalizePriority(grievance.priority))}`}>
                                                {t(normalizePriority(grievance.priority).charAt(0).toUpperCase() + normalizePriority(grievance.priority).slice(1))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(normalizeStatus(grievance.status))}`}>
                                                {normalizeStatus(grievance.status) === 'in-progress' ? t("In Progress") : t(normalizeStatus(grievance.status).charAt(0).toUpperCase() + normalizeStatus(grievance.status).slice(1))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">
                                            {grievance.assignedWorkerId
                                                ? userMap[grievance.assignedWorkerId] || grievance.assignedWorkerId
                                                : <span className="text-slate-600">{t("Not assigned")}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {grievance.createdAt?.toDate ? grievance.createdAt.toDate().toLocaleString() : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <Eye size={16} className="text-slate-400 group-hover:text-purple-400" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <UserCheck size={16} className="text-slate-400 group-hover:text-blue-400" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <MoreVertical size={16} className="text-slate-400 group-hover:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredGrievances.length === 0 && (
                        <div className="py-12 text-center">
                            <AlertTriangle size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-400">{t("No grievances found matching your filters")}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


