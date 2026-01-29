"use client";

import { Bell, Search, User } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface HeaderProps {
    title: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    const { t } = useSettings();

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
                <button className="relative p-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-border hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-foreground transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-background" />
                </button>

                {/* Profile Link (placeholder) */}
                <button className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-border hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-foreground transition-all">
                    <User size={20} />
                </button>
            </div>
        </header>
    );
}
