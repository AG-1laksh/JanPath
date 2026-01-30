"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
    LayoutDashboard,
    Hammer,
    Calendar,
    CheckSquare,
    Clock,
    AlertCircle
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useMemo, useState } from "react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Hammer, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

type WorkerTask = {
    id: string;
    title?: string;
    description?: string;
    status?: string;
    createdAt?: any;
    assignedWorkerId?: string | null;
    category?: string;
    priority?: string;
};

type WorkerRequest = {
    id: string;
    grievanceId?: string;
    reason?: string;
    status?: string;
    requestedAt?: any;
};

export default function WorkerDashboard() {
    const { t } = useSettings();
    const { user, profile } = useAuth();
    const [tasks, setTasks] = useState<WorkerTask[]>([]);
    const [available, setAvailable] = useState<WorkerTask[]>([]);
    const [requests, setRequests] = useState<WorkerRequest[]>([]);
    const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);

    useEffect(() => {
        if (!db || !user) return;
        const tasksQuery = query(
            collection(db, "grievances"),
            where("assignedWorkerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            setTasks(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as WorkerTask[]);
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!db) return;
        const availableQuery = query(collection(db, "grievances"), where("status", "==", "Submitted"));
        const unsubscribe = onSnapshot(availableQuery, (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as WorkerTask[];
            const filtered = items.filter((item) => !item.assignedWorkerId);
            const sorted = filtered.sort((a, b) => {
                const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return bTime - aTime;
            });
            setAvailable(sorted);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db || !user) return;
        const requestsQuery = query(
            collection(db, "workerRequests"),
            where("workerId", "==", user.uid),
            orderBy("requestedAt", "desc")
        );
        const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
            setRequests(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as WorkerRequest[]);
        });
        return () => unsubscribe();
    }, [user]);

    const workerStats = useMemo(() => {
        const assigned = tasks.length;
        const inProgress = tasks.filter((t) => t.status === "In Progress" || t.status === "Assigned").length;
        const pending = tasks.filter((t) => t.status === "Submitted").length;
        return [
            { label: "Assigned Tasks", value: assigned.toString(), icon: Hammer, color: "blue" },
            { label: "In Progress", value: inProgress.toString(), icon: Clock, color: "orange" },
            { label: "Avg Resolution", value: "-", icon: Calendar, color: "emerald" },
            { label: "Pending", value: pending.toString(), icon: AlertCircle, color: "rose" },
        ];
    }, [tasks]);
    const handleAction = (action: string) => {
        alert(`${action} reported/updated successfully!`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title={t("Field Dashboard")}
                    description={`${t("Good Morning")}, ${profile?.name || "Worker"} | ${t("Department")}: ${t(profile?.department || "N/A")}`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {workerStats.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <RecentActivity items={tasks.map((task) => ({
                            id: task.id,
                            title: task.title || "Assigned Task",
                            description: task.description || "",
                            time: task.createdAt?.toDate ? task.createdAt.toDate().toLocaleString() : "",
                            status: (task.status || "pending") as any,
                        }))} />

                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Assigned Work</h3>
                                <div className="space-y-3">
                                    {tasks.slice(0, 5).map((task) => (
                                        <button
                                            key={task.id}
                                            onClick={() => setSelectedTask(task)}
                                            className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/40 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-white">{task.title || "Assigned Task"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{task.category || "General"} • {task.status || "Assigned"}</p>
                                        </button>
                                    ))}
                                    {tasks.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No assigned work yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Available to Request</h3>
                                <div className="space-y-3">
                                    {available.slice(0, 5).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedTask(item)}
                                            className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/40 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-white">{item.title || "Available Task"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{item.category || "General"} • {item.priority || "Normal"}</p>
                                        </button>
                                    ))}
                                    {available.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No available tasks right now.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Requests Submitted</h3>
                                <div className="space-y-3">
                                    {requests.slice(0, 5).map((req) => (
                                        <div key={req.id} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                            <p className="text-sm font-medium text-white">Grievance: {req.grievanceId || "-"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Status: {req.status || "Pending"}</p>
                                        </div>
                                    ))}
                                    {requests.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Quick Actions or Notifications */}
                        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Urgent Actions</h3>
                            <button
                                onClick={() => handleAction("Obstruction")}
                                className="w-full py-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-3 hover:bg-orange-500/20 transition-all font-medium text-sm"
                            >
                                Report Obstruction
                            </button>
                            <button
                                onClick={() => handleAction("Task Completion")}
                                className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-medium text-sm"
                            >
                                Mark Current Task Complete
                            </button>
                        </div>
                    </div>
                </div>

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
                            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-400">
                                <div>
                                    <div className="text-slate-500">Status</div>
                                    <div className="text-slate-200">{selectedTask.status || "Submitted"}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Created</div>
                                    <div className="text-slate-200">
                                        {selectedTask.createdAt?.toDate ? selectedTask.createdAt.toDate().toLocaleString() : "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

