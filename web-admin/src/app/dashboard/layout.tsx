"use client";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {children}
        </div>
    );
}
