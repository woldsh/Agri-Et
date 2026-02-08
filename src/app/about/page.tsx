"use client";

import { motion } from "framer-motion";
import { Sprout, Users, Rocket, Globe, Award, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-primary-950 px-4 text-white">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
                        alt="Ethiopian Agriculture"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
                            {t('about.heroTitle')}
                            <br />
                            <span className="text-accent-500">{t('about.heroSubtitle')}</span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-200 md:text-xl">
                            {t('about.heroDesc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl border border-primary-100 bg-primary-50 p-10 dark:border-primary-900 dark:bg-primary-900/20"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
                                <Rocket size={32} />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-primary-900 dark:text-white">{t('about.missionTitle')}</h2>
                            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {t('about.missionDesc')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl border border-accent-100 bg-accent-50 p-10 dark:border-accent-900 dark:bg-accent-900/20"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-lg">
                                <Globe size={32} />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-primary-900 dark:text-white">{t('about.visionTitle')}</h2>
                            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {t('about.visionDesc')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-zinc-50 py-20 dark:bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-primary-900 dark:text-white">{t('about.valuesTitle')}</h2>
                        <p className="text-zinc-500">{t('about.valuesSubtitle')}</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: t('about.v1_title'), icon: Sprout, desc: t('about.v1_desc') },
                            { title: t('about.v2_title'), icon: Eye, desc: t('about.v2_desc') },
                            { title: t('about.v3_title'), icon: Rocket, desc: t('about.v3_desc') },
                            { title: t('about.v4_title'), icon: Users, desc: t('about.v4_desc') },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm dark:bg-zinc-900"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                                <p className="text-zinc-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-3xl rounded-3xl bg-primary-600 p-12 text-white shadow-2xl">
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t('about.ctaTitle')}</h2>
                        <p className="mb-8 text-lg text-primary-100">
                            {t('about.ctaDesc')}
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/login">
                                <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                                    {t('about.ctaButton')}
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                    {t('about.contactButton')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { Eye } from "lucide-react";
