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
    Settings,
    Moon,
    Bell,
    Globe,
    Shield
} from "lucide-react";
import { useState } from "react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Settings" description="Manage your preferences and account." />

                <div className="max-w-2xl space-y-8">

                    {/* Appearance */}
                    <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-6">Appearance</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-white">Dark Mode</div>
                                    <div className="text-sm text-slate-500">Enable dark theme for the dashboard</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-purple-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-6">Notifications</h3>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-white">Push Notifications</div>
                                    <div className="text-sm text-slate-500">Receive updates about your grievances</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${notifications ? 'bg-emerald-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Account Links */}
                    <div className="space-y-4">
                        <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-4">
                                <Globe size={20} className="text-slate-400" />
                                <span className="text-white font-medium">Language Preference</span>
                            </div>
                            <span className="text-slate-500 text-sm">English (US)</span>
                        </button>
                        <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-4">
                                <Shield size={20} className="text-slate-400" />
                                <span className="text-white font-medium">Privacy & Security</span>
                            </div>
                        </button>
                    </div>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <div className="text-xs text-slate-600">Janpath App v1.0.2</div>
                    </div>

                </div>
            </main>
        </div>
    );
}

