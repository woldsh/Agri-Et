"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { uploadMedia } from "@/lib/cloudinary/upload";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ImagePlus, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ETHIOPIAN_REGIONS } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export function PostListingForm({ onSuccess }: { onSuccess?: () => void }) {
    const { user, profile } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("crops");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [negotiable, setNegotiable] = useState(false);
    const [region, setRegion] = useState("");
    const [zone, setZone] = useState("");
    const [woreda, setWoreda] = useState("");
    const [city, setCity] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        if (profile) {
            if (!region) setRegion(profile.region || "");
            if (!zone) setZone(profile.zone || "");
            if (!woreda) setWoreda(profile.woreda || "");
            if (!city) setCity(profile.city || "");
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert(t('postListing.alertSignIn'));
        if (files.length === 0) return alert(t('postListing.alertImage'));

        setLoading(true);
        try {
            // Upload images to Cloudinary
            const mediaUrls = await Promise.all(files.map((file: File) => uploadMedia(file)));

            // Save listing to Firestore
            if (!db) throw new Error("Firebase not initialized");
            await addDoc(collection(db as any, "listings"), {
                userId: user.uid,
                title,
                description,
                category,
                price: parseFloat(price),
                negotiable,
                quantity,
                location: { region, zone, woreda, city },
                mediaUrls,
                mediaLabels: labels,
                likesCount: 0,
                createdAt: serverTimestamp(),
            });

            alert(t('postListing.success'));
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard/farmer");
            }
        } catch (error) {
            console.error("Error posting listing", error);
            alert(t('postListing.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border bg-white p-6 shadow-xl dark:bg-zinc-900 md:p-10"
        >
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
                    <Package size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('postListing.title')}</h1>
                    <p className="text-sm text-zinc-500">{t('postListing.subtitle')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">{t('postListing.productTitle')}</label>
                        <input
                            type="text"
                            placeholder={t('postListing.placeholderTitle')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.category')}</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        >
                            <option value="cereals">Cereals</option>
                            <option value="pulses">Pulses</option>
                            <option value="oilseeds">Oilseeds</option>
                            <option value="cashCrops">Cash crops</option>
                            <option value="fruits">Fruits</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="spices">Spices</option>
                            <option value="livestockProducts">Livestock products</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.price')}</label>
                        <input
                            type="number"
                            placeholder={t('postListing.placeholderPrice')}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.quantity')}</label>
                        <input
                            type="text"
                            placeholder={t('postListing.placeholderQuantity')}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>

                    <div className="flex items-center pt-8">
                        <input
                            type="checkbox"
                            id="negotiable"
                            checked={negotiable}
                            onChange={(e) => setNegotiable(e.target.checked)}
                            className="h-5 w-5 rounded border-zinc-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="negotiable" className="ml-2 text-sm font-medium">
                            {t('postListing.negotiable')}
                        </label>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.region')}</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        >
                            <option value="">{t('postListing.selectRegion')}</option>
                            {ETHIOPIAN_REGIONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.zone')}</label>
                        <input
                            type="text"
                            placeholder={t('postListing.placeholderZone')}
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.woreda')}</label>
                        <input
                            type="text"
                            placeholder={t('postListing.placeholderWoreda')}
                            value={woreda}
                            onChange={(e) => setWoreda(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('postListing.city')}</label>
                        <input
                            type="text"
                            placeholder={t('postListing.placeholderCity')}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('postListing.description')}</label>
                    <textarea
                        placeholder={t('postListing.placeholderDesc')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-zinc-200 p-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('postListing.uploadImages')}</label>
                    <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const selectedFiles = Array.from(e.target.files || []);
                                setFiles(prev => [...prev, ...selectedFiles]);
                                setLabels(prev => [...prev, ...selectedFiles.map(() => "")]);
                            }}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        <ImagePlus className="mb-2 text-zinc-400" size={32} />
                        <p className="text-sm text-zinc-500">{t('postListing.uploadHint')}</p>
                        {files.length > 0 && <p className="mt-2 text-primary-600 font-bold">{files.length} images selected</p>}
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                            {files.map((file: File, i: number) => (
                                <div key={i} className="group relative overflow-hidden rounded-xl border bg-white p-2 dark:bg-zinc-800">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFiles(prev => prev.filter((_, idx) => idx !== i));
                                                setLabels(prev => prev.filter((_, idx) => idx !== i));
                                            }}
                                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 focus:outline-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder={t('postListing.labelPlaceholder') || "Label (e.g. Front View)"}
                                            value={labels[i] || ""}
                                            onChange={(e) => {
                                                const newLabels = [...labels];
                                                newLabels[i] = e.target.value;
                                                setLabels(newLabels);
                                            }}
                                            className="w-full rounded-md border border-zinc-200 p-1.5 text-xs focus:border-primary-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <Button type="submit" variant="primary" className="!mt-10 w-full py-6 text-lg" disabled={loading}>
                    {loading ? t('postListing.submitting') : t('postListing.submit')}
                </Button>
            </form>
        </motion.div>
    );
}
