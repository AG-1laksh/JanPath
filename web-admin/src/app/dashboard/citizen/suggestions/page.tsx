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
    ThumbsUp,
    Send,
    Lightbulb
} from "lucide-react";
import { useState } from "react";

const CITIZEN_SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/citizen" },
    { icon: FileText, label: "Grievances", href: "/dashboard/citizen/grievances" },
    { icon: Users, label: "Community Impact", href: "/dashboard/citizen/community" },
    { icon: Eye, label: "Transparency Wall", href: "/dashboard/citizen/transparency" },
    { icon: MessageSquare, label: "Suggestion Box", href: "/dashboard/citizen/suggestions" },
    { icon: BarChart, label: "Reports", href: "/dashboard/citizen/reports" },
];

const SUGGESTIONS = [
    {
        id: 1,
        title: "Install Solar Street Lights in Sector 4",
        author: "Priya S.",
        votes: 156,
        description: "Moving to solar lights would reduce electricity costs and ensure lighting during power cuts."
    },
    {
        id: 2,
        title: "More Dustbins in Public Park",
        author: "Rahul M.",
        votes: 89,
        description: "Current bins are overflowing by evening. We need capacity increase."
    }
];

export default function SuggestionBoxPage() {
    const [votes, setVotes] = useState<Record<number, boolean>>({});

    const toggleVote = (id: number) => {
        setVotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar items={CITIZEN_SIDEBAR_ITEMS} userType="citizen" />

            <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 bg-[#050505] text-white">
                <Header title="Suggestion Box" description="Share ideas to improve your city." />

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Submission Form */}
                    <div>
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-white/10">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                                <Lightbulb className="text-yellow-400" /> Submit a New Idea
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="E.g., Park Renovation"
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Details</label>
                                    <textarea
                                        placeholder="Explain your suggestion..."
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 mt-1 min-h-[120px]"
                                    />
                                </div>
                                <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                    <Send size={18} /> Submit Suggestion
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Top Suggestions List */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Top Community Suggestions</h2>
                        {SUGGESTIONS.map((suggestion) => (
                            <div key={suggestion.id} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <button
                                            onClick={() => toggleVote(suggestion.id)}
                                            className={`p-2 rounded-lg transition-colors ${votes[suggestion.id] ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                                        >
                                            <ThumbsUp size={20} />
                                        </button>
                                        <span className="text-sm font-bold text-slate-300">
                                            {suggestion.votes + (votes[suggestion.id] ? 1 : 0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-1">{suggestion.title}</h3>
                                        <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                                        <div className="text-xs text-slate-600">Suggested by {suggestion.author}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

