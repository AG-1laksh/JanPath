"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    CheckSquare,
    Clock,
    AlarmClock,
    ClipboardList,
    CalendarClock
} from "lucide-react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Clock, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: AlarmClock, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

const WEEK_SCHEDULE = [
    { day: "Mon", shift: "08:00 - 16:00", tasks: 4 },
    { day: "Tue", shift: "08:00 - 16:00", tasks: 5 },
    { day: "Wed", shift: "10:00 - 18:00", tasks: 3 },
    { day: "Thu", shift: "08:00 - 16:00", tasks: 6 },
    { day: "Fri", shift: "09:00 - 17:00", tasks: 4 },
    { day: "Sat", shift: "Off", tasks: 0 },
    { day: "Sun", shift: "Off", tasks: 0 },
];

export default function WorkerSchedulePage() {
    const [shiftReminders, setShiftReminders] = useState(true);
    const [autoCheckIn, setAutoCheckIn] = useState(false);

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <Header
                    title="Schedule"
                    description="Plan shifts, track workload, and manage check-ins."
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                    <CalendarClock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Weekly Overview</h3>
                                    <p className="text-sm text-slate-500">Assigned shifts and estimated workload</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {WEEK_SCHEDULE.map((item) => (
                                    <div key={item.day} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold">{item.day}</span>
                                            <span className="text-xs text-slate-500">{item.tasks} tasks</span>
                                        </div>
                                        <div className="text-sm text-slate-300">{item.shift}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <ClipboardList size={18} />
                                    <span className="font-semibold">Request Shift Change</span>
                                </div>
                                <p className="text-sm text-slate-500">Submit availability or swap requests</p>
                            </button>
                            <button className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/40 transition-colors text-left">
                                <div className="flex items-center gap-3 text-purple-400 mb-2">
                                    <AlarmClock size={18} />
                                    <span className="font-semibold">Log Overtime</span>
                                </div>
                                <p className="text-sm text-slate-500">Record extra hours for approval</p>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Shift Controls</h3>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Clock size={18} className="text-slate-400" />
                                        <div>
                                            <div className="font-medium">Shift Reminders</div>
                                            <div className="text-sm text-slate-500">Get alerts 30 min before start</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShiftReminders(!shiftReminders)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${shiftReminders ? "bg-emerald-600" : "bg-slate-700"}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${shiftReminders ? "left-6" : "left-1"}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CheckSquare size={18} className="text-slate-400" />
                                        <div>
                                            <div className="font-medium">Auto Check-In</div>
                                            <div className="text-sm text-slate-500">Clock in when you arrive on site</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAutoCheckIn(!autoCheckIn)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${autoCheckIn ? "bg-purple-600" : "bg-slate-700"}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${autoCheckIn ? "left-6" : "left-1"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Today</h3>
                            <div className="space-y-3 text-sm text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span>Shift</span>
                                    <span className="text-white">08:00 - 16:00</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Break</span>
                                    <span className="text-white">12:30 - 13:00</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Sites</span>
                                    <span className="text-white">4 assigned</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
