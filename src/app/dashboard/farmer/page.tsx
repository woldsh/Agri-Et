"use client";

import { useAuth } from "@/hooks/useAuth";
import { Listing } from "@/types";
import { db } from "@/lib/firebase/config";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PlusCircle, Package, TrendingUp, MessageSquare, Trash2, Edit, Eye, Sprout, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { PostListingForm } from "@/components/dashboard/PostListingForm";

export default function FarmerDashboard() {
    const { user, profile } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !db) return;

        const q = query(
            collection(db, "listings"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];
            setListings(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (confirm(t('farmer.deleteConfirm'))) {
            await deleteDoc(doc(db, "listings", id));
        }
    };

    const handleTabChange = (tab: string) => {
        router.push(`/dashboard/farmer?tab=${tab}`);
    };

    const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">{t('farmer.dashboardTitle')}</h1>
                    <p className="text-zinc-500">{t('farmer.welcome')}, {profile?.name}</p>
                </div>
                {activeTab !== "post" && (
                    <Button variant="primary" onClick={() => handleTabChange("post")}>
                        <PlusCircle className="mr-2" size={18} />
                        {t('farmer.postProduct')}
                    </Button>
                )}
                {activeTab === "post" && (
                    <Button variant="outline" onClick={() => handleTabChange("overview")}>
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Dashboard
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {(activeTab === "overview" || activeTab === "products") && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {/* Stats Cards */}
                        <div className="mb-12 grid gap-6 sm:grid-cols-3">
                            {[
                                { label: t('farmer.totalListings'), value: listings.length, icon: Package, color: "bg-blue-500" },
                                { label: t('farmer.activeConversations'), value: t('farmer.checkMessages'), icon: MessageSquare, color: "bg-green-500" },
                                { label: t('farmer.totalViews'), value: totalViews, icon: Eye, color: "bg-purple-500" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-900"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                                    </div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-zinc-500">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Listings Management */}
                        <div className="rounded-3xl border bg-white p-6 shadow-lg dark:bg-zinc-900">
                            <h2 className="mb-6 text-xl font-bold">{t('farmer.yourProducts')}</h2>

                            {loading ? (
                                <div className="py-20 text-center text-zinc-500">{t('farmer.loadingStock')}</div>
                            ) : listings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Sprout className="mb-4 h-16 w-16 text-zinc-300" />
                                    <p className="mb-2 text-lg font-bold">{t('farmer.noProducts')}</p>
                                    <p className="mb-6 text-sm text-zinc-500">{t('farmer.startSelling')}</p>
                                    <Button variant="outline" onClick={() => handleTabChange("post")}>Post First Listing</Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b text-sm text-zinc-500">
                                                <th className="pb-4 font-medium">Product</th>
                                                <th className="pb-4 font-medium">Category</th>
                                                <th className="pb-4 font-medium">Price</th>
                                                <th className="pb-4 font-medium">Status</th>
                                                <th className="pb-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {listings.map((item) => (
                                                <tr key={item.id} className="group">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                                                                <Image
                                                                    src={getOptimizedImage(item.mediaUrls[0], 100)}
                                                                    fill
                                                                    alt={item.title}
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <span className="font-medium">{item.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-sm capitalize">{item.category}</td>
                                                    <td className="py-4 font-medium">ETB {item.price.toLocaleString()}</td>
                                                    <td className="py-4">
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Active</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2">
                                                            <Link href={`/listing/${item.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye size={16} />
                                                                </Button>
                                                            </Link>
                                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                        <PostListingForm onSuccess={() => handleTabChange("overview")} />
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
                        <h2 className="text-2xl font-bold">My Orders</h2>
                        <p className="text-zinc-500">{t('settings.comingSoon')}</p>
                        <Button variant="outline" onClick={() => handleTabChange("overview")} className="mt-6">
                            Back to Dashboard
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


