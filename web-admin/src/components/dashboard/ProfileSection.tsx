"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Edit3, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProfileSectionProps {
    user: {
        name: string;
        email: string;
        phone: string;
        role: string;
        location?: string;
        state?: string;
        address?: string;
        joinDate: string;
        avatarInitials: string;
    };
    isComplete?: boolean;
}

export function ProfileSection({ user, isComplete = false }: ProfileSectionProps) {
    const { updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                name: formData.name,
                phone: formData.phone || null,
                state: formData.state || null,
                city: formData.location || null,
                address: formData.address || null,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const requiredStatus = {
        name: Boolean(formData.name && formData.name !== "Not provided"),
        email: Boolean(formData.email && formData.email !== "Not provided"),
        city: Boolean(formData.location && formData.location !== "Not provided"),
        phone: Boolean(formData.phone && formData.phone !== "Not provided"),
    };

    const allRequiredComplete = requiredStatus.name && requiredStatus.email && requiredStatus.city;

    return (
        <div className="space-y-6">
            {!isEditing && !allRequiredComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-4 items-start"
                >
                    <div className="p-2 rounded-full bg-orange-500/20 text-orange-400 shrink-0">
                        <span className="font-bold text-lg">!</span>
                    </div>
                    <div>
                        <h4 className="text-orange-200 font-semibold mb-1">Profile Completion Required</h4>
                        <p className="text-sm text-orange-200/70 mb-3">Please complete your profile with the required information to continue using the application.</p>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                            <span className={`flex items-center gap-1 ${requiredStatus.name ? "text-emerald-300" : "text-orange-300/80"}`}>
                                • Name (required)
                            </span>
                            <span className={`flex items-center gap-1 ${requiredStatus.email ? "text-emerald-300" : "text-orange-300/80"}`}>
                                • Email (required)
                            </span>
                            <span className={`flex items-center gap-1 ${requiredStatus.city ? "text-emerald-300" : "text-orange-300/80"}`}>
                                • City (required)
                            </span>
                            <span className={`flex items-center gap-1 ${requiredStatus.phone ? "text-emerald-300" : "text-orange-300/80"}`}>
                                • Phone number (optional)
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Avatar Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-1 p-8 rounded-3xl bg-card border border-border flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-foreground mb-6 border-4 border-card shadow-xl relative z-10">
                        {formData.avatarInitials}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-1">{formData.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                        <Mail size={14} />
                        {formData.email}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-accent border border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                        {formData.role}
                    </span>

                    <div className="mt-8 pt-6 border-t border-border w-full">
                        <p className="text-xs text-muted-foreground">Member since {formData.joinDate}</p>
                    </div>
                </motion.div>

                {/* Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 p-8 rounded-3xl bg-card border border-border relative"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-foreground">Profile Information</h3>
                        <button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditing
                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                : "bg-muted border border-border hover:bg-accent text-foreground"
                                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSaving ? (
                                <><Loader2 size={16} className="animate-spin" /> Saving...</>
                            ) : isEditing ? (
                                <><Check size={16} /> Save Changes</>
                            ) : (
                                <><Edit3 size={16} /> Edit Profile</>
                            )}
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-purple-500/50"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formData.name || "Not provided"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                            <p className="text-muted-foreground font-medium cursor-not-allowed">{formData.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-purple-500/50"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formData.phone || "Not provided"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">State</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.state || ""}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-purple-500/50"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formData.state || "Not provided"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-purple-500/50"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formData.location || "Not provided"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.address || ""}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-purple-500/50"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formData.address || "Not provided"}</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
