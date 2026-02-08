"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { User, MapPin, Phone, Moon, Sun, Monitor, Save, Loader2, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { uploadMedia } from "@/lib/cloudinary/upload";
import { ETHIOPIAN_REGIONS } from "@/lib/constants";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
    const { t } = useLanguage();
    const { user, profile, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        region: "",
        woreda: "",
        photoURL: "",
    });

    // Load initial data
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                region: profile.region || "",
                woreda: profile.woreda || "",
                photoURL: profile.photoURL || "",
            });
        }
    }, [profile]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageLoading(true);
        try {
            const url = await uploadMedia(file);
            setFormData(prev => ({ ...prev, photoURL: url }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(t('settings.error'));
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await updateUserProfile({
                name: formData.name,
                phone: formData.phone,
                region: formData.region,
                woreda: formData.woreda,
                photoURL: formData.photoURL,
            });
            alert(t('settings.success'));
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(t('settings.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <h1 className="mb-2 text-3xl font-bold text-primary-900 dark:text-white">{t('settings.title')}</h1>
            <p className="mb-8 text-zinc-500">{t('settings.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Section */}
                <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-zinc-900">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                        <User className="text-primary-600" />
                        {t('settings.personalInfo')}
                    </h2>

                    <div className="mb-8 flex flex-col items-center">
                        <div className="relative group cursor-pointer">
                            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary-100 bg-zinc-100">
                                {formData.photoURL ? (
                                    <Image
                                        src={formData.photoURL}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <User size={40} />
                                    </div>
                                )}
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-2 text-white shadow-lg transition-transform group-hover:scale-110">
                                <Camera size={14} />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 cursor-pointer opacity-0"
                                disabled={imageLoading}
                            />
                        </div>
                        <p className="mt-2 text-sm text-zinc-500">{t('settings.uploadHint')}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-500">{t('settings.fullName')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-500">{t('settings.phone')}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="+251..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-zinc-900">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                        <MapPin className="text-primary-600" />
                        {t('settings.location')}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-500">{t('settings.region')}</label>
                            <select
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                            >
                                <option value="" disabled>{t('postListing.selectRegion')}</option>
                                {ETHIOPIAN_REGIONS.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-500">{t('settings.woredaCity')}</label>
                            <input
                                type="text"
                                value={formData.woreda}
                                onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance Section (Placeholder) */}
                <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-zinc-900">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                        <Monitor className="text-primary-600" />
                        {t('settings.appearance')} ({t('settings.comingSoon')})
                    </h2>
                    <div className="flex gap-4">
                        <div className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-primary-600 bg-primary-50 p-4 text-primary-900">
                            <Sun size={24} />
                            <span className="text-sm font-bold">{t('settings.lightMode')}</span>
                        </div>
                        <div className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 p-4 text-zinc-400">
                            <Moon size={24} />
                            <span className="text-sm font-bold">{t('settings.darkMode')}</span>
                        </div>
                        <div className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 p-4 text-zinc-400">
                            <Monitor size={24} />
                            <span className="text-sm font-bold">{t('settings.systemMode')}</span>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-6">
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg shadow-xl"
                        isLoading={loading}
                        type="submit"
                    >
                        <Save className="mr-2" />
                        {t('settings.saveChanges')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
