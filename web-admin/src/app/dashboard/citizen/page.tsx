"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    FileText,
    Users,
    Eye,
    MessageSquare,
    BarChart,
    Settings,
    Clock,
    CheckCircle,
    RotateCcw,
    Activity
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Chatbot } from "@/components/Chatbot";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useMemo, useState } from "react";

// Updated Sidebar items based on the provided image
const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

type CitizenUser = {
    name: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    joinDate: string;
    avatarInitials: string;
};

export default function CitizenDashboard() {
    const { t } = useSettings();
    const { user, profile } = useAuth();
    const [grievances, setGrievances] = useState<any[]>([]);

    useEffect(() => {
        if (!db || !user) return;
        const grievancesQuery = query(
            collection(db, "grievances"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
            setGrievances(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const stats = useMemo(() => {
        const total = grievances.length;
        const resolved = grievances.filter((g) => g.status === "Resolved" || g.status === "Closed").length;
        const pending = grievances.filter((g) => g.status !== "Resolved" && g.status !== "Closed").length;
        return [
            { label: "Total", value: total.toString(), icon: FileText, color: "slate", trendUp: true },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle, color: "emerald", trendUp: true },
            { label: "Pending", value: pending.toString(), icon: Clock, color: "orange", trendUp: false },
        ];
    }, [grievances]);

    const displayUser: CitizenUser = useMemo(() => {
        const name = profile?.name || user?.displayName || "Citizen";
        const email = profile?.email || user?.email || "";
        const initials = name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        return {
            name,
            email,
            phone: (profile as any)?.phone || "Not provided",
            role: "Citizen",
            location: profile?.city || "Not provided",
            state: profile?.state || "Not provided",
            address: profile?.address || "Not provided",
            joinDate: profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : "-",
            avatarInitials: initials || "C",
        };
    }, [profile, user]);
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            {/* Note: The design in the image is light mode. Adjusting colors for this specific page if desired, 
                 or keeping dark mode for consistency. The prompt asked to include "like given in image". 
                 The image is LIGHT mode. I will adapt to a premium light/mixed mode or stick to the dark theme 
                 I've established if that's the project style. 
                 
                 However, the previous pages were dark. Switching to light abruptly might be jarring. 
                 I will implement a "Premium Light" version for this dashboard to match the image or a "Dark adaptation" 
                 that keeps the layout. 
                 
                 Let's stick to the Dark Theme established in login for consistency, 
                 BUT replicate the LAYOUT of the image perfectly.
             */}
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                {/* Re-overriding bg for dark mode consistency */}

                <Header title={t("Overview")} />

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Section (matches image layout) */}
                        <ProfileSection user={displayUser} isComplete={false} />

                    </div>

                    {/* Right Sidebar / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-purple-400" /> {t("Quick Stats")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-400 text-sm">{t("Total")}</span>
                                    <span className="text-lg font-bold text-white">{stats[0].value}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-400 text-sm">{t("Resolved")}</span>
                                    <span className="text-lg font-bold text-emerald-400">{stats[1].value}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-400 text-sm">{t("Pending")}</span>
                                    <span className="text-lg font-bold text-orange-400">{stats[2].value}</span>
                                </div>
                            </div>
                        </div>

                        {/* Whatsapp/Support Floating Style Widget Removed */}
                    </div>
                </div>
            </main>
            <Chatbot />
        </div>
    );
}


