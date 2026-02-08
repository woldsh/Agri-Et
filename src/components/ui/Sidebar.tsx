"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    PlusCircle,
    ShoppingBag,
    Settings,
    LogOut,
    Sprout,
    Search,
    Heart,
    Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./Button";
import { motion } from "framer-motion";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

export function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { profile, signOut } = useAuth();
    const { unreadCount } = useUnreadMessages();
    const currentTab = searchParams.get("tab");

    const isFarmer = profile?.role === "farmer";

    // Safety check: ensure the hook returns a number
    const safeUnreadCount = typeof unreadCount === 'number' ? unreadCount : 0;

    const farmerLinks = [
        { href: "/dashboard/farmer", label: "Overview", icon: LayoutDashboard },
        { href: "/marketplace", label: "Browse Marketplace", icon: Search },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/dashboard/farmer?tab=products", label: "My Products", icon: Sprout },
        { href: "/dashboard/farmer?tab=orders", label: "My Orders", icon: ShoppingBag },
        { href: "/dashboard/farmer?tab=post", label: "Post New Product", icon: PlusCircle },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    const merchantLinks = [
        { href: "/dashboard/merchant", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/merchant?tab=post", label: "Post New Product", icon: PlusCircle },
        { href: "/marketplace", label: "Browse Market", icon: Search },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/dashboard/merchant?tab=orders", label: "My Orders", icon: ShoppingBag },
        { href: "/dashboard/merchant?tab=saved", label: "Saved Items", icon: Heart },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    const adminLinks = [
        { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
        { href: "/dashboard/admin/listings", label: "All Listings", icon: ShoppingBag },
        { href: "/settings", label: "System Settings", icon: Settings },
    ];

    let links = merchantLinks;
    if (profile?.role === "farmer") links = farmerLinks;
    if (profile?.role === "admin") links = adminLinks;

    return (
        <div className="flex h-screen w-64 flex-col border-r border-primary-100 bg-white/80 backdrop-blur-md dark:border-primary-800/50 dark:bg-primary-950/90">
            <div className="flex h-16 items-center px-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                        <Sprout size={18} />
                    </div>
                    <span>Agri-ET</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-3">
                    {links.map((link) => {
                        // Improved active state logic for tabs
                        const linkPath = link.href.split('?')[0];
                        const linkTab = new URLSearchParams(link.href.split('?')[1] || "").get("tab");

                        const isActive = pathname === linkPath && currentTab === linkTab;
                        const isMessages = link.label === "Messages";

                        return (
                            <Link key={link.href} href={link.href}>
                                <div
                                    className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <link.icon size={20} />
                                    <span className="flex-1">{link.label}</span>
                                    {isMessages && safeUnreadCount > 0 && (
                                        <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                                            {safeUnreadCount > 99 ? '99+' : safeUnreadCount}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => signOut()}
                        className="w-full relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <LogOut size={20} />
                        <span className="flex-1 text-left">Sign Out</span>
                    </button>
                </nav>
            </div>

            <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <span className="font-bold">{profile?.name?.charAt(0) || "U"}</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">{profile?.name}</p>
                        <p className="truncate text-xs capitalize text-zinc-500">{profile?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
