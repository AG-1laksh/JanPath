"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Filter,
    Eye,
    UserCheck,
    MoreVertical
} from "lucide-react";
import { useState } from "react";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

const GRIEVANCE_STATS = [
    { label: "Total Grievances", value: "1,284", icon: FileText, color: "purple", trend: "+12.5%", trendUp: true },
    { label: "Pending", value: "342", icon: Clock, color: "yellow", trend: "+4.2%", trendUp: false },
    { label: "Resolved", value: "856", icon: CheckCircle, color: "emerald", trend: "+18.2%", trendUp: true },
    { label: "Rejected", value: "86", icon: XCircle, color: "rose", trend: "-2.1%", trendUp: true },
];

interface Grievance {
    id: string;
    title: string;
    citizen: string;
    category: string;
    status: "pending" | "in-progress" | "resolved" | "rejected";
    priority: "high" | "medium" | "low";
    assignedTo?: string;
    createdAt: string;
    location: string;
}

const MOCK_GRIEVANCES: Grievance[] = [
    {
        id: "GRV-4021",
        title: "Potholes on Main Road causing accidents",
        citizen: "Rahul Sharma",
        category: "Infrastructure",
        status: "pending",
        priority: "high",
        createdAt: "2 hours ago",
        location: "Sector 4, Main Road"
    },
    {
        id: "GRV-4020",
        title: "Street lights not working in residential area",
        citizen: "Priya Patel",
        category: "Electricity",
        status: "in-progress",
        priority: "medium",
        assignedTo: "Worker #EMP-8024",
        createdAt: "5 hours ago",
        location: "Sector 7, Block B"
    },
    {
        id: "GRV-4019",
        title: "Water supply issue - No water for 3 days",
        citizen: "Amit Kumar",
        category: "Water Supply",
        status: "resolved",
        priority: "high",
        assignedTo: "Worker #EMP-4921",
        createdAt: "1 day ago",
        location: "Sector 2, Colony"
    },
    {
        id: "GRV-4018",
        title: "Garbage not collected for a week",
        citizen: "Sunita Reddy",
        category: "Sanitation",
        status: "in-progress",
        priority: "medium",
        assignedTo: "Worker #EMP-7832",
        createdAt: "1 day ago",
        location: "Sector 9, Street 5"
    },
    {
        id: "GRV-4017",
        title: "Duplicate report - Already filed",
        citizen: "Vijay Singh",
        category: "Infrastructure",
        status: "rejected",
        priority: "low",
        createdAt: "2 days ago",
        location: "Sector 4, Main Road"
    },
];

export default function GrievancesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "in-progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "resolved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "rejected": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "text-rose-400";
            case "medium": return "text-yellow-400";
            case "low": return "text-slate-400";
            default: return "text-slate-400";
        }
    };

    const filteredGrievances = MOCK_GRIEVANCES.filter(grievance => {
        const matchesSearch = grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || grievance.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || grievance.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Grievance Management"
                    description="Manage and monitor all citizen grievances"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {GRIEVANCE_STATS.map((stat, i) => (
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
                                placeholder="Search by ID, title, or citizen name..."
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
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                {/* Grievances Table */}
                <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">ID</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Title</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Citizen</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Priority</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Assigned To</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Created</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrievances.map((grievance) => (
                                    <tr
                                        key={grievance.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-purple-400 font-mono text-sm">{grievance.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-white font-medium mb-1">{grievance.title}</div>
                                                <div className="text-xs text-slate-500">{grievance.location}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{grievance.citizen}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-400">{grievance.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium capitalize ${getPriorityColor(grievance.priority)}`}>
                                                {grievance.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(grievance.status)}`}>
                                                {grievance.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">
                                            {grievance.assignedTo || <span className="text-slate-600">Not assigned</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{grievance.createdAt}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <Eye size={16} className="text-slate-400 group-hover:text-purple-400" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <UserCheck size={16} className="text-slate-400 group-hover:text-blue-400" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                                                    <MoreVertical size={16} className="text-slate-400 group-hover:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredGrievances.length === 0 && (
                        <div className="py-12 text-center">
                            <AlertTriangle size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-400">No grievances found matching your filters</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


