"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-white mb-6">
                        {t('footer.contact')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        {t('footer.helpText')}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                    <Phone size={24} />
                                </div>
                                <h3 className="text-xl font-bold dark:text-white">{t('footer.support')}</h3>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">+251 912 345 678</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                    <Mail size={24} />
                                </div>
                                <h3 className="text-xl font-bold dark:text-white">Email</h3>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">support@agri-et.com</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-xl font-bold dark:text-white">Location</h3>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">Addis Ababa, Ethiopia</p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full h-14 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full h-14 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Message</label>
                                <textarea
                                    rows={6}
                                    className="w-full p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                <Send size={20} />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
