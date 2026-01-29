"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    UserCheck,
    Clock,
    CheckCircle,
    TrendingUp,
    Search,
    Eye,
    Mail,
    Phone,
    Briefcase,
    MoreVertical,
    Award,
    Activity
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

interface Worker {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    status?: "active" | "on-leave" | "inactive";
    assignedTasks?: number;
    completedTasks?: number;
    rating?: number;
    efficiency?: number;
    joinedAt?: string;
    lastActive?: string;
}

export default function WorkersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [grievances, setGrievances] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;
        const workersQuery = query(collection(db, "users"), where("role", "==", "WORKER"));
        const unsubscribe = onSnapshot(workersQuery, (snapshot) => {
            setWorkers(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Worker[]);
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
            case "on-leave": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "inactive": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 90) return "text-emerald-400";
        if (efficiency >= 75) return "text-blue-400";
        if (efficiency >= 60) return "text-yellow-400";
        return "text-rose-400";
    };

    const enrichedWorkers = useMemo(() => {
        const activeAssignments = grievances.filter((g) => g.status !== "Resolved" && g.status !== "Closed");
        const completedAssignments = grievances.filter((g) => g.status === "Resolved" || g.status === "Closed");

        return workers.map((worker) => {
            const assigned = activeAssignments.filter((g) => g.assignedWorkerId === worker.id).length;
            const completed = completedAssignments.filter((g) => g.assignedWorkerId === worker.id).length;
            return {
                ...worker,
                assignedTasks: assigned,
                completedTasks: completed,
                status: worker.status || (assigned > 0 ? "active" : "inactive"),
            };
        });
    }, [grievances, workers]);

    const filteredWorkers = enrichedWorkers.filter(worker => {
        const matchesSearch = (worker.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (worker.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (worker.department || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
        const matchesDepartment = departmentFilter === "all" || worker.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const departments = Array.from(new Set(enrichedWorkers.map(w => w.department).filter(Boolean))) as string[];

    const workerStats = useMemo(() => {
        const total = workers.length;
        const active = enrichedWorkers.filter((w) => w.status === "active").length;
        const completed = grievances.filter((g) => g.status === "Resolved" || g.status === "Closed").length;
        return [
            { label: "Total Workers", value: total.toString(), icon: Users, color: "purple" },
            { label: "Active Workers", value: active.toString(), icon: UserCheck, color: "emerald" },
            { label: "Tasks Completed", value: completed.toString(), icon: CheckCircle, color: "blue" },
            { label: "Avg Completion Time", value: "-", icon: Clock, color: "yellow" },
        ];
    }, [enrichedWorkers, grievances, workers.length]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Worker Management"
                    description="Manage and monitor field workers and their performance"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {workerStats.map((stat, i) => (
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
                                placeholder="Search by name, email, or department..."
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
                            <option value="on-leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Department Filter */}
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Workers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredWorkers.map((worker) => (
                        <div
                            key={worker.id}
                            className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {(worker.name || "W").split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{worker.name || "Worker"}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{worker.id}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border capitalize ${getStatusColor(worker.status)}`}>
                                            {worker.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Department & Specialization */}
                            <div className="mb-4 p-3 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <Briefcase size={14} className="text-purple-400" />
                                    <span className="text-sm font-medium text-purple-400">{worker.department || "-"}</span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-slate-500" />
                                    <span className="text-slate-300 truncate">{worker.email || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{worker.phone || "-"}</span>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <div className="text-xs text-blue-400 mb-1">Assigned</div>
                                    <div className="text-lg font-semibold text-white">{worker.assignedTasks || 0}</div>
                                </div>
                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <div className="text-xs text-emerald-400 mb-1">Completed</div>
                                    <div className="text-lg font-semibold text-white">{worker.completedTasks || 0}</div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <div className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                                        <Award size={12} />
                                        Rating
                                    </div>
                                    <div className="text-lg font-semibold text-white">{worker.rating || 0}</div>
                                </div>
                            </div>

                            {/* Efficiency Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Activity size={12} />
                                        Efficiency
                                    </span>
                                    <span className={`text-sm font-semibold ${getEfficiencyColor(worker.efficiency || 0)}`}>
                                        {worker.efficiency || 0}%
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${(worker.efficiency || 0) >= 90 ? 'bg-emerald-500' :
                                                (worker.efficiency || 0) >= 75 ? 'bg-blue-500' :
                                                    (worker.efficiency || 0) >= 60 ? 'bg-yellow-500' : 'bg-rose-500'
                                            } rounded-full transition-all duration-500`}
                                        style={{ width: `${worker.efficiency || 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500">
                                    Joined {worker.joinedAt || "-"}
                                </div>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors text-xs text-purple-400 font-medium">
                                        Assign Task
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group">
                                        <Eye size={14} className="text-slate-400 group-hover:text-purple-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredWorkers.length === 0 && (
                    <div className="py-12 text-center rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <Users size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-400">No workers found matching your filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}


