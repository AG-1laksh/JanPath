"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, BadgeCheck, HardHat, Hammer, MapPin, AlertCircle } from "lucide-react";

export default function WorkerLogin() {
    const router = useRouter();
    const [workerId, setWorkerId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        // Bypass Auth
        setTimeout(() => {
            router.push("/dashboard/worker");
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
            {/* Ambient Background Effects - Emerald/Lime */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Side: Brand/Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden md:block"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-200 mb-6">
                        <HardHat size={14} className="text-emerald-400" />
                        Field Force Portal
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
                        Janpath <span className="text-white/40">Worker</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-8">
                        Manage tasks, update grievance status on the go, and coordinate with the control room efficiently.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-white mb-1">Live</div>
                            <div className="text-sm text-slate-500">Task Assignments</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-white mb-1">GPS</div>
                            <div className="text-sm text-slate-500">Location Tracking</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-3xl opacity-30 group-hover:opacity-50 transition duration-500 blur-lg" />
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">

                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-white mb-2">Field Login</h2>
                                <p className="text-slate-400 text-sm">Enter you Worker ID to view assignments.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Worker ID</label>
                                    <div className="relative group/input">
                                        <BadgeCheck className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={workerId}
                                            onChange={(e) => setWorkerId(e.target.value)}
                                            placeholder="EMP-8024"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all uppercase"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Password</label>
                                    <div className="relative group/input">
                                        <Hammer className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl overflow-hidden"
                                        >
                                            <AlertCircle size={16} className="shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Access Dashboard <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
                                <MapPin size={12} />
                                <span>Location services must be enabled.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
