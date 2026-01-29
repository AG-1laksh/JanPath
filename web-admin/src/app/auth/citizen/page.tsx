"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Phone, Star, Shield, Users, Mail } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function CitizenLogin() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setShowOtp(true);
            setLoading(false);
        }, 1200);
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Bypass Verification
        setTimeout(() => {
            router.push("/dashboard/citizen");
            setLoading(false);
        }, 1000);
    };

    const handleGoogleLogin = async () => {
        // Bypass Google Auth
        router.push("/dashboard/citizen");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
            {/* Ambient Background Effects - Warm Colors */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden md:block"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pink-200 mb-6">
                        <Users size={14} className="text-pink-400" />
                        Citizen Portal
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
                        Voice Your <span className="text-white/40">Concerns</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-8">
                        Report issues regarding sanitation, water supply, and roads directly to the administration. Track progress in real-time.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-white mb-1">Fast</div>
                            <div className="text-sm text-slate-500">Resolution Time</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-white mb-1">Transparent</div>
                            <div className="text-sm text-slate-500">Live Status Tracking</div>
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
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl opacity-30 group-hover:opacity-50 transition duration-500 blur-lg" />
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    {showOtp ? "Verify OTP" : "Get Started"}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {showOtp
                                        ? "Enter the 4-digit code sent to your phone."
                                        : "Enter your mobile number to access services."}
                                </p>
                            </div>

                            {!showOtp ? (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">
                                            Mobile Number
                                        </label>
                                        <div className="relative group/input">
                                            <Phone
                                                className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-pink-400 transition-colors"
                                                size={18}
                                            />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all font-mono"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 mt-4"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                Send OTP (Demo) <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-[#0a0a0a] px-2 text-slate-500">Or continue with</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        <Mail size={18} className="text-white" />
                                        Sign in with Google
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">
                                            One Time Password
                                        </label>
                                        <div className="relative group/input">
                                            <Shield
                                                className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-pink-400 transition-colors"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="••••"
                                                maxLength={4}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all font-mono tracking-widest text-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 mt-4"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                Verify & Login <Star size={18} className="fill-white/30" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowOtp(false)}
                                        className="w-full text-sm text-slate-500 hover:text-white transition-colors mt-4"
                                    >
                                        Change Phone Number
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
