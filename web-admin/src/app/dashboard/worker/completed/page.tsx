"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    Star,
    BadgeCheck,
    Filter,
    Download
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Star, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: BadgeCheck, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

type CompletedTask = {
    id: string;
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    status?: string;
    createdAt?: any;
    location?: { address?: string };
    verified?: boolean;
    verificationStatus?: string;
    rating?: number;
    imageBase64?: string;
};

export default function WorkerCompletedPage() {
    const { user } = useAuth();
    const [showVerified, setShowVerified] = useState(true);
    const [tasks, setTasks] = useState<CompletedTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);

    useEffect(() => {
        if (!db || !user) return;
        const tasksQuery = query(collection(db, "grievances"), where("assignedWorkerId", "==", user.uid));
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as CompletedTask[];
            const completed = items.filter((item) =>
                ["Completed", "Resolved", "Closed"].includes(item.status || "")
            );
            const sorted = completed.sort((a, b) => {
                const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return bTime - aTime;
            });
            setTasks(sorted);
        });
        return () => unsubscribe();
    }, [user]);

    const isVerified = (task: CompletedTask) => {
        if (typeof task.verified === "boolean") return task.verified;
        if (task.verificationStatus) return task.verificationStatus.toLowerCase() === "verified";
        return task.status === "Closed";
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => (showVerified ? isVerified(task) : true));
    }, [tasks, showVerified]);

    const handleExport = () => {
        const header = ["id", "title", "category", "priority", "status", "location", "createdAt"].join(",");
        const rows = filteredTasks.map((task) => {
            const createdAt = task.createdAt?.toDate ? task.createdAt.toDate().toISOString() : "";
            const location = task.location?.address || "";
            const values = [task.id, task.title || "", task.category || "", task.priority || "", task.status || "", location, createdAt];
            return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
        });
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `completed-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Completed Tasks"
                    description="Review closed tasks, ratings, and verification status."
                />

                <div className="max-w-4xl space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-slate-300 flex items-center gap-2">
                            <Filter size={14} />
                            This Month
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-slate-300 flex items-center gap-2"
                        >
                            <Download size={14} />
                            Export Report
                        </button>
                        <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
                            <span>Verified only</span>
                            <button
                                onClick={() => setShowVerified(!showVerified)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${showVerified ? "bg-emerald-600" : "bg-slate-700"}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${showVerified ? "left-6" : "left-1"}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className="w-full text-left p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 transition-colors"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm text-slate-500">{task.id}</div>
                                        <div className="text-lg font-semibold text-white">{task.title}</div>
                                        <div className="text-sm text-slate-500">{task.location?.address || task.category || "-"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-500">Completed</div>
                                        <div className="text-sm text-white">
                                            {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Star size={14} className="text-yellow-400" />
                                        {task.rating ?? "-"}
                                    </div>
                                    <div className={`flex items-center gap-2 ${isVerified(task) ? "text-emerald-400" : "text-slate-500"}`}>
                                        <BadgeCheck size={14} />
                                        {isVerified(task) ? "Verified" : "Pending verification"}
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredTasks.length === 0 && (
                            <div className="text-sm text-slate-400">No completed tasks yet.</div>
                        )}
                    </div>
                </div>
            </main>

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedTask.title || "Task Details"}</h3>
                                <p className="text-sm text-muted-foreground">{selectedTask.category || "General"} • {selectedTask.priority || selectedTask.status || ""}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-sm text-slate-400 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                        {selectedTask.description && (
                            <p className="mt-4 text-sm text-slate-300">{selectedTask.description}</p>
                        )}
                        {selectedTask.imageBase64 && (
                            <img
                                src={selectedTask.imageBase64}
                                alt="Task"
                                className="mt-4 w-full rounded-2xl border border-white/10"
                            />
                        )}
                        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-400">
                            <div>
                                <div className="text-slate-500">Status</div>
                                <div className="text-slate-200">{selectedTask.status || "Completed"}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">Completed</div>
                                <div className="text-slate-200">
                                    {selectedTask.createdAt?.toDate ? selectedTask.createdAt.toDate().toLocaleString() : "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-500">Location</div>
                                <div className="text-slate-200">{selectedTask.location?.address || "-"}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">Verified</div>
                                <div className="text-slate-200">{isVerified(selectedTask) ? "Yes" : "No"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


