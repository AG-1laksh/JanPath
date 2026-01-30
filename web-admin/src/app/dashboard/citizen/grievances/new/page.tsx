"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
    LayoutDashboard,
    FileText,
    Users,
    Eye,
    MessageSquare,
    BarChart,
    Camera,
    MapPin,
    ArrowLeft,
    Loader2,
    CheckCircle,
    Globe,
    Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

export default function NewGrievancePage() {
    const { t } = useSettings();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [category, setCategory] = useState("Sanitation");
    const [location, setLocation] = useState("Detecting location...");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation("Location unavailable");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
            },
            () => setLocation("Location unavailable"),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, []);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                const result = reader.result as string;
                const base64 = result.includes(",") ? result.split(",")[1] : result;
                setImageBase64(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!db || !user) throw new Error("Not authenticated");

            await addDoc(collection(db, "grievances"), {
                title: category,
                description,
                category,
                priority: "Medium",
                status: "Submitted",
                imageBase64: imageBase64 || "",
                location: coords ? { ...coords, address: location } : { address: location },
                userId: user.uid,
                assignedWorkerId: null,
                isPublic: isPublic,
                createdAt: serverTimestamp(),
            });

            router.push("/dashboard/citizen/grievances");
        } catch {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <div className="mb-6">
                    <Link href="/dashboard/citizen/grievances" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
                        <ArrowLeft size={16} /> Back to Grievances
                    </Link>
                    <Header title="Report an Issue" description="Submit a new grievance to the administration." />
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">{t("Type of Worker Needed / Category")}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Electricity", "Water Supply", "Infrastructure", "Sanitation", "Drainage", "Others"].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${category === cat
                                                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {t(cat)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all min-h-[120px]"
                                    placeholder="Describe the issue in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Location (Auto-detected) */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Location</label>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                                    <MapPin size={18} className="text-purple-400" />
                                    <span className="text-sm font-mono">{location}</span>
                                </div>
                            </div>

                            {/* Privacy Toggle */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Visibility</label>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(true)}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${isPublic
                                                ? "bg-emerald-600/20 border border-emerald-500 text-emerald-300"
                                                : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                                            }`}
                                    >
                                        <Globe size={18} />
                                        <span className="text-sm font-medium">Share in Community</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(false)}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${!isPublic
                                                ? "bg-orange-600/20 border border-orange-500 text-orange-300"
                                                : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                                            }`}
                                    >
                                        <Lock size={18} />
                                        <span className="text-sm font-medium">Keep Private</span>
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 ml-1">
                                    {isPublic
                                        ? "Your report will be visible in the Community section for others to see and support."
                                        : "Your report will only be visible to you and the assigned workers."
                                    }
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-xl transition-all shine-effect disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mt-8"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Submit Report <CheckCircle size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Camera/Media Section */}
                    <div className="space-y-6">
                        <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider block">Evidence</label>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={handleCameraClick}
                            className={`
                                w-full aspect-[4/3] rounded-3xl border-2 border-dashed transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center
                                ${imagePreview ? 'border-purple-500/50 bg-[#0a0a0a]' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                            `}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera size={48} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Camera size={32} className="text-purple-400" />
                                    </div>
                                    <p className="text-slate-300 font-medium">Tap to Take Photo</p>
                                    <p className="text-slate-500 text-xs mt-1">or upload from gallery</p>
                                </>
                            )}
                        </motion.div>

                        <p className="text-xs text-slate-500 text-center">
                            Please ensure the photo clearly shows the issue and surrounding landmarks if possible.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
