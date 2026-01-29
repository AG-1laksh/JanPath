"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: string; // e.g. "purple", "blue", "emerald"
    delay?: number;
}

export function StatCard({ label, value, trend, trendUp, icon: Icon, color = "purple", delay = 0 }: StatCardProps) {
    // Map colors to Tailwind classes safely
    const colorStyles = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }[color] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-sidebar-border transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${colorStyles}`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-border ${trendUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                        {trend}
                    </div>
                )}
            </div>

            <h3 className="text-3xl font-bold text-foreground mb-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        </motion.div>
    );
}
