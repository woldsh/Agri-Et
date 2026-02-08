"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, Trash2, Search, ShoppingBag, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Listing } from "@/types";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import Link from "next/link";

export default function AdminListingsPage() {
    const { user, profile } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchListings() {
            try {
                // In a real app with many listings, you'd want pagination
                const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                setListings(items);
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchListings();
        }
    }, [user]);

    const handleDeleteListing = async (listingId: string) => {
        if (!confirm("Are you sure you want to delete this listing? It will be permanently removed.")) return;

        try {
            await deleteDoc(doc(db, "listings", listingId));
            setListings(prev => prev.filter(l => l.id !== listingId));
            alert("Listing deleted successfully.");
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
        }
    };

    const filteredListings = listings.filter(l =>
        l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.location?.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (profile?.role !== "admin") {
        return <div className="p-10 text-center">Access Denied</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">All Listings</h1>
                    <p className="text-zinc-500">Manage all marketplace listings.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-xl border border-zinc-200 pl-10 pr-4 py-2 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Product</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Price & Stock</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Location</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredListings.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                                                <Image
                                                    src={getOptimizedImage(item.mediaUrls?.[0], 100)}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white line-clamp-1">{item.title}</p>
                                                <p className="text-xs text-zinc-500 line-clamp-1">{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-bold text-primary-600">ETB {item.price}</p>
                                            <p className="text-zinc-500">{item.quantity} {item.unit}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-zinc-500">
                                            <MapPin size={14} />
                                            <span className="truncate max-w-[150px]">{item.location.region}, {item.location.woreda}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/listing/${item.id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-zinc-100 text-zinc-600">
                                                    <Eye size={16} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteListing(item.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredListings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                                        No listings found.
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
