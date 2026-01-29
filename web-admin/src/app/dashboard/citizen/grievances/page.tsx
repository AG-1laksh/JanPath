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
    Plus,
    Filter,
    Search,
    MapPin,
    Calendar,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useMemo, useState } from "react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

type CitizenGrievance = {
    id: string;
    category?: string;
    title?: string;
    status?: string;
    createdAt?: any;
    location?: { address?: string } | null;
    description?: string;
};

export default function CitizenGrievances() {
    const { t } = useSettings();
    const { user } = useAuth();
    const [grievances, setGrievances] = useState<CitizenGrievance[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!db || !user) return;
        const grievancesQuery = query(
            collection(db, "grievances"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as CitizenGrievance[]);
        });
        return () => unsubscribe();
    }, [user]);

    const filteredGrievances = useMemo(() => {
        return grievances.filter((grievance) => {
            const title = grievance.title || "";
            return title.toLowerCase().includes(searchTerm.toLowerCase()) || grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [grievances, searchTerm]);
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title={t("My Grievances")} description={t("Track and manage your submitted reports.")} />

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={t("Search grievance ID or title...")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>

                    <Link href="/dashboard/citizen/grievances/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                        >
                            <Plus size={20} />
                            {t("New Grievance")}
                        </motion.button>
                    </Link>
                </div>

                {/* Grievances List */}
                <div className="grid gap-4">
                    {filteredGrievances.map((grievance, index) => (
                        <motion.div
                            key={grievance.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-purple-400">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                                {grievance.id}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${grievance.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    grievance.status === 'In Progress' || grievance.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {grievance.status || "Pending"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{grievance.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{grievance.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {grievance.createdAt?.toDate ? grievance.createdAt.toDate().toLocaleDateString() : "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} />
                                        {grievance.location?.address || "-"}
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}

