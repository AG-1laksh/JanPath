"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings, X, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
    title: string;
    description?: string;
}

const MOCK_NOTIFS = [
    { id: 1, text: "New grievance reported in Sector 4", time: "2m ago", unread: true },
    { id: 2, text: "Worker Ramesh updated task status", time: "1h ago", unread: false },
    { id: 3, text: "System maintenance scheduled", time: "5h ago", unread: false },
];

export function Header({ title, description }: HeaderProps) {
    const { t } = useSettings();
    const router = useRouter();
    const pathname = usePathname();
    const userType = pathname?.split("/")[2] || "citizen"; // Default to citizen if not found

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFS);
    
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Implement logout logic here (e.g., clearing tokens)
        router.push("/");
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-20">
            <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">{title}</h2>
                {description && <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden md:flex relative group">
                    <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={`${t("Search")}...`}
                        className="bg-black/5 dark:bg-white/5 border border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-black/10 dark:focus:bg-white/10 w-64 transition-all"
                    />
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-border hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-foreground transition-all"
                    >
                        <Bell size={20} />
                        {notifications.some(n => n.unread) && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-background" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-80 rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-border flex justify-between items-center">
                                    <h3 className="font-semibold text-sm">{t("Notifications")}</h3>
                                    <button 
                                        onClick={() => setIsNotifOpen(false)}
                                        className="text-slate-500 hover:text-foreground"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-slate-500">
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => markAsRead(notif.id)}
                                                className={`p-3 border-b border-border last:border-0 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex gap-3 ${notif.unread ? "bg-purple-500/5" : ""}`}
                                            >
                                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.unread ? "bg-purple-500" : "bg-transparent"}`} />
                                                <div className="flex-1">
                                                    <p className={`text-sm ${notif.unread ? "font-medium text-foreground" : "text-slate-500"}`}>
                                                        {notif.text}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Link */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-border hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-foreground transition-all"
                    >
                        <User size={20} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-48 rounded-xl bg-card border border-border shadow-xl overflow-hidden p-1 z-50"
                            >
                                <div className="px-3 py-2 border-b border-border mb-1">
                                    <p className="font-medium text-sm">User</p>
                                    <p className="text-xs text-slate-500 truncate">user@janpath.gov.in</p>
                                </div>
                                
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-foreground transition-colors">
                                    <User size={16} />
                                    {t("Profile")}
                                </button>
                                <Link 
                                    href={`/dashboard/${userType}/settings`}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-foreground transition-colors"
                                >
                                    <Settings size={16} />
                                    {t("Settings")}
                                </Link>
                                
                                <div className="h-px bg-border my-1" />
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                                >
                                    <LogOut size={16} />
                                    {t("Logout")}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
