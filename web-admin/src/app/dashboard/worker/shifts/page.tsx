"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    Clock,
    LogIn,
    LogOut,
    PlayCircle,
    PauseCircle,
    UserCheck,
    ClipboardCheck
} from "lucide-react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: UserCheck, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const SHIFT_HISTORY = [
    { date: "Jan 29, 2026", clockIn: "08:02", clockOut: "16:15", break: "30 min", total: "8h 13m", status: "Current" },
    { date: "Jan 28, 2026", clockIn: "08:05", clockOut: "16:10", break: "30 min", total: "8h 05m", status: "Complete" },
    { date: "Jan 27, 2026", clockIn: "08:00", clockOut: "16:20", break: "35 min", total: "8h 20m", status: "Complete" },
    { date: "Jan 26, 2026", clockIn: "08:10", clockOut: "16:05", break: "30 min", total: "7h 55m", status: "Complete" },
];

export default function ShiftTrackingPage() {
    const [isClockedIn, setIsClockedIn] = useState(true);
    const [onBreak, setOnBreak] = useState(false);
    const [currentTime, setCurrentTime] = useState("08:02");
    const [elapsedTime, setElapsedTime] = useState("7h 45m");

    const handleClockIn = () => {
        setIsClockedIn(true);
        alert("Clocked in successfully at " + new Date().toLocaleTimeString());
    };

    const handleClockOut = () => {
        setIsClockedIn(false);
        setOnBreak(false);
        alert("Clocked out successfully at " + new Date().toLocaleTimeString());
    };

    const handleBreak = () => {
        setOnBreak(!onBreak);
        alert(onBreak ? "Break ended" : "Break started");
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Shift Tracking"
                    description="Clock in/out, manage breaks, and view shift history."
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Current Shift</h3>
                                    <p className="text-sm text-slate-500">Track your time and breaks</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Clocked In</div>
                                    <div className="text-xl font-bold text-emerald-400">{currentTime}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Elapsed Time</div>
                                    <div className="text-xl font-bold text-blue-400">{elapsedTime}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Status</div>
                                    <div className="text-xl font-bold text-purple-400">
                                        {isClockedIn ? (onBreak ? "On Break" : "Active") : "Off Duty"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {!isClockedIn ? (
                                    <button
                                        onClick={handleClockIn}
                                        className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LogIn size={20} />
                                        Clock In
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleClockOut}
                                            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 transition-colors text-white font-semibold flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={20} />
                                            Clock Out
                                        </button>
                                        <button
                                            onClick={handleBreak}
                                            className={`p-4 rounded-2xl transition-colors text-white font-semibold flex items-center justify-center gap-2 ${
                                                onBreak
                                                    ? "bg-blue-600 hover:bg-blue-500"
                                                    : "bg-orange-600 hover:bg-orange-500"
                                            }`}
                                        >
                                            {onBreak ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                                            {onBreak ? "End Break" : "Start Break"}
                                        </button>
                                        <button className="p-4 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 transition-colors text-purple-300 font-semibold flex items-center justify-center gap-2">
                                            <ClipboardCheck size={20} />
                                            Log Task
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold mb-4">Shift History</h3>
                            <div className="space-y-3">
                                {SHIFT_HISTORY.map((shift, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm"
                                    >
                                        <div>
                                            <div className="text-xs text-slate-500">Date</div>
                                            <div className="font-medium">{shift.date}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Clock In</div>
                                            <div className="font-medium text-emerald-400">{shift.clockIn}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Clock Out</div>
                                            <div className="font-medium text-rose-400">{shift.clockOut}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Break</div>
                                            <div className="font-medium">{shift.break}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Total</div>
                                            <div className="font-medium text-blue-400">{shift.total}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Status</div>
                                            <div
                                                className={`font-medium ${
                                                    shift.status === "Current" ? "text-purple-400" : "text-slate-400"
                                                }`}
                                            >
                                                {shift.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold mb-4">This Week</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Total Hours</span>
                                    <span className="text-white font-semibold">38h 45m</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Days Worked</span>
                                    <span className="text-white font-semibold">4 / 5</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Overtime</span>
                                    <span className="text-emerald-400 font-semibold">0h</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Avg Shift</span>
                                    <span className="text-white font-semibold">8h 10m</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left text-sm">
                                    <div className="font-medium">Request Time Off</div>
                                    <div className="text-xs text-slate-500">Submit leave application</div>
                                </button>
                                <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left text-sm">
                                    <div className="font-medium">View Payroll</div>
                                    <div className="text-xs text-slate-500">Check earnings & deductions</div>
                                </button>
                                <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left text-sm">
                                    <div className="font-medium">Export Timesheet</div>
                                    <div className="text-xs text-slate-500">Download monthly report</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


