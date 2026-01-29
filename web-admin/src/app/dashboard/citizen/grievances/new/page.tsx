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
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

export default function NewGrievancePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [category, setCategory] = useState("Sanitation");
    const [location, setLocation] = useState("Detecting location...");

    // Mock Location Detection
    useState(() => {
        setTimeout(() => {
            setLocation("Sector 4, Bokaro Steel City");
        }, 1500);
    });

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate submission
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard/citizen/grievances");
        }, 1500);
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
                                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Category</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Sanitation", "Roads", "Water Supply", "Street Lights", "Drainage", "Others"].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${category === cat
                                                    ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {cat}
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

