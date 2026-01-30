"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    Clock,
    UserCheck,
    CheckCircle2,
    XCircle,
    FileText,
    TrendingUp,
    CalendarDays
} from "lucide-react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: UserCheck, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const ATTENDANCE_RECORDS = [
    { date: "Jan 29, 2026", day: "Mon", status: "Present", hours: "8h 13m", punctuality: "On Time" },
    { date: "Jan 28, 2026", day: "Tue", status: "Present", hours: "8h 05m", punctuality: "On Time" },
    { date: "Jan 27, 2026", day: "Wed", status: "Present", hours: "8h 20m", punctuality: "Late (5 min)" },
    { date: "Jan 26, 2026", day: "Thu", status: "Present", hours: "7h 55m", punctuality: "On Time" },
    { date: "Jan 25, 2026", day: "Fri", status: "Leave", hours: "-", punctuality: "Approved Leave" },
    { date: "Jan 24, 2026", day: "Sat", status: "Off", hours: "-", punctuality: "-" },
    { date: "Jan 23, 2026", day: "Sun", status: "Off", hours: "-", punctuality: "-" },
];

const LEAVE_REQUESTS = [
    { id: "L-001", type: "Sick Leave", from: "Feb 5, 2026", to: "Feb 6, 2026", status: "Pending", days: 2 },
    { id: "L-002", type: "Casual Leave", from: "Jan 25, 2026", to: "Jan 25, 2026", status: "Approved", days: 1 },
];

export default function AttendancePage() {
    const [showLeaveForm, setShowLeaveForm] = useState(false);

    const handleLeaveRequest = () => {
        setShowLeaveForm(true);
    };

    const handleSubmitLeave = () => {
        alert("Leave request submitted for approval");
        setShowLeaveForm(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Attendance Tracking"
                    description="Monitor attendance, leave balance, and punctuality records."
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="text-xs text-slate-500 mb-1">This Month</div>
                                <div className="text-2xl font-bold text-emerald-400">22 Days</div>
                                <div className="text-xs text-slate-400 mt-1">Present</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="text-xs text-slate-500 mb-1">Leave Taken</div>
                                <div className="text-2xl font-bold text-orange-400">2 Days</div>
                                <div className="text-xs text-slate-400 mt-1">This Month</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="text-xs text-slate-500 mb-1">Leave Balance</div>
                                <div className="text-2xl font-bold text-blue-400">12 Days</div>
                                <div className="text-xs text-slate-400 mt-1">Remaining</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="text-xs text-slate-500 mb-1">Punctuality</div>
                                <div className="text-2xl font-bold text-purple-400">95%</div>
                                <div className="text-xs text-slate-400 mt-1">This Month</div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Attendance Records</h3>
                                <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors">
                                    Export Report
                                </button>
                            </div>
                            <div className="space-y-3">
                                {ATTENDANCE_RECORDS.map((record, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm"
                                    >
                                        <div>
                                            <div className="text-xs text-slate-500">Date</div>
                                            <div className="font-medium">{record.date}</div>
                                            <div className="text-xs text-slate-400">{record.day}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Status</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {record.status === "Present" ? (
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                ) : record.status === "Leave" ? (
                                                    <FileText size={14} className="text-orange-400" />
                                                ) : (
                                                    <XCircle size={14} className="text-slate-500" />
                                                )}
                                                <span
                                                    className={`font-medium ${
                                                        record.status === "Present"
                                                            ? "text-emerald-400"
                                                            : record.status === "Leave"
                                                            ? "text-orange-400"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Hours</div>
                                            <div className="font-medium text-blue-400">{record.hours}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs text-slate-500">Punctuality</div>
                                            <div
                                                className={`font-medium ${
                                                    record.punctuality.includes("Late")
                                                        ? "text-orange-400"
                                                        : record.punctuality === "On Time"
                                                        ? "text-emerald-400"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {record.punctuality}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold mb-4">Leave Requests</h3>
                            <div className="space-y-3 mb-4">
                                {LEAVE_REQUESTS.map((leave) => (
                                    <div key={leave.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold">{leave.type}</span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${
                                                    leave.status === "Approved"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : leave.status === "Pending"
                                                        ? "bg-orange-500/20 text-orange-400"
                                                        : "bg-rose-500/20 text-rose-400"
                                                }`}
                                            >
                                                {leave.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500">{leave.from} to {leave.to}</div>
                                        <div className="text-xs text-slate-400 mt-1">{leave.days} day(s)</div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleLeaveRequest}
                                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <CalendarDays size={18} />
                                Request Leave
                            </button>
                        </div>

                        {showLeaveForm && (
                            <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-purple-500/30">
                                <h3 className="text-lg font-bold mb-4">New Leave Request</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">Leave Type</label>
                                        <select className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-white text-sm">
                                            <option>Sick Leave</option>
                                            <option>Casual Leave</option>
                                            <option>Emergency Leave</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">From Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">To Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">Reason</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-white text-sm"
                                            placeholder="Brief reason for leave..."
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSubmitLeave}
                                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => setShowLeaveForm(false)}
                                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold mb-4">Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Attendance Rate</span>
                                    <span className="text-emerald-400 font-semibold">96.2%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Avg Hours/Day</span>
                                    <span className="text-white font-semibold">8h 10m</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Late Count</span>
                                    <span className="text-orange-400 font-semibold">2 times</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Perfect Months</span>
                                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                                        <TrendingUp size={14} /> 3
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


