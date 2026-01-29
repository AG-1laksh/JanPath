"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    type LucideIcon,
    Bell,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface SidebarProps {
    items: SidebarItem[];
    userType: "admin" | "citizen" | "worker";
}

export function Sidebar({ items, userType }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Common items that might be at the bottom
    const bottomItems = [
        { icon: Settings, label: "Settings", href: `/dashboard/${userType}/settings` },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 
                    flex flex-col h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0 md:flex
                `}
            >
                {/* Brand */}
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Janpath <span className="text-white/40 capitalize">{userType}</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                <item.icon size={18} className={isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-white'} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <div className="my-6 border-t border-white/5" />

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">System</div>
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <item.icon size={18} className="text-slate-500 group-hover:text-white" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User User Profile Snippet */}
                <div className="p-4 border-t border-white/5 bg-white/2">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {userType[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate capitalize">{userType} User</div>
                            <div className="text-xs text-slate-500 truncate">user@janpath.gov</div>
                        </div>
                        <LogOut size={16} className="text-slate-500 hover:text-rose-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
