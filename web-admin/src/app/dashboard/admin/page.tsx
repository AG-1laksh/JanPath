"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    TrendingUp,
    CheckCircle,
    Activity,
    UserPlus,
    ClipboardCheck,
    X,
    Check,
    Loader2
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, updateDoc, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

type StatusLog = {
    id: string;
    status?: string;
    remarks?: string;
    timestamp?: any;
};

type WorkerRequest = {
    id: string;
    workerId: string;
    grievanceId: string;
    reason: string;
    status: string;
    requestedAt?: any;
};

type WorkerSignup = {
    id: string;
    workerId: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    city?: string;
    status: string;
    requestedAt?: any;
};

export default function AdminDashboard() {
    const { t } = useSettings();
    const { user } = useAuth();
    const [grievances, setGrievances] = useState<any[]>([]);
    const [logs, setLogs] = useState<StatusLog[]>([]);
    const [workerRequests, setWorkerRequests] = useState<WorkerRequest[]>([]);
    const [workerSignups, setWorkerSignups] = useState<WorkerSignup[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!db) return;
        const grievancesQuery = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!db) return;
        const logsQuery = query(collection(db, "statusLogs"), orderBy("timestamp", "desc"), limit(6));
        const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
            setLogs(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Worker task assignment requests
    useEffect(() => {
        if (!db) return;
        const requestsQuery = query(
            collection(db, "workerRequests"),
            where("status", "==", "Pending"),
            orderBy("requestedAt", "desc"),
            limit(5)
        );
        const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
            setWorkerRequests(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as WorkerRequest)));
        });
        return () => unsubscribe();
    }, []);

    // Worker signup requests
    useEffect(() => {
        if (!db) return;
        const signupsQuery = query(
            collection(db, "workerSignupRequests"),
            where("status", "==", "Pending"),
            orderBy("requestedAt", "desc"),
            limit(5)
        );
        const unsubscribe = onSnapshot(signupsQuery, (snapshot) => {
            setWorkerSignups(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as WorkerSignup)));
        });
        return () => unsubscribe();
    }, []);

    const approveTaskRequest = async (request: WorkerRequest) => {
        if (!db || !user) return;
        setProcessingId(request.id);
        try {
            // Assign the grievance to the worker
            await updateDoc(doc(db, "grievances", request.grievanceId), {
                assignedWorkerId: request.workerId,
                status: "Assigned",
            });

            // Add status log
            await addDoc(collection(db, "statusLogs"), {
                grievanceId: request.grievanceId,
                status: "Assigned",
                updatedBy: user.uid,
                remarks: "Assigned by admin",
                timestamp: serverTimestamp(),
            });

            // Update request status
            await updateDoc(doc(db, "workerRequests", request.id), {
                status: "Approved",
            });
        } catch (error) {
            console.error("Failed to approve request:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const denyTaskRequest = async (request: WorkerRequest) => {
        if (!db) return;
        setProcessingId(request.id);
        try {
            await updateDoc(doc(db, "workerRequests", request.id), {
                status: "Rejected",
            });
        } catch (error) {
            console.error("Failed to deny request:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const approveSignup = async (signup: WorkerSignup) => {
        if (!db) return;
        setProcessingId(signup.id);
        try {
            // Update user role to WORKER
            await updateDoc(doc(db, "users", signup.workerId), {
                role: "WORKER",
            });

            // Update signup request status
            await updateDoc(doc(db, "workerSignupRequests", signup.id), {
                status: "Approved",
            });
        } catch (error) {
            console.error("Failed to approve signup:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const rejectSignup = async (signup: WorkerSignup) => {
        if (!db) return;
        setProcessingId(signup.id);
        try {
            await updateDoc(doc(db, "workerSignupRequests", signup.id), {
                status: "Rejected",
            });
        } catch (error) {
            console.error("Failed to reject signup:", error);
        } finally {
            setProcessingId(null);
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

    const stats = useMemo(() => {
        const total = grievances.length;
        const pending = grievances.filter((g) => {
            const normalized = normalizeStatus(g.status);
            return normalized === "pending" || normalized === "in-progress";
        }).length;
        const resolved = grievances.filter((g) => normalizeStatus(g.status) === "resolved").length;
        const avgResponse = "-";
        return [
            { label: "Total Grievances", value: total.toString(), icon: FileText, color: "purple" },
            { label: "Pending Resolution", value: pending.toString(), icon: AlertTriangle, color: "rose" },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle, color: "emerald" },
            { label: "Avg Response Time", value: avgResponse, icon: Activity, color: "blue" },
        ];
    }, [grievances]);

    const recentActivity = useMemo(() => {
        return logs.map((log) => ({
            id: log.id,
            title: log.status || "Status Update",
            description: log.remarks || "",
            time: log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : "Just now",
            status: (log.status || "pending") as any,
        }));
    }, [logs]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-background text-foreground">
                <Header
                    title={t("Admin Dashboard")}
                    description={`${t("Welcome back")}, Administrator.`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} label={t(stat.label)} delay={i * 0.1} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Worker Task Requests */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-card border border-border"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-blue-500/10">
                                <ClipboardCheck size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Task Requests</h3>
                                <p className="text-xs text-muted-foreground">Workers requesting to take tasks</p>
                            </div>
                            {workerRequests.length > 0 && (
                                <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                    {workerRequests.length}
                                </span>
                            )}
                        </div>

                        {workerRequests.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ClipboardCheck size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No pending requests</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {workerRequests.map((request) => (
                                    <div key={request.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    Worker: {request.workerId.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Grievance: {request.grievanceId.slice(-6).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{request.reason}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveTaskRequest(request)}
                                                disabled={processingId === request.id}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => denyTaskRequest(request)}
                                                disabled={processingId === request.id}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <X size={14} />
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Worker Signup Requests */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl bg-card border border-border"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-purple-500/10">
                                <UserPlus size={20} className="text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Worker Signups</h3>
                                <p className="text-xs text-muted-foreground">New workers awaiting approval</p>
                            </div>
                            {workerSignups.length > 0 && (
                                <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                    {workerSignups.length}
                                </span>
                            )}
                        </div>

                        {workerSignups.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <UserPlus size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No pending signups</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {workerSignups.map((signup) => (
                                    <div key={signup.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{signup.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{signup.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                                            {signup.department && <span className="px-2 py-0.5 rounded bg-muted">{signup.department}</span>}
                                            {signup.city && <span className="px-2 py-0.5 rounded bg-muted">{signup.city}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveSignup(signup)}
                                                disabled={processingId === signup.id}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === signup.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectSignup(signup)}
                                                disabled={processingId === signup.id}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <X size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <RecentActivity items={recentActivity} />
                    </motion.div>
                </div>

                {/* Chart Section */}
                <div className="p-6 rounded-3xl bg-card border border-border h-64 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-blue-500/5 to-transparent opacity-50" />
                    <div className="text-center z-10">
                        <TrendingUp size={48} className="mx-auto text-slate-700 mb-4 group-hover:text-purple-500 transition-colors" />
                        <p className="text-muted-foreground font-medium">{t("Analytics & Reports Chart")}</p>
                        <p className="text-muted-foreground/60 text-sm mt-1 mb-4">({t("Visualize resolution trends here")})</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
