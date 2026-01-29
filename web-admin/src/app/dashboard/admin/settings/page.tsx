"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Shield,
    Bell,
    KeyRound,
    UserCog,
    Timer,
    Server,
    Download,
    CheckCircle2
} from "lucide-react";

const ADMIN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: FileText, label: "Grievances", href: "/dashboard/admin/grievances" },
    { icon: Users, label: "Citizens", href: "/dashboard/admin/citizens" },
    { icon: Users, label: "Workers", href: "/dashboard/admin/workers" },
];

export default function AdminSettingsPage() {
    const [twoFactor, setTwoFactor] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoEscalation, setAutoEscalation] = useState(true);
    const [roleApproval, setRoleApproval] = useState(true);
    const [dataExport, setDataExport] = useState(false);

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
            <Sidebar items={ADMIN_SIDEBAR_ITEMS} userType="admin" />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <Header
                    title="Admin Settings"
                    description="Control security, access, system behavior, and compliance."
                />

                <div className="max-w-3xl space-y-8">
                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Security</h3>
                                <p className="text-sm text-slate-500">Protect admin accounts and sensitive data.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <KeyRound size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Two-Factor Authentication</div>
                                        <div className="text-sm text-slate-500">Require 2FA for all admin logins</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTwoFactor(!twoFactor)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${twoFactor ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${twoFactor ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Bell size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Login Alerts</div>
                                        <div className="text-sm text-slate-500">Notify on new device or location</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLoginAlerts(!loginAlerts)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${loginAlerts ? "bg-purple-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${loginAlerts ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                <UserCog size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Access Control</h3>
                                <p className="text-sm text-slate-500">Manage roles and approvals for admins.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Users size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Role Changes Require Approval</div>
                                        <div className="text-sm text-slate-500">Adds a review step for role updates</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRoleApproval(!roleApproval)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${roleApproval ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${roleApproval ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Settings size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Default Admin Role</div>
                                        <div className="text-sm text-slate-500">Applied to new admin invites</div>
                                    </div>
                                </div>
                                <select className="bg-[#0f0f0f] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300">
                                    <option>Operations Admin</option>
                                    <option>Compliance Admin</option>
                                    <option>Super Admin</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                <Timer size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">SLA & Escalation</h3>
                                <p className="text-sm text-slate-500">Define response targets and auto-escalation.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Auto Escalation</div>
                                        <div className="text-sm text-slate-500">Escalate unresolved grievances automatically</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAutoEscalation(!autoEscalation)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${autoEscalation ? "bg-blue-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${autoEscalation ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Timer size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Resolution SLA</div>
                                        <div className="text-sm text-slate-500">Default resolution timeframe</div>
                                    </div>
                                </div>
                                <select className="bg-[#0f0f0f] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300">
                                    <option>24 hours</option>
                                    <option>48 hours</option>
                                    <option>72 hours</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-rose-500/10 text-rose-400">
                                <Server size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">System Controls</h3>
                                <p className="text-sm text-slate-500">Maintenance mode and platform behavior.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Server size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Maintenance Mode</div>
                                        <div className="text-sm text-slate-500">Temporarily restrict citizen access</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${maintenanceMode ? "bg-rose-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${maintenanceMode ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400">
                                <Download size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Notifications & Compliance</h3>
                                <p className="text-sm text-slate-500">Choose channels and data export controls.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Bell size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Email Notifications</div>
                                        <div className="text-sm text-slate-500">System alerts and weekly digests</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEmailNotifs(!emailNotifs)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${emailNotifs ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${emailNotifs ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Bell size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">SMS Notifications</div>
                                        <div className="text-sm text-slate-500">Urgent escalation and outage alerts</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSmsNotifs(!smsNotifs)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${smsNotifs ? "bg-emerald-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${smsNotifs ? "left-6" : "left-1"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Download size={18} className="text-slate-400" />
                                    <div>
                                        <div className="font-medium">Data Export Permissions</div>
                                        <div className="text-sm text-slate-500">Allow exports of grievance data</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDataExport(!dataExport)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${dataExport ? "bg-yellow-600" : "bg-slate-700"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${dataExport ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
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
