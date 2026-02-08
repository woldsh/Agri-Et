"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2, Users, ShoppingBag, TrendingUp, AlertCircle, Settings, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { collection, getCountFromServer, query, orderBy, limit, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import Link from "next/link";
import { Listing } from "@/types";

export default function AdminDashboard() {
    const { user, profile, loading } = useAuth();
    const [stats, setStats] = useState({ users: 0, listings: 0, revenue: 0 });
    const [recentListings, setRecentListings] = useState<Listing[]>([]);

    useEffect(() => {
        if (!user) return;

        async function fetchStats() {
            try {
                const usersColl = collection(db, "users");
                const listingsColl = collection(db, "listings");

                const userSnapshot = await getCountFromServer(usersColl);
                const listingSnapshot = await getCountFromServer(listingsColl);

                setStats({
                    users: userSnapshot.data().count,
                    listings: listingSnapshot.data().count,
                    revenue: 0
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        }

        const q = query(
            collection(db, "listings"),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];
            setRecentListings(data);
        });

        fetchStats();
        return () => unsubscribe();
    }, [user]);

    const handleDeleteListing = async (id: string) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            try {
                await deleteDoc(doc(db, "listings", id));
            } catch (error) {
                console.error("Error deleting listing:", error);
                alert("Failed to delete listing");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user || profile?.role !== "admin") {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
                <AlertCircle size={48} className="text-red-500" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-zinc-500">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-zinc-500">Welcome back, {profile?.name}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/settings">
                        <Button variant="outline"> <Settings size={18} className="mr-2" /> System Settings</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Total Users", value: stats.users, icon: Users, color: "bg-blue-50 text-blue-600", link: "/dashboard/admin/users" },
                    { label: "Active Listings", value: stats.listings, icon: ShoppingBag, color: "bg-green-50 text-green-600", link: "/dashboard/admin/listings" },
                    { label: "Total Revenue", value: `ETB ${stats.revenue}`, icon: TrendingUp, color: "bg-purple-50 text-purple-600", link: "#" },
                ].map((stat, i) => (
                    <Link key={i} href={stat.link}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-primary-900 dark:text-white">{stat.value}</h3>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Recent Listings Section */}
            <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm dark:bg-zinc-900">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Listings</h2>
                    <Link href="/dashboard/admin/listings">
                        <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-sm text-zinc-500">
                                <th className="pb-4 font-medium">Product</th>
                                <th className="pb-4 font-medium">Category</th>
                                <th className="pb-4 font-medium">Price</th>
                                <th className="pb-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {recentListings.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-100">
                                                <Image
                                                    src={getOptimizedImage(item.mediaUrls?.[0], 100)}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-sm line-clamp-1">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm capitalize">{item.category}</td>
                                    <td className="py-4 text-sm font-bold text-primary-600">ETB {item.price}</td>
                                    <td className="py-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteListing(item.id)} className="text-red-500 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {recentListings.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-zinc-500">
                                        No recent listings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
