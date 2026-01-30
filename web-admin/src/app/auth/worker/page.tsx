"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, BadgeCheck, HardHat, Hammer, MapPin, AlertCircle } from "lucide-react";

export default function WorkerLogin() {
    const router = useRouter();
    const { user, role, loading: authLoading } = useAuth();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [city, setCity] = useState("");
    const [department, setDepartment] = useState("");
    const [skills, setSkills] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [experienceMonths, setExperienceMonths] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!auth || !db) {
            setError("System Error: Firebase not configured.");
            setIsLoading(false);
            return;
        }

        try {
            if (mode === "signup") {
                if (!name || !dob || !phone || !aadhar || !city || !department || !skills) {
                    setError("Please fill all required worker details.");
                    setIsLoading(false);
                    return;
                }

                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", userCred.user.uid), {
                    name,
                    email,
                    role: "WORKER_PENDING",
                    department,
                    createdAt: serverTimestamp(),
                });
                await addDoc(collection(db, "workerSignupRequests"), {
                    workerId: userCred.user.uid,
                    name,
                    email,
                    dob,
                    phone,
                    aadhar,
                    city,
                    department,
                    skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
                    experienceYears,
                    experienceMonths,
                    status: "Pending",
                    requestedAt: serverTimestamp(),
                });
                setError("Request sent. Admin approval required before login.");
                await signOut(auth);
                setIsLoading(false);
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            const userRef = doc(db, "users", auth.currentUser?.uid || "");
            const userSnap = await getDoc(userRef);
            let userRole = userSnap.data()?.role;

            if (userRole !== "WORKER") {
                const approvalsQuery = query(
                    collection(db, "workerSignupRequests"),
                    where("workerId", "==", auth.currentUser?.uid),
                    where("status", "in", ["Approved", "approved", "APPROVED"])
                );
                const approvalsSnap = await getDocs(approvalsQuery);
                if (!approvalsSnap.empty) {
                    await updateDoc(userRef, { role: "WORKER" });
                    userRole = "WORKER";
                }
            }

            if (userRole === "WORKER_PENDING") {
                setError("Pending approval: Admin approval is required.");
                await signOut(auth);
                setIsLoading(false);
                return;
            }
            if (userRole !== "WORKER") {
                setError("Access Denied: Worker privileges required.");
                await signOut(auth);
                setIsLoading(false);
                return;
            }
            router.push("/dashboard/worker");
        } catch (err) {
            setError("The email or password you entered is incorrect.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading || !user) return;
        if (role === "WORKER") router.replace("/dashboard/worker");
        else if (role === "ADMIN") router.replace("/dashboard/admin");
    }, [authLoading, role, router, user]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden text-foreground">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border text-xs font-medium text-emerald-400 mb-6">
                        <HardHat size={14} className="text-emerald-400" />
                        Field Force Portal
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
                        Janpath <span className="text-muted-foreground">Worker</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                        Manage tasks, update grievance status on the go, and coordinate with the control room efficiently.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-card border border-border backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-foreground mb-1">Live</div>
                            <div className="text-sm text-muted-foreground">Task Assignments</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border backdrop-blur-sm">
                            <div className="text-2xl font-semibold text-foreground mb-1">GPS</div>
                            <div className="text-sm text-muted-foreground">Location Tracking</div>
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
                        <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-foreground mb-2">Field Login</h2>
                                <p className="text-muted-foreground text-sm">Enter you Worker ID to view assignments.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {mode === "signup" && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Full Name</label>
                                            <div className="relative group/input">
                                                <BadgeCheck className="absolute left-4 top-3.5 text-muted-foreground group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Full name"
                                                    className="w-full bg-muted border border-border rounded-xl px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Date of Birth</label>
                                            <input
                                                type="text"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                placeholder="DD/MM/YYYY"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Phone</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Phone"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Aadhar</label>
                                            <input
                                                type="text"
                                                value={aadhar}
                                                onChange={(e) => setAadhar(e.target.value)}
                                                placeholder="Aadhar"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="City"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Department</label>
                                            <input
                                                type="text"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                placeholder="Department"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Skills (comma separated)</label>
                                            <input
                                                type="text"
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                placeholder="Road Repair, Plumbing"
                                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Experience Years</label>
                                                <input
                                                    type="number"
                                                    value={experienceYears}
                                                    onChange={(e) => setExperienceYears(e.target.value)}
                                                    placeholder="Years"
                                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Experience Months</label>
                                                <input
                                                    type="number"
                                                    value={experienceMonths}
                                                    onChange={(e) => setExperienceMonths(e.target.value)}
                                                    placeholder="Months"
                                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Email Address</label>
                                    <div className="relative group/input">
                                        <BadgeCheck className="absolute left-4 top-3.5 text-muted-foreground group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="worker@janpath.gov"
                                            className="w-full bg-muted border border-border rounded-xl px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                                    <div className="relative group/input">
                                        <Hammer className="absolute left-4 top-3.5 text-muted-foreground group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-muted border border-border rounded-xl px-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:bg-accent transition-all"
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
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {mode === "signup" ? "Request Access" : "Access Dashboard"} <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {mode === "signin" ? "No account? Request worker access" : "Already requested? Sign in"}
                                </button>
                            </form>

                            <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
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
