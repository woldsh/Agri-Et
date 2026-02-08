"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (profile?.role === "farmer") {
                router.push("/dashboard/farmer");
            } else if (profile?.role === "merchant") {
                router.push("/dashboard/merchant");
            } else if (profile?.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                // Fallback or setup needed
                router.push("/");
            }
        }
    }, [user, profile, loading, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                <p className="text-lg font-medium text-zinc-600">Loading your dashboard...</p>
            </div>
        </div>
    );
}
