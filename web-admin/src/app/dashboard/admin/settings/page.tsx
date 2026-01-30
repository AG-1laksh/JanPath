"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Shield,
    Bell,
    KeyRound,
    UserCog,
    Timer,
    Server,
    Download,
    CheckCircle2,
    Moon,
    Sun,
    Globe
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSettings } from "@/context/SettingsContext";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

export default function AdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useSettings();
    const [mounted, setMounted] = useState(false);

    // Local state for toggles
    const [twoFactor, setTwoFactor] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoEscalation, setAutoEscalation] = useState(true);
    const [roleApproval, setRoleApproval] = useState(true);
    const [dataExport, setDataExport] = useState(false);

    const [isLangOpen, setIsLangOpen] = useState(false);
    const languages = ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Kannada", "Marathi", "Malayalam"] as const;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-background text-foreground">
                <Header
                    title={t("Admin Settings")}
                    description={t("Control security, access, system behavior, and compliance.")}
                />

                <div className="max-w-3xl space-y-8">
                    {/* Appearance & Language (Common) */}
                    <section className="p-6 rounded-3xl bg-card border border-border">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                <Settings size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{t("Preferences")}</h3>
                                <p className="text-sm text-slate-500">{t("Customize your dashboard experience.")}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {theme === 'dark' ? <Moon size={18} className="text-slate-400" /> : <Sun size={18} className="text-slate-400" />}
                                    <div>
                                        <div className="font-medium">{t("Dark Mode")}</div>
                                        <div className="text-sm text-slate-500">{t("Switch between light and dark themes")}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${theme === "dark" ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${theme === "dark" ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            {/* Language Selector */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Globe size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">{t("Language")}</div>
                                        <div className="text-sm text-slate-500">{t("Select your preferred language")}</div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsLangOpen(!isLangOpen)}
                                        className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border text-sm font-medium flex items-center gap-2"
                                    >
                                        {language}
                                    </button>
                                    {isLangOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-40 p-1 rounded-xl bg-card border border-border shadow-xl z-20 flex flex-col gap-1">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => {
                                                        setLanguage(lang);
                                                        setIsLangOpen(false);
                                                    }}
                                                    className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${language === lang ? 'bg-purple-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>


                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-xs text-slate-500">Last updated: just now</div>
                        <button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}


