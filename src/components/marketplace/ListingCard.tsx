"use client";

import Image from "next/image";
import { MapPin, Heart, Share2, Eye } from "lucide-react";
import { Button } from "../ui/Button";
import { Listing } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import { useListings } from "@/hooks/useListings";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    const { toggleLike, loading: liking } = useListings();
    const [isLiked, setIsLiked] = useState(false); // In real app, sync this with user's liked status
    const [likes, setLikes] = useState(listing.likesCount);
    const { t } = useLanguage();

    const isNew = listing.createdAt ? (
        (new Date().getTime() - (listing.createdAt.seconds * 1000)) < 24 * 60 * 60 * 1000
    ) : false;

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
        await toggleLike(listing.id, isLiked);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <Image
                    src={getOptimizedImage(listing.mediaUrls[0] || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9", 600)}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {isNew && (
                        <span className="rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md animate-pulse">
                            {t('marketplace.new')}
                        </span>
                    )}
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-900 shadow-sm backdrop-blur-md">
                        {listing.category}
                    </span>
                    {listing.negotiable && (
                        <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                            Negotiable
                        </span>
                    )}
                </div>

                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={liking}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group/like"
                >
                    <Heart
                        size={18}
                        className={`transition-colors duration-300 ${isLiked ? "fill-red-500 text-red-500" : "text-white group-hover/like:text-red-500"}`}
                    />
                </button>

                {/* Quick Actions (Desktop) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
                    <Link href={`/listing/${listing.id}`}>
                        <Button variant="glass" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            <Eye size={18} className="mr-2" />
                            View Details
                        </Button>
                    </Link>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-white font-bold text-xl drop-shadow-md">
                        <span className="text-sm font-normal text-white/80 mr-1">ETB</span>
                        {listing.price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 relative">
                {/* Top Border Gradient */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700 opacity-50" />

                <div className="mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
                        <MapPin size={12} />
                        <span className="truncate max-w-[200px]">
                            {listing.location.city || listing.location.region}
                        </span>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold leading-tight text-zinc-900 dark:text-white group-hover:text-primary-700 transition-colors">
                        {listing.title}
                    </h3>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="group-hover:opacity-0 transition-opacity duration-300 absolute bottom-6">
                        <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Price</span>
                        <span className="text-lg font-black text-zinc-900 dark:text-white">
                            <span className="text-xs font-normal text-zinc-400 mr-1">ETB</span>
                            {listing.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="w-full flex justify-end">
                        <Button
                            variant="primary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 bg-primary-900 text-white shadow-none"
                        >
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
