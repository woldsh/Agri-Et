"use client";

import { Search, MapPin, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

import { ETHIOPIAN_REGIONS } from "@/lib/constants";

const REGIONS = ETHIOPIAN_REGIONS;

interface MarketplaceFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    region: string;
    setRegion: (val: string) => void;
    zone: string;
    setZone: (val: string) => void;
    woreda: string;
    setWoreda: (val: string) => void;
    city: string;
    setCity: (val: string) => void;
    availableZones: string[];
    availableWoredas: string[];
    availableCities: string[];
    minPrice: string;
    setMinPrice: (val: string) => void;
    maxPrice: string;
    setMaxPrice: (val: string) => void;
    onClear: () => void;
}

export function MarketplaceFilters({
    search,
    setSearch,
    category,
    setCategory,
    region,
    setRegion,
    zone,
    setZone,
    woreda,
    setWoreda,
    city,
    setCity,
    availableZones,
    availableWoredas,
    availableCities,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    onClear
}: MarketplaceFiltersProps) {
    const { t } = useLanguage();

    const CATEGORIES = [
        { id: "all", label: t('common.all') },
        { id: "cereals", label: t('marketplace.category.cereals') },
        { id: "pulses", label: t('marketplace.category.pulses') },
        { id: "oilseeds", label: t('marketplace.category.oilseeds') },
        { id: "cashCrops", label: t('marketplace.category.cashCrops') },
        { id: "fruits", label: t('marketplace.category.fruits') },
        { id: "vegetables", label: t('marketplace.category.vegetables') },
        { id: "spices", label: t('marketplace.category.spices') },
        { id: "livestockProducts", label: t('marketplace.category.livestockProducts') },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('common.search') + "..."}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                />
            </div>

            {/* Categories */}
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">{t('postListing.category')}</h3>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${category === cat.id
                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                                : "border-zinc-200 hover:border-primary-500 hover:text-primary-600 dark:border-zinc-800"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">{t('marketplace.filters')}</h3>

                {/* Region */}
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <select
                        value={region}
                        onChange={(e) => {
                            setRegion(e.target.value);
                            setZone("");
                            setWoreda("");
                            setCity("");
                        }}
                        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        <option value="">{t('marketplace.allRegions')}</option>
                        {REGIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>

                {/* Zone */}
                <div className="relative">
                    <select
                        value={zone}
                        onChange={(e) => {
                            setZone(e.target.value);
                            setWoreda("");
                            setCity("");
                        }}
                        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 px-4 text-sm focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 pr-10"
                    >
                        <option value="">{t('marketplace.filterZone')}</option>
                        {availableZones.map((z) => (
                            <option key={z} value={z}>{z}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>

                {/* Woreda */}
                <div className="relative">
                    <select
                        value={woreda}
                        onChange={(e) => {
                            setWoreda(e.target.value);
                            setCity("");
                        }}
                        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 px-4 text-sm focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 pr-10"
                    >
                        <option value="">{t('marketplace.filterWoreda')}</option>
                        {availableWoredas.map((w) => (
                            <option key={w} value={w}>{w}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>

                {/* City */}
                <div className="relative">
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 px-4 text-sm focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 pr-10"
                    >
                        <option value="">{t('marketplace.filterCity')}</option>
                        {availableCities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">{t('marketplace.priceRange')}</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder={t('marketplace.min')}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-sm focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    <span className="text-zinc-400">-</span>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder={t('marketplace.max')}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-sm focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" className="w-full" onClick={onClear}>
                    {t('marketplace.clearAll')}
                </Button>
            </div>
        </div>
    );
}
