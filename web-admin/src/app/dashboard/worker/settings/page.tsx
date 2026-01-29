"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    CheckSquare,
    Shield,
    Bell,
    Navigation,
    AlertTriangle,
    PhoneCall,
    Thermometer,
    User
} from "lucide-react";

const WORKER_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "My Tasks", href: "/dashboard/worker" },
    { icon: MapPin, label: "Map View", href: "/dashboard/worker/map" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/worker/schedule" },
    { icon: Shield, label: "Shift Tracking", href: "/dashboard/worker/shifts" },
    { icon: Bell, label: "Attendance", href: "/dashboard/worker/attendance" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/worker/completed" },
];

export default function WorkerSettingsPage() {
    const [locationSharing, setLocationSharing] = useState(true);
    const [safetyCheck, setSafetyCheck] = useState(true);
    const [weatherAlerts, setWeatherAlerts] = useState(true);
    const [shiftNotifs, setShiftNotifs] = useState(true);
    const [incidentAlerts, setIncidentAlerts] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
            <Sidebar items={WORKER_SIDEBAR_ITEMS} userType="worker" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header
                    title="Settings"
                    description="Control safety, location sharing, and work notifications."
                />

                <div className="max-w-3xl space-y-8">
                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                <Navigation size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Location & Safety</h3>
                                <p className="text-sm text-slate-500">Keep your team updated while on site.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <MapPin size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Live Location Sharing</div>
                                        <div className="text-sm text-slate-500">Share GPS with dispatch in real-time</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLocationSharing(!locationSharing)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${locationSharing ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${locationSharing ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Shield size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Safety Check-Ins</div>
                                        <div className="text-sm text-slate-500">Prompt every 2 hours during shifts</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSafetyCheck(!safetyCheck)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${safetyCheck ? "bg-purple-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${safetyCheck ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Notifications</h3>
                                <p className="text-sm text-slate-500">Stay informed about shifts and hazards.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Calendar size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Shift Reminders</div>
                                        <div className="text-sm text-slate-500">Receive schedule notifications</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShiftNotifs(!shiftNotifs)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${shiftNotifs ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${shiftNotifs ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <AlertTriangle size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Incident Alerts</div>
                                        <div className="text-sm text-slate-500">Warnings for hazards near you</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIncidentAlerts(!incidentAlerts)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${incidentAlerts ? "bg-rose-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${incidentAlerts ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Thermometer size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Weather Alerts</div>
                                        <div className="text-sm text-slate-500">Severe weather and heat warnings</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setWeatherAlerts(!weatherAlerts)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${weatherAlerts ? "bg-blue-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${weatherAlerts ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-rose-500/10 text-rose-400">
                                <PhoneCall size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Emergency Contacts</h3>
                                <p className="text-sm text-slate-500">Quick access to urgent support lines.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div>
                                    <div className="text-sm font-semibold">Supervisor</div>
                                    <div className="text-xs text-slate-500">+91 98888 11122</div>
                                </div>
                                <button className="text-emerald-400 text-sm">Call</button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div>
                                    <div className="text-sm font-semibold">Control Room</div>
                                    <div className="text-xs text-slate-500">+91 90000 12121</div>
                                </div>
                                <button className="text-emerald-400 text-sm">Call</button>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Profile</h3>
                                <p className="text-sm text-slate-500">Manage your personal info & ID badge.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>Employee ID</span>
                            <span className="text-white">EMP-8024</span>
                        </div>
                    </section>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-xs text-slate-500">Last updated: just now</div>
                        <button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}


