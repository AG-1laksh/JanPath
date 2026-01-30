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
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
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
    description?: string;
    imageBase64?: string;
};

export default function GrievancesPage() {
    const { t } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [workers, setWorkers] = useState<Array<{ id: string; name?: string; email?: string }>>([]);
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [assignGrievance, setAssignGrievance] = useState<Grievance | null>(null);
    const [statusGrievance, setStatusGrievance] = useState<Grievance | null>(null);
    const [selectedWorkerId, setSelectedWorkerId] = useState("");
    const [saving, setSaving] = useState(false);
    const [statusLogs, setStatusLogs] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;
        const grievancesQuery = query(collection(db, "grievances"));
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Grievance[];
            items.sort((a, b) => {
                const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return bTime - aTime;
            });
            setGrievances(items);
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

    useEffect(() => {
        if (!db) return;
        const workersQuery = query(collection(db, "users"), where("role", "==", "WORKER"));
        const unsubscribe = onSnapshot(workersQuery, (snapshot) => {
            setWorkers(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as any) })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db || !selectedGrievance?.id) {
            setStatusLogs([]);
            return;
        }
        const logsQuery = query(
            collection(db, "statusLogs"),
            where("grievanceId", "==", selectedGrievance.id),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
            setStatusLogs(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, [selectedGrievance]);

    const handleAssign = async () => {
        if (!db || !assignGrievance || !selectedWorkerId) return;
        try {
            setSaving(true);
            await updateDoc(doc(db, "grievances", assignGrievance.id), {
                assignedWorkerId: selectedWorkerId,
                status: "Assigned",
            });
            await addDoc(collection(db, "statusLogs"), {
                grievanceId: assignGrievance.id,
                status: "Assigned",
                updatedBy: "admin",
                remarks: "Assigned by admin",
                timestamp: serverTimestamp(),
            });
            setAssignGrievance(null);
            setSelectedWorkerId("");
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (grievance: Grievance, status: string) => {
        if (!db) return;
        try {
            setSaving(true);
            await updateDoc(doc(db, "grievances", grievance.id), { status });
            await addDoc(collection(db, "statusLogs"), {
                grievanceId: grievance.id,
                status,
                updatedBy: "admin",
                remarks: `Status set to ${status}`,
                timestamp: serverTimestamp(),
            });
            setStatusGrievance(null);
        } finally {
            setSaving(false);
        }
    };

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
        if (status === "Resolved" || status === "Closed" || status === "Completed") return "resolved";
        if (status === "Rejected") return "rejected";
        if (status === "In Progress") return "in-progress";
        if (status === "Assigned" || status === "Submitted") return "pending";
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
        const pending = grievances.filter((g) => {
            const status = normalizeStatus(g.status);
            return status === "pending" || status === "in-progress";
        }).length;
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
                                            {(() => {
                                                const normalized = normalizeStatus(grievance.status);
                                                const displayStatus = grievance.assignedWorkerId && normalized === "pending"
                                                    ? "Assigned"
                                                    : normalized === "in-progress"
                                                        ? "In Progress"
                                                        : normalized.charAt(0).toUpperCase() + normalized.slice(1);
                                                return (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(normalized)}`}>
                                                        {t(displayStatus)}
                                                    </span>
                                                );
                                            })()}
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
                                                <button
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                    onClick={() => setSelectedGrievance(grievance)}
                                                >
                                                    <Eye size={16} className="text-slate-400 group-hover:text-purple-400" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                    onClick={() => {
                                                        setAssignGrievance(grievance);
                                                        setSelectedWorkerId(grievance.assignedWorkerId || "");
                                                    }}
                                                >
                                                    <UserCheck size={16} className="text-slate-400 group-hover:text-blue-400" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                    onClick={() => setStatusGrievance(grievance)}
                                                >
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

                {selectedGrievance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="w-full max-w-4xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Grievance Details</h3>
                                <button
                                    className="text-slate-400 hover:text-white"
                                    onClick={() => setSelectedGrievance(null)}
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-3 text-sm text-slate-300">
                                    <div><span className="text-slate-500">Title:</span> {selectedGrievance.title || "-"}</div>
                                    <div><span className="text-slate-500">Category:</span> {selectedGrievance.category || "-"}</div>
                                    <div><span className="text-slate-500">Priority:</span> {selectedGrievance.priority || "-"}</div>
                                    <div><span className="text-slate-500">Status:</span> {selectedGrievance.status || "-"}</div>
                                    <div><span className="text-slate-500">Assigned:</span> {selectedGrievance.assignedWorkerId ? userMap[selectedGrievance.assignedWorkerId] || selectedGrievance.assignedWorkerId : "Not assigned"}</div>
                                    <div><span className="text-slate-500">Created:</span> {selectedGrievance.createdAt?.toDate ? selectedGrievance.createdAt.toDate().toLocaleString() : "-"}</div>
                                    <div><span className="text-slate-500">Location:</span> {selectedGrievance.location?.address || "-"}</div>
                                    <div><span className="text-slate-500">Description:</span> {selectedGrievance.description || "-"}</div>
                                </div>
                                <div className="space-y-4">
                                    {selectedGrievance.imageBase64 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${selectedGrievance.imageBase64}`}
                                            alt="Grievance"
                                            className="w-full rounded-xl border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-full h-48 rounded-xl border border-white/10 flex items-center justify-center text-slate-500">
                                            No image uploaded
                                        </div>
                                    )}
                                    <div className="rounded-xl border border-white/10 p-4">
                                        <h4 className="text-sm font-semibold mb-3">Status Updates</h4>
                                        {statusLogs.length === 0 ? (
                                            <p className="text-xs text-slate-500">No updates yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {statusLogs.map((log) => (
                                                    <div key={log.id} className="p-3 rounded-lg bg-white/5">
                                                        <div className="text-sm font-medium text-white">{log.status}</div>
                                                        <div className="text-xs text-slate-400">{log.remarks || ""}</div>
                                                        <div className="text-[11px] text-slate-500 mt-1">
                                                            {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : ""}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {assignGrievance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Assign Worker</h3>
                                <button
                                    className="text-slate-400 hover:text-white"
                                    onClick={() => setAssignGrievance(null)}
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                            <select
                                value={selectedWorkerId}
                                onChange={(e) => setSelectedWorkerId(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                            >
                                <option value="">Select worker</option>
                                {workers.map((worker) => (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.name || worker.email || worker.id}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedWorkerId || saving}
                                className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-xl disabled:opacity-60"
                            >
                                {saving ? "Assigning..." : "Assign"}
                            </button>
                        </div>
                    </div>
                )}

                {statusGrievance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Update Status</h3>
                                <button
                                    className="text-slate-400 hover:text-white"
                                    onClick={() => setStatusGrievance(null)}
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {["In Progress", "Completed", "Resolved", "Rejected"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(statusGrievance, status)}
                                        disabled={saving}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl"
                                    >
                                        {saving ? "Updating..." : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}


