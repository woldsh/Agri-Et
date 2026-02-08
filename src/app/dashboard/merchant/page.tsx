"use client";

import { useAuth } from "@/hooks/useAuth";
import { Listing } from "@/types";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, ShoppingBag, Heart, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { sortByProximity } from "@/lib/locationUtils";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { PostListingForm } from "@/components/dashboard/PostListingForm";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default function MerchantDashboard() {
    const { user, profile } = useAuth();
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const [recommendations, setRecommendations] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    const [myListings, setMyListings] = useState<Listing[]>([]);

    useEffect(() => {
        if (!user || !db) return;

        // Fetch recent listings to recommend
        const q = query(
            collection(db, "listings"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubscribeRecommendations = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];

            // Apply our smart location sorting for the recommendations!
            const smartListings = profile?.region
                ? sortByProximity(data, profile.region, profile.woreda).slice(0, 3)
                : data.slice(0, 3);

            setRecommendations(smartListings);
            setLoading(false);
        });

        // Fetch user's own listings for stats
        const listingsQuery = query(
            collection(db, "listings"),
            where("userId", "==", user.uid)
        );

        const unsubscribeListings = onSnapshot(listingsQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];
            setMyListings(data);
        });

        return () => {
            unsubscribeRecommendations();
            unsubscribeListings();
        };
    }, [user, profile]);

    const totalViews = myListings.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const handleTabChange = (tab: string) => {
        // Simple navigation helper since we are just appending to URL
        window.history.pushState(null, "", `?tab=${tab}`);
        // Force re-render or let Next.js handle it by using Link/Router preferably, 
        // but since we are inside a client component monitoring searchParams, this works too if router.push is used.
    };

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">{t('merchant.dashboardTitle')}</h1>
                    <p className="text-zinc-500">{t('merchant.welcomeSubtitle')}, {profile?.name}</p>
                </div>
                {activeTab !== "post" && (
                    <Link href="/dashboard/merchant?tab=post">
                        <Button variant="primary">
                            <PlusCircle className="mr-2" size={18} />
                            Post New Product
                        </Button>
                    </Link>
                )}
                {activeTab === "post" && (
                    <Link href="/dashboard/merchant">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2" size={18} />
                            Back to Dashboard
                        </Button>
                    </Link>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Stats Section */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-primary-100 bg-white/50 p-6 shadow-sm dark:border-primary-800/50 dark:bg-primary-900/30">
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Listings</p>
                                <p className="text-3xl font-bold text-primary-900 dark:text-white">{myListings.length}</p>
                            </div>
                            <div className="rounded-2xl border border-primary-100 bg-white/50 p-6 shadow-sm dark:border-primary-800/50 dark:bg-primary-900/30">
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Views</p>
                                <p className="text-3xl font-bold text-primary-900 dark:text-white">{totalViews}</p>
                            </div>
                            <div className="rounded-2xl border border-primary-100 bg-white/50 p-6 shadow-sm dark:border-primary-800/50 dark:bg-primary-900/30">
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Saved Items</p>
                                <p className="text-3xl font-bold text-primary-900 dark:text-white">--</p>
                            </div>
                        </div>

                        {/* Quick Stats/Shortcuts */}
                        <div className="mb-12 grid gap-6 sm:grid-cols-3">
                            <Link href="/marketplace">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border bg-primary-600 p-8 text-white shadow-lg"
                                >
                                    <Search size={32} className="mb-4 opacity-80" />
                                    <h3 className="text-xl font-bold">{t('merchant.browseMarket')}</h3>
                                    <p className="text-sm opacity-70">{t('merchant.findNewProducts')}</p>
                                </motion.div>
                            </Link>

                            <Link href="/messages">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-primary-100 bg-white/50 p-8 shadow-md backdrop-blur-sm dark:border-primary-800/50 dark:bg-primary-900/30"
                                >
                                    <ShoppingBag size={32} className="mb-4 text-accent-500" />
                                    <h3 className="text-xl font-bold">{t('merchant.myOrders')}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-primary-200/70">{t('merchant.trackDeals')}</p>
                                </motion.div>
                            </Link>

                            <Link href="/dashboard/merchant?tab=saved">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-primary-100 bg-white/50 p-8 shadow-md backdrop-blur-sm dark:border-primary-800/50 dark:bg-primary-900/30 h-full"
                                >
                                    <Heart size={32} className="mb-4 text-red-500" />
                                    <h3 className="text-xl font-bold">{t('merchant.savedItems')}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-primary-200/70">{t('merchant.watchlist')}</p>
                                </motion.div>
                            </Link>
                        </div>

                        {/* Recommendations Section */}
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary-900 dark:text-white">{t('merchant.recommended')}</h2>
                                    {profile?.region && (
                                        <p className="flex items-center gap-1 text-sm text-zinc-500">
                                            <MapPin size={14} className="text-primary-600" />
                                            {t('merchant.prioritizing')} {profile.region}
                                        </p>
                                    )}
                                </div>
                                <Link href="/marketplace">
                                    <Button variant="ghost">{t('merchant.viewAll')} <ArrowRight className="ml-2" size={16} /></Button>
                                </Link>
                            </div>

                            {loading ? (
                                <div className="grid gap-6 sm:grid-cols-3">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="h-96 animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-800" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {recommendations.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === "post" && (
                    <motion.div
                        key="post"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <PostListingForm onSuccess={() => window.location.href = "/dashboard/merchant"} />
                    </motion.div>
                )}

                {activeTab === "orders" && (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <ShoppingBag className="mb-4 h-16 w-16 text-zinc-300" />
                        <h2 className="text-2xl font-bold">{t('merchant.myOrders')}</h2>
                        <p className="text-zinc-500">{t('settings.comingSoon')}</p>
                        <Link href="/dashboard/merchant" className="mt-6">
                            <Button variant="outline">Back to Overview</Button>
                        </Link>
                    </motion.div>
                )}

                {activeTab === "saved" && (
                    <motion.div
                        key="saved"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <Heart className="mb-4 h-16 w-16 text-zinc-300" />
                        <h2 className="text-2xl font-bold">{t('merchant.savedItems')}</h2>
                        <p className="text-zinc-500">{t('settings.comingSoon')}</p>
                        <Link href="/dashboard/merchant" className="mt-6">
                            <Button variant="outline">Back to Overview</Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
