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
    Shield,
    Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, notifications, setNotifications } = useSettings();
    const [mounted, setMounted] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const languages = ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Kannada", "Marathi", "Malayalam"] as const;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-background text-foreground">
                <Header title="Settings" description="Manage your preferences and account." />

                <div className="max-w-2xl space-y-8">

                    {/* Appearance */}
                    <div className="p-6 rounded-3xl bg-card border border-border">
                        <h3 className="text-lg font-bold mb-6">Appearance</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 dark:text-purple-400">
                                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                </div>
                                <div>
                                    <div className="font-medium">Dark Mode</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Enable dark theme for the dashboard</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className={`w-12 h-7 rounded-full transition-colors relative ${theme === "dark" ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${theme === "dark" ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="p-6 rounded-3xl bg-card border border-border">
                        <h3 className="text-lg font-bold mb-6">Notifications</h3>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 dark:text-blue-400">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <div className="font-medium">Push Notifications</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your grievances</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${notifications ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Account Links */}
                    <div className="space-y-4">
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="w-full p-4 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-border flex items-center justify-between transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <Globe size={20} className="text-slate-400" />
                                    <span className="font-medium">Language Preference</span>
                                </div>
                                <span className="text-slate-500 text-sm">{language === "English" ? "English (US)" : language}</span>
                            </button>
                            
                            {isLangOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-card border border-border shadow-xl z-20 grid grid-cols-2 gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setIsLangOpen(false);
                                            }}
                                            className={`p-2 text-sm rounded-lg text-left transition-colors ${language === lang ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="w-full p-4 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-border flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-4">
                                <Shield size={20} className="text-slate-400" />
                                <span className="font-medium">Privacy & Security</span>
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

