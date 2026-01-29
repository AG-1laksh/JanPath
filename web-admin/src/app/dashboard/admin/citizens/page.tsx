"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    UserCheck,
    UserPlus,
    UserX,
    Activity,
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    MoreVertical
} from "lucide-react";
import { useState } from "react";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

const CITIZEN_STATS = [
    { label: "Total Citizens", value: "8,456", icon: Users, color: "purple", trend: "+245", trendUp: true },
    { label: "Active Users", value: "6,234", icon: UserCheck, color: "emerald", trend: "+12.3%", trendUp: true },
    { label: "New This Month", value: "324", icon: UserPlus, color: "blue", trend: "+45", trendUp: true },
    { label: "Avg Grievances", value: "2.4", icon: Activity, color: "yellow", trend: "-0.3", trendUp: true },
];

interface Citizen {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    sector: string;
    grievancesCount: number;
    resolvedCount: number;
    status: "active" | "inactive" | "blocked";
    joinedAt: string;
    lastActive: string;
}

const MOCK_CITIZENS: Citizen[] = [
    {
        id: "CIT-1001",
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 43210",
        address: "House 42, Block A",
        sector: "Sector 4",
        grievancesCount: 8,
        resolvedCount: 7,
        status: "active",
        joinedAt: "Jan 15, 2026",
        lastActive: "2 hours ago"
    },
    {
        id: "CIT-1002",
        name: "Priya Patel",
        email: "priya.patel@email.com",
        phone: "+91 98765 43211",
        address: "House 156, Block B",
        sector: "Sector 7",
        grievancesCount: 3,
        resolvedCount: 3,
        status: "active",
        joinedAt: "Jan 10, 2026",
        lastActive: "1 day ago"
    },
    {
        id: "CIT-1003",
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        phone: "+91 98765 43212",
        address: "Flat 204, Tower C",
        sector: "Sector 2",
        grievancesCount: 12,
        resolvedCount: 9,
        status: "active",
        joinedAt: "Dec 20, 2025",
        lastActive: "5 hours ago"
    },
    {
        id: "CIT-1004",
        name: "Sunita Reddy",
        email: "sunita.reddy@email.com",
        phone: "+91 98765 43213",
        address: "House 89, Street 5",
        sector: "Sector 9",
        grievancesCount: 5,
        resolvedCount: 4,
        status: "active",
        joinedAt: "Jan 5, 2026",
        lastActive: "3 days ago"
    },
    {
        id: "CIT-1005",
        name: "Vijay Singh",
        email: "vijay.singh@email.com",
        phone: "+91 98765 43214",
        address: "House 23, Block D",
        sector: "Sector 4",
        grievancesCount: 2,
        resolvedCount: 1,
        status: "inactive",
        joinedAt: "Nov 12, 2025",
        lastActive: "2 weeks ago"
    },
    {
        id: "CIT-1006",
        name: "Anjali Desai",
        email: "anjali.desai@email.com",
        phone: "+91 98765 43215",
        address: "Flat 501, Tower A",
        sector: "Sector 3",
        grievancesCount: 15,
        resolvedCount: 11,
        status: "active",
        joinedAt: "Oct 8, 2025",
        lastActive: "Yesterday"
    },
];

export default function CitizensPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sectorFilter, setSectorFilter] = useState<string>("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "inactive": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            case "blocked": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const filteredCitizens = MOCK_CITIZENS.filter(citizen => {
        const matchesSearch = citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            citizen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            citizen.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || citizen.status === statusFilter;
        const matchesSector = sectorFilter === "all" || citizen.sector === sectorFilter;
        return matchesSearch && matchesStatus && matchesSector;
    });

    const sectors = Array.from(new Set(MOCK_CITIZENS.map(c => c.sector)));

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Citizen Management"
                    description="Manage and monitor registered citizens"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {CITIZEN_STATS.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="mb-6 p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, ID, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                        </select>

                        {/* Sector Filter */}
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Sectors</option>
                            {sectors.map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Citizens Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCitizens.map((citizen) => (
                        <div
                            key={citizen.id}
                            className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {citizen.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{citizen.name}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{citizen.id}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border capitalize ${getStatusColor(citizen.status)}`}>
                                    {citizen.status}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-slate-500" />
                                    <span className="text-slate-300 truncate">{citizen.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{citizen.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{citizen.address}, {citizen.sector}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Grievances</div>
                                    <div className="text-lg font-semibold text-white">{citizen.grievancesCount}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Resolved</div>
                                    <div className="text-lg font-semibold text-emerald-400">{citizen.resolvedCount}</div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500">
                                    Joined {citizen.joinedAt}
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                        <Eye size={14} className="text-slate-400 group-hover:text-purple-400" />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                        <MoreVertical size={14} className="text-slate-400 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCitizens.length === 0 && (
                    <div className="py-12 text-center rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <Users size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-400">No citizens found matching your filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}


