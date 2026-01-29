"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Shield, Users, Mail } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../../lib/firebase";

export default function CitizenLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const ensureUserProfile = async () => {
        if (!auth?.currentUser || !db) return;
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            const displayName = auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "User";
            await setDoc(userRef, {
                name: displayName,
                email: auth.currentUser.email || "",
                role: "USER",
                department: null,
                createdAt: serverTimestamp(),
            });
        }
    };

    const handleGoogleLogin = async () => {
        if (!auth) {
            setError("System Error: Firebase not configured.");
            return;
        }

        try {
            await signInWithPopup(auth, googleProvider);
            await ensureUserProfile();
            router.push("/dashboard/citizen");
        } catch {
            setError("Google sign-in failed. Please try again.");
        }
    };

    const handleEmailLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!auth) {
            setError("System Error: Firebase not configured.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await ensureUserProfile();
            router.push("/dashboard/citizen");
        } catch {
            setError("The email or password you entered is incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden text-foreground">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden md:block"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border text-xs font-medium text-pink-400 mb-6">
                        <Users size={14} className="text-pink-400" />
                        Citizen Portal
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
                        Voice Your <span className="text-muted-foreground">Concerns</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                        Report issues and track progress in real-time.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl opacity-30 group-hover:opacity-50 transition duration-500 blur-lg" />
                        <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-foreground mb-2">Get Started</h2>
                                <p className="text-muted-foreground text-sm">Sign in with your email or Google account.</p>
                            </div>

                            <form onSubmit={handleEmailLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-3.5 text-muted-foreground group-focus-within/input:text-pink-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="citizen@janpath.gov"
                                            className="w-full bg-muted border border-border rounded-xl px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500/50 focus:bg-accent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                                    <div className="relative group/input">
                                        <Shield className="absolute left-4 top-3.5 text-muted-foreground group-focus-within/input:text-pink-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-muted border border-border rounded-xl px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500/50 focus:bg-accent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 mt-4"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign in <ArrowRight size={18} /></>}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full bg-muted border border-border hover:bg-muted/80 text-foreground font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <Mail size={18} className="text-foreground" />
                                    Sign in with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
