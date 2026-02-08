"use client";

import { ListingCard } from "@/components/marketplace/ListingCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { Listing } from "@/types";
import { SlidersHorizontal, X, Loader2, MapPin, Search, ChevronDown, Filter, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { sortByProximity } from "@/lib/locationUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ETHIOPIAN_REGIONS } from "@/lib/constants";
import { Sprout as Sl_Sprout } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
    const { t } = useLanguage();
    const { profile } = useAuth();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [region, setRegion] = useState("");
    const [zone, setZone] = useState("");
    const [woreda, setWoreda] = useState("");
    const [city, setCity] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        // Real-time listener for listings from Firestore
        const q = query(
            collection(db, "listings"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const listingsData: Listing[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];

            let userRegion = profile?.region;
            let userWoreda = profile?.woreda;

            // If no profile location, try auto-detection
            if (!userRegion) {
                try {
                    const detected = await import("@/lib/locationUtils").then(m => m.detectUserLocation());
                    if (detected) {
                        userRegion = detected.region;
                        userWoreda = detected.woreda;
                        // Optional: Could visually indicate "Using detected location: X"
                    }
                } catch (e) {
                    console.error("Auto-detect failed", e);
                }
            }

            // Sort by proximity if we have a location (Profile or Auto-detected)
            const sortedListings = userRegion
                ? sortByProximity(listingsData, userRegion, userWoreda)
                : listingsData;

            setListings(sortedListings);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [profile]);

    // Derived location lists for filters
    const availableZones = useMemo(() => {
        const zones = new Set<string>();
        listings.forEach(l => {
            if (l.location.zone && (!region || l.location.region === region)) {
                zones.add(l.location.zone);
            }
        });
        return Array.from(zones).sort();
    }, [listings, region]);

    const availableWoredas = useMemo(() => {
        const woredas = new Set<string>();
        listings.forEach(l => {
            if (l.location.woreda &&
                (!region || l.location.region === region) &&
                (!zone || l.location.zone === zone)) {
                woredas.add(l.location.woreda);
            }
        });
        return Array.from(woredas).sort();
    }, [listings, region, zone]);

    const availableCities = useMemo(() => {
        const cities = new Set<string>();
        listings.forEach(l => {
            if (l.location.city &&
                (!region || l.location.region === region) &&
                (!zone || l.location.zone === zone) &&
                (!woreda || l.location.woreda === woreda)) {
                cities.add(l.location.city);
            }
        });
        return Array.from(cities).sort();
    }, [listings, region, zone, woreda]);

    // Filtering Logic
    const filteredListings = useMemo(() => {
        return listings.filter((item) => {
            const matchesSearch = search === "" ||
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = category === "all" || item.category === category;
            const matchesRegion = region === "" || item.location.region === region;
            const matchesZone = zone === "" || item.location.zone?.toLowerCase().includes(zone.toLowerCase());
            const matchesWoreda = woreda === "" || item.location.woreda?.toLowerCase().includes(woreda.toLowerCase());
            const matchesCity = city === "" || item.location.city?.toLowerCase().includes(city.toLowerCase());

            const matchesMinPrice = minPrice === "" || item.price >= parseFloat(minPrice);
            const matchesMaxPrice = maxPrice === "" || item.price <= parseFloat(maxPrice);

            return matchesSearch && matchesCategory && matchesRegion && matchesZone && matchesWoreda && matchesCity && matchesMinPrice && matchesMaxPrice;
        });
    }, [listings, search, category, region, zone, woreda, city, minPrice, maxPrice]);

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setRegion("");
        setZone("");
        setWoreda("");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
    };

    const activeFilterCount = [
        category !== "all",
        region !== "",
        zone !== "",
        woreda !== "",
        city !== "",
        minPrice !== "",
        maxPrice !== ""
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
            <div className="container mx-auto px-4">
                {/* Unified Search Section */}
                <div className="mb-12">
                    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h1 className="text-4xl font-black tracking-tight text-primary-950 dark:text-white md:text-5xl">
                                {t('nav.marketplace')}
                            </h1>
                            <p className="text-lg text-zinc-500 font-medium">{t('merchant.welcomeSubtitle')}</p>
                        </div>

                        {/* Premium Search Bar */}
                        <div className="relative mt-2 flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl shadow-primary-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 md:flex-row md:items-center p-2">
                            <div className="flex flex-1 items-center px-4 py-3 md:py-2">
                                <Search className="mr-3 text-primary-500" size={24} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('common.search') + "..."}
                                    className="h-12 w-full bg-transparent text-lg font-medium placeholder:text-zinc-400 focus:outline-none dark:text-white"
                                />
                            </div>

                            <div className="hidden h-10 w-px bg-zinc-200 dark:bg-zinc-800 md:block" />

                            <div className="relative flex items-center px-4 py-3 md:py-2 md:min-w-[200px]">
                                <MapPin className="mr-2 text-accent-500" size={20} />
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full appearance-none bg-transparent pr-8 text-base font-bold text-primary-900 focus:outline-none dark:text-white cursor-pointer"
                                >
                                    <option value="">{t('marketplace.allRegions')}</option>
                                    {ETHIOPIAN_REGIONS.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                            </div>

                            <Button
                                className="m-2 h-14 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 text-base font-bold text-white shadow-lg w-full md:w-auto hover:shadow-primary-500/25 transition-all active:scale-95"
                            >
                                {t('common.search')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-8">
                            <div className="rounded-[2rem] border border-white bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-black text-primary-950 dark:text-white">{t('marketplace.filters')}</h3>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-bold uppercase tracking-wider text-accent-600 hover:text-accent-700 hover:underline"
                                        >
                                            {t('marketplace.reset')}
                                        </button>
                                    )}
                                </div>
                                <MarketplaceFilters
                                    search={search}
                                    setSearch={setSearch}
                                    category={category}
                                    setCategory={setCategory}
                                    region={region}
                                    setRegion={setRegion}
                                    zone={zone}
                                    setZone={setZone}
                                    woreda={woreda}
                                    setWoreda={setWoreda}
                                    city={city}
                                    setCity={setCity}
                                    availableZones={availableZones}
                                    availableWoredas={availableWoredas}
                                    availableCities={availableCities}
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    onClear={clearFilters}
                                />
                            </div>

                            {/* Promo Banner */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8 text-white shadow-2xl shadow-primary-900/20">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Sparkles size={100} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="mb-2 text-2xl font-black leading-tight bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">
                                        {t('marketplace.promoTitle')}
                                    </h3>
                                    <p className="mb-6 text-primary-200 text-sm leading-relaxed">{t('marketplace.promoSubtitle')}</p>
                                    <Link href="/post-listing" className="block">
                                        <Button variant="glass" className="w-full justify-center group">
                                            {t('marketplace.promoButton')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filters Trigger */}
                    <div className="flex gap-3 lg:hidden mb-6">
                        <Button
                            variant="primary"
                            className="flex-1 shadow-md h-12 rounded-xl"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter className="mr-2" size={18} />
                            {t('marketplace.filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </Button>
                    </div>

                    {/* Mobile Filters Modal */}
                    <AnimatePresence>
                        {showMobileFilters && (
                            <motion.div
                                initial={{ opacity: 0, x: "100%" }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: "100%" }}
                                className="fixed inset-0 z-[60] flex flex-col bg-white p-6 dark:bg-zinc-950 lg:hidden"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold">{t('marketplace.refine')}</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                                        <X size={24} />
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-y-auto pr-2">
                                    <MarketplaceFilters
                                        search={search}
                                        setSearch={setSearch}
                                        category={category}
                                        setCategory={setCategory}
                                        region={region}
                                        setRegion={setRegion}
                                        zone={zone}
                                        setZone={setZone}
                                        woreda={woreda}
                                        setWoreda={setWoreda}
                                        city={city}
                                        setCity={setCity}
                                        availableZones={availableZones}
                                        availableWoredas={availableWoredas}
                                        availableCities={availableCities}
                                        minPrice={minPrice}
                                        setMinPrice={setMinPrice}
                                        maxPrice={maxPrice}
                                        setMaxPrice={setMaxPrice}
                                        onClear={clearFilters}
                                    />
                                </div>
                                <div className="mt-8 border-t pt-4">
                                    <Button className="w-full py-6" onClick={() => setShowMobileFilters(false)}>
                                        {t('marketplace.showResults')} ({filteredListings.length})
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Listings Grid */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex h-64 items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                    <p className="text-sm font-medium text-zinc-500">{t('common.loading')}</p>
                                </div>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2rem] border border-dashed border-zinc-200 bg-white p-10">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 text-primary-200">
                                    <Sl_Sprout size={48} />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">{t('marketplace.noResults')}</h3>
                                <p className="mb-8 max-w-md text-zinc-500">{t('marketplace.noResultsDesc')}</p>
                                <Button variant="outline" onClick={clearFilters}>{t('marketplace.clearAll')}</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {filteredListings.map((listing) => (
                                    <div key={listing.id} className="h-full">
                                        <ListingCard listing={listing} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
