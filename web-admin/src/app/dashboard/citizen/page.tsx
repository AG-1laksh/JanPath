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

// Updated Sidebar items based on the provided image
const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

const CITIZEN_STATS = [
    { label: "Total", value: "0", icon: FileText, color: "slate", trendUp: true },
    { label: "Resolved", value: "0", icon: CheckCircle, color: "emerald", trendUp: true },
    { label: "Pending", value: "0", icon: Clock, color: "orange", trendUp: false },
];

// Mock User Data matching the image
const USER_DATA = {
    name: "Lakshya Agarwal",
    email: "resilient.warrior123@gmail.com",
    phone: "Not provided",
    role: "Citizen",
    location: "Not provided",
    joinDate: "1/29/2026",
    avatarInitials: "LA",
};

export default function CitizenDashboard() {
    const { t } = useSettings();
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
                        <ProfileSection user={USER_DATA} isComplete={false} />

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
                                    <span className="text-lg font-bold text-white">0</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-400 text-sm">{t("Resolved")}</span>
                                    <span className="text-lg font-bold text-emerald-400">0</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-400 text-sm">{t("Pending")}</span>
                                    <span className="text-lg font-bold text-orange-400">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Whatsapp/Support Floating Style Widget */}
                        <div className="p-4 rounded-2xl bg-[#111b21] border border-white/5 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:bg-[#202c33] transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-emerald-100 mb-0.5">WhatsApp Support</div>
                                    <div className="text-xs text-emerald-100/60 leading-relaxed">
                                        Chat with Ultron for instant help.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


