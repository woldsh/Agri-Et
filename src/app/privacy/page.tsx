"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Shield, Lock, Eye, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    const { t } = useLanguage();

    const sections = [
        { icon: Eye, title: t('legal.p1_title'), desc: t('legal.p1_desc') },
        { icon: Lock, title: t('legal.p2_title'), desc: t('legal.p2_desc') },
        { icon: MapPin, title: t('legal.p3_title'), desc: t('legal.p3_desc') },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-6">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">
                        {t('legal.privacyTitle')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                        {t('legal.privacySubtitle')}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-zinc-400">
                        <Clock size={14} />
                        <span>{t('legal.lastUpdated')}: January 2026</span>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                            <div className="flex items-start gap-6">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-primary-600 dark:text-primary-400">
                                    <section.icon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                        {section.title}
                                    </h2>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {section.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 p-8 rounded-3xl bg-primary-600 text-white text-center shadow-xl shadow-primary-900/20"
                >
                    <h2 className="text-2xl font-bold mb-4">Questions about your privacy?</h2>
                    <p className="opacity-90 mb-6">Our team is here to help you understand how your data is used.</p>
                    <button className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors">
                        Contact Support
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
