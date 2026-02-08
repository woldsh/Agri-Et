"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Scale, CheckCircle, AlertTriangle, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
    const { t } = useLanguage();

    const sections = [
        { icon: Users, title: t('legal.t3_title'), desc: t('legal.t3_desc') },
        { icon: CheckCircle, title: t('legal.t1_title'), desc: t('legal.t1_desc') },
        { icon: AlertTriangle, title: t('legal.t2_title'), desc: t('legal.t2_desc') },
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
                        <Scale size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">
                        {t('legal.termsTitle')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                        {t('legal.termsSubtitle')}
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

                <div className="mt-16 text-center text-zinc-500 text-sm">
                    <p>By continuing to use Agri-ET, you acknowledge that you have read and understood these terms.</p>
                </div>
            </div>
        </div>
    );
}
