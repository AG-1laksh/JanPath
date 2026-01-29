"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ActivityItem {
    id: string;
    title: string;
    description: string;
    time: string;
    status?: "pending" | "resolved" | "in-progress" | "rejected";
}

interface RecentActivityProps {
    items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
    const getStatusColor = (status?: string) => {
        switch (status) {
            case "resolved": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "in-progress": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "rejected": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            default: return "text-orange-400 bg-orange-500/10 border-orange-500/20";
        }
    };

    return (
        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock size={18} className="text-purple-400" />
                    Recent Activity
                </h3>
            </div>

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No recent activity found.
                    </div>
                ) : (
                    items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                        >
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                                <p className="text-xs text-slate-500 truncate">{item.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-xs text-slate-500 mb-1">{item.time}</div>
                                {item.status && (
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
