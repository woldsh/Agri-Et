"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/ui/Sidebar";
import { Loader2 } from "lucide-react";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black">
            {/* Messages has its own internal layout, but we wrap it to ensure it fits the viewport correctly with the sidebar if we chose to use one, OR we can make it full screen. 
          For standard consistency, let's include the Sidebar on the left-most side */}
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-hidden h-screen">
                {children}
            </div>
        </div>
    );
}
