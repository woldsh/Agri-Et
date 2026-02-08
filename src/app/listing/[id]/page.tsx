"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Listing, UserProfile } from "@/types";
import { MapPin, ArrowLeft, Heart, Share2, Tag, Package, Calendar, User as UserIcon, Loader2, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import { ChatModal } from "@/components/ui/ChatModal";
import { ImageZoom } from "@/components/ui/ImageZoom";
import { useAuth } from "@/hooks/useAuth";

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [farmer, setFarmer] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!db) return;
            const likeDoc = await getDoc(doc(db as any, "users", user.uid, "saved", params.id as string) as any);
            setIsLiked(likeDoc.exists());
        };
        checkLikeStatus();
    }, [user, params.id]);

    const handleToggleLike = async () => {
        if (!user) {
            alert("Please sign in to like this listing");
            router.push("/login"); // Optional: redirect to login
            return;
        }

        const listingId = params.id as string;
        if (!db) return;
        const likeRef = doc(db as any, "users", user.uid, "saved", listingId);

        try {
            if (isLiked) {
                await deleteDoc(likeRef as any);
                setIsLiked(false);
            } else {
                await setDoc(likeRef as any, {
                    listingId,
                    savedAt: serverTimestamp(),
                    ...listing // Optionally save snippet of listing data for easier listing in dashboard
                });
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        const fetchListing = async () => {
            if (!params.id) return;

            try {
                if (!db) return;
                // Fetch listing
                const listingDoc = await getDoc(doc(db as any, "listings", params.id as string) as any);

                if (listingDoc.exists()) {
                    const listingData = { id: listingDoc.id, ...listingDoc.data() } as Listing;
                    setListing(listingData);

                    // Increment View Count (prevent spam via sessionStorage)
                    const viewKey = `viewed_${params.id}`;
                    if (!sessionStorage.getItem(viewKey)) {
                        try {
                            const listingRef = doc(db as any, "listings", params.id as string);
                            await updateDoc(listingRef as any, {
                                views: increment(1)
                            });
                            sessionStorage.setItem(viewKey, "true");
                        } catch (err) {
                            console.error("Error incrementing view:", err);
                        }
                    }

                    // Fetch farmer profile
                    const farmerDoc = await getDoc(doc(db as any, "users", listingData.userId) as any);
                    if (farmerDoc.exists()) {
                        setFarmer(farmerDoc.data() as UserProfile);
                    }
                } else {
                    router.push("/marketplace");
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!listing) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
                <ArrowLeft size={16} />
                Back to Marketplace
            </button>

            <div className="grid gap-10 lg:grid-cols-2 xl:gap-16">
                {/* Images Section */}
                <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
                    {/* Thumbnails */}
                    {listing.mediaUrls.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 md:w-24 md:flex-col md:pb-0">
                            {listing.mediaUrls.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === i
                                        ? "border-primary-600 ring-2 ring-primary-600/30"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={getOptimizedImage(url, 200)}
                                        alt={`View ${i + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 overflow-hidden rounded-3xl border border-primary-100 bg-white/50 shadow-xl backdrop-blur-sm dark:border-primary-800/50 dark:bg-primary-900/30"
                    >
                        <div className="relative aspect-[4/3] bg-primary-50 dark:bg-primary-900/20">
                            <ImageZoom
                                src={getOptimizedImage(listing.mediaUrls[selectedImage] || listing.mediaUrls[0], 1200)}
                                alt={listing.title}
                            />

                            {/* Category Badge */}
                            <div className="absolute left-4 top-4 z-10 pointer-events-none">
                                <span className="rounded-full bg-primary-600/90 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md capitalize">
                                    {listing.category}
                                </span>
                            </div>

                            {/* Image Label Badge */}
                            {listing.mediaLabels && listing.mediaLabels[selectedImage] && (
                                <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                                    <span className="rounded-xl bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
                                        {listing.mediaLabels[selectedImage]}
                                    </span>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {listing.mediaUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage((prev) => (prev === 0 ? listing.mediaUrls.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage((prev) => (prev === listing.mediaUrls.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl border border-primary-100 bg-white/50 p-8 shadow-xl backdrop-blur-sm dark:border-primary-800/50 dark:bg-primary-900/30"
                    >
                        <h1 className="mb-4 text-4xl font-black tracking-tighter text-primary-900 dark:text-white">{listing.title}</h1>

                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-5xl font-black text-accent-600 drop-shadow-md">ETB {listing.price.toLocaleString()}</p>
                                {listing.negotiable && (
                                    <p className="mt-1 text-sm font-bold text-primary-600/80">Price is negotiable</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quantity Available</p>
                                    <p className="text-2xl font-black text-zinc-900 dark:text-white">{listing.quantity}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</p>
                                    <p className="text-xl text-zinc-900 dark:text-white">
                                        {listing.location.city && <span className="font-black">{listing.location.city}</span>}{listing.location.city && ", "}
                                        {listing.location.woreda && `${listing.location.woreda}, `}
                                        {listing.location.zone && `${listing.location.zone}, `}
                                        {listing.location.region}
                                    </p>
                                </div>
                            </div>

                            {farmer && (
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 capitalize">{farmer.role || "Seller"}</p>
                                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{farmer.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            {user && user.uid === listing.userId ? (
                                <Button
                                    variant="outline"
                                    className="flex-1 py-6 text-lg border-primary-500 text-primary-600 bg-primary-50 cursor-default hover:bg-primary-50"
                                    onClick={() => { }}
                                >
                                    Your Listing
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    className="flex-1 py-6 text-lg capitalize"
                                    onClick={() => {
                                        if (!user) {
                                            alert(`Please sign in to contact the ${farmer?.role || "seller"}`);
                                            router.push("/login");
                                            return;
                                        }
                                        setShowChat(true);
                                    }}
                                >
                                    Contact {farmer?.role || "Seller"}
                                </Button>
                            )}

                            {farmer && farmer.phone && (
                                <Button
                                    variant="outline"
                                    className="px-4 py-6 h-14 flex items-center gap-2 font-bold"
                                    onClick={() => window.open(`tel:${farmer.phone}`)}
                                >
                                    <Phone size={20} />
                                    <span>{farmer.phone}</span>
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className={`p-0 w-14 h-14 transition-colors ${isLiked ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20" : ""}`}
                                onClick={handleToggleLike}
                            >
                                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                            </Button>
                            <Button
                                variant="outline"
                                className="p-0 w-14 h-14"
                                onClick={async () => {
                                    const shareUrl = window.location.href;
                                    const shareData = {
                                        title: listing.title,
                                        text: `Check out this ${listing.category} - ${listing.title} at ETB ${listing.price.toLocaleString()}`,
                                        url: shareUrl,
                                    };

                                    try {
                                        // Try native share API (mobile devices)
                                        if (navigator.share) {
                                            await navigator.share(shareData);
                                        } else {
                                            // Fallback: Copy to clipboard
                                            await navigator.clipboard.writeText(shareUrl);
                                            alert("Link copied to clipboard!");
                                        }
                                    } catch (error) {
                                        console.error("Error sharing:", error);
                                    }
                                }}
                            >
                                <Share2 size={20} />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border bg-white p-6 shadow-lg dark:bg-zinc-900"
                    >
                        <h2 className="mb-4 text-xl font-bold">Description</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{listing.description}</p>
                    </motion.div>
                </div>
            </div>

            {/* Chat Modal */}
            {farmer && (
                <ChatModal
                    isOpen={showChat}
                    onClose={() => setShowChat(false)}
                    receiverId={listing.userId}
                    receiverName={farmer.name}
                    listingTitle={listing.title}
                />
            )}
        </div>
    );
}
