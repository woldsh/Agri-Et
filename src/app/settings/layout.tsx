"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/ui/Sidebar";
import { Loader2 } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="md:hidden p-4 border-b bg-white flex items-center justify-between">
                    <span className="font-bold">Agri-ET Settings</span>
                </div>
                {children}
            </div>
        </div>
    );
}
