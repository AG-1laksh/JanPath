"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    LayoutDashboard,
    Users,
    FileText,
    UserCheck,
    Clock,
    CheckCircle,
    TrendingUp,
    Search,
    Eye,
    Mail,
    Phone,
    Briefcase,
    MoreVertical,
    Award,
    Activity
} from "lucide-react";
import { useState } from "react";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

const WORKER_STATS = [
    { label: "Total Workers", value: "248", icon: Users, color: "purple", trend: "+12", trendUp: true },
    { label: "Active Workers", value: "192", icon: UserCheck, color: "emerald", trend: "+8", trendUp: true },
    { label: "Tasks Completed", value: "1,456", icon: CheckCircle, color: "blue", trend: "+28.4%", trendUp: true },
    { label: "Avg Completion Time", value: "6.8 hrs", icon: Clock, color: "yellow", trend: "-1.2 hrs", trendUp: true },
];

interface Worker {
    id: string;
    empId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    specialization: string;
    status: "active" | "on-leave" | "inactive";
    assignedTasks: number;
    completedTasks: number;
    rating: number;
    efficiency: number;
    joinedAt: string;
    lastActive: string;
}

const MOCK_WORKERS: Worker[] = [
    {
        id: "WRK-001",
        empId: "EMP-8024",
        name: "Rajesh Kumar Singh",
        email: "rajesh.singh@janpath.gov",
        phone: "+91 98765 11111",
        department: "Infrastructure",
        specialization: "Road Maintenance",
        status: "active",
        assignedTasks: 5,
        completedTasks: 142,
        rating: 4.8,
        efficiency: 94,
        joinedAt: "Mar 15, 2024",
        lastActive: "2 hours ago"
    },
    {
        id: "WRK-002",
        empId: "EMP-4921",
        name: "Pradeep Sharma",
        email: "pradeep.sharma@janpath.gov",
        phone: "+91 98765 22222",
        department: "Water Supply",
        specialization: "Plumbing & Pipelines",
        status: "active",
        assignedTasks: 3,
        completedTasks: 198,
        rating: 4.9,
        efficiency: 96,
        joinedAt: "Jan 10, 2024",
        lastActive: "1 hour ago"
    },
    {
        id: "WRK-003",
        empId: "EMP-7832",
        name: "Suresh Patel",
        email: "suresh.patel@janpath.gov",
        phone: "+91 98765 33333",
        department: "Sanitation",
        specialization: "Waste Management",
        status: "active",
        assignedTasks: 7,
        completedTasks: 256,
        rating: 4.7,
        efficiency: 92,
        joinedAt: "Feb 5, 2024",
        lastActive: "30 mins ago"
    },
    {
        id: "WRK-004",
        empId: "EMP-5643",
        name: "Manoj Kumar",
        email: "manoj.kumar@janpath.gov",
        phone: "+91 98765 44444",
        department: "Electricity",
        specialization: "Electrical Works",
        status: "on-leave",
        assignedTasks: 0,
        completedTasks: 178,
        rating: 4.6,
        efficiency: 89,
        joinedAt: "Apr 20, 2024",
        lastActive: "3 days ago"
    },
    {
        id: "WRK-005",
        empId: "EMP-9821",
        name: "Vikram Reddy",
        email: "vikram.reddy@janpath.gov",
        phone: "+91 98765 55555",
        department: "Infrastructure",
        specialization: "Construction",
        status: "active",
        assignedTasks: 4,
        completedTasks: 134,
        rating: 4.5,
        efficiency: 88,
        joinedAt: "May 12, 2024",
        lastActive: "5 hours ago"
    },
    {
        id: "WRK-006",
        empId: "EMP-3456",
        name: "Anil Verma",
        email: "anil.verma@janpath.gov",
        phone: "+91 98765 66666",
        department: "Parks & Gardens",
        specialization: "Landscape Maintenance",
        status: "active",
        assignedTasks: 2,
        completedTasks: 167,
        rating: 4.7,
        efficiency: 91,
        joinedAt: "Mar 28, 2024",
        lastActive: "Yesterday"
    },
];

export default function WorkersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "on-leave": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "inactive": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 90) return "text-emerald-400";
        if (efficiency >= 75) return "text-blue-400";
        if (efficiency >= 60) return "text-yellow-400";
        return "text-rose-400";
    };

    const filteredWorkers = MOCK_WORKERS.filter(worker => {
        const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
        const matchesDepartment = departmentFilter === "all" || worker.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const departments = Array.from(new Set(MOCK_WORKERS.map(w => w.department)));

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Worker Management"
                    description="Manage and monitor field workers and their performance"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {WORKER_STATS.map((stat, i) => (
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
                                placeholder="Search by name, EMP ID, or department..."
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
                            <option value="on-leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Department Filter */}
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Workers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredWorkers.map((worker) => (
                        <div
                            key={worker.id}
                            className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{worker.name}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{worker.empId}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border capitalize ${getStatusColor(worker.status)}`}>
                                            {worker.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Department & Specialization */}
                            <div className="mb-4 p-3 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <Briefcase size={14} className="text-purple-400" />
                                    <span className="text-sm font-medium text-purple-400">{worker.department}</span>
                                </div>
                                <div className="text-xs text-slate-400 ml-6">{worker.specialization}</div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-slate-500" />
                                    <span className="text-slate-300 truncate">{worker.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-slate-500" />
                                    <span className="text-slate-300">{worker.phone}</span>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <div className="text-xs text-blue-400 mb-1">Assigned</div>
                                    <div className="text-lg font-semibold text-white">{worker.assignedTasks}</div>
                                </div>
                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <div className="text-xs text-emerald-400 mb-1">Completed</div>
                                    <div className="text-lg font-semibold text-white">{worker.completedTasks}</div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <div className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                                        <Award size={12} />
                                        Rating
                                    </div>
                                    <div className="text-lg font-semibold text-white">{worker.rating}</div>
                                </div>
                            </div>

                            {/* Efficiency Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Activity size={12} />
                                        Efficiency
                                    </span>
                                    <span className={`text-sm font-semibold ${getEfficiencyColor(worker.efficiency)}`}>
                                        {worker.efficiency}%
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${worker.efficiency >= 90 ? 'bg-emerald-500' :
                                                worker.efficiency >= 75 ? 'bg-blue-500' :
                                                    worker.efficiency >= 60 ? 'bg-yellow-500' : 'bg-rose-500'
                                            } rounded-full transition-all duration-500`}
                                        style={{ width: `${worker.efficiency}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500">
                                    Joined {worker.joinedAt}
                                </div>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors text-xs text-purple-400 font-medium">
                                        Assign Task
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group">
                                        <Eye size={14} className="text-slate-400 group-hover:text-purple-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredWorkers.length === 0 && (
                    <div className="py-12 text-center rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <Users size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-400">No workers found matching your filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}


