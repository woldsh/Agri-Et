"use client";

import Link from "next/link";
import { Sprout, Facebook, Twitter, Instagram, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./Button";
import { AgriLogo } from "./AgriLogo";
import { useState } from "react";

export function Footer() {
    const { t } = useLanguage();
    const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });

    return (
        <footer className="relative w-full overflow-hidden bg-primary-950 px-4 pt-20 pb-12 text-white md:px-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            <div className="container relative z-10 mx-auto">
                <div className="grid gap-12 lg:grid-cols-4 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20">
                                <Sprout size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tight">Agri-ET</span>
                        </div>
                        <p className="text-primary-200 leading-relaxed max-w-sm">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-primary-900 transition-all duration-300">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary-400">{t('nav.marketplace')}</h3>
                            <ul className="flex flex-col gap-4 text-sm font-medium text-primary-100">
                                <li><Link href="/marketplace?category=crops" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('marketplace.category.crops')}</Link></li>
                                <li><Link href="/marketplace?category=livestock" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('marketplace.category.livestock')}</Link></li>
                                <li><Link href="/marketplace?category=vegetables" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('marketplace.category.vegetables')}</Link></li>
                                <li><Link href="/marketplace?category=poultry" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('marketplace.category.poultry')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary-400">{t('footer.company')}</h3>
                            <ul className="flex flex-col gap-4 text-sm font-medium text-primary-100">
                                <li><Link href="/about" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('nav.about')}</Link></li>
                                <li><Link href="/contact" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('footer.contact')}</Link></li>
                                <li><Link href="/privacy" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('legal.privacyTitle')}</Link></li>
                                <li><Link href="/terms" className="hover:text-white hover:pl-2 transition-all duration-300 block">{t('legal.termsTitle')}</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary-400">{t('footer.support')}</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3 text-primary-100">
                                    <Phone size={18} className="mt-1 text-primary-400" />
                                    <span>+251 912 345 678<br /><span className="text-xs text-primary-400">Mon-Fri 9am-6pm</span></span>
                                </div>
                                <div className="flex items-start gap-3 text-primary-100">
                                    <Mail size={18} className="mt-1 text-primary-400" />
                                    <span>support@agri-et.com</span>
                                </div>
                                <div className="flex items-start gap-3 text-primary-100">
                                    <MapPin size={18} className="mt-1 text-primary-400" />
                                    <span>Addis Ababa, Ethiopia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-1">
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary-400">Stay Updated</h3>
                        <p className="mb-4 text-sm text-primary-200">Get the latest market prices and news.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-colors placeholder:text-primary-600"
                            />
                            <Button variant="primary" size="md" className="w-full">
                                Subscribe <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs text-primary-400">
                        &copy; {new Date().getFullYear()} Agri-ET. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-xs text-primary-400 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-xs text-primary-400 hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="text-xs text-primary-400 hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>

                {/* Large Footer Logo with 3D Tilt */}
                <div
                    className="mt-16 sm:mt-24 w-full flex justify-center py-12 perspective-[1000px]"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        // Calculate rotation based on cursor position relative to center
                        // Max rotation 15 degrees
                        const rotateX = ((y - centerY) / centerY) * -15;
                        const rotateY = ((x - centerX) / centerX) * 15;

                        setMousePos({ x: `${x}px`, y: `${y}px` });
                        e.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
                        e.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
                    }}
                    onMouseLeave={(e) => {
                        setMousePos({ x: "50%", y: "50%" });
                        e.currentTarget.style.setProperty('--rotate-x', '0deg');
                        e.currentTarget.style.setProperty('--rotate-y', '0deg');
                    }}
                >
                    <div
                        className="relative w-[80vw] max-w-5xl transition-transform duration-100 ease-out cursor-pointer"
                        style={{
                            transform: 'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Shadow that moves opposite to tilt for depth */}
                        <div
                            className="absolute inset-0 blur-3xl opacity-30 transition-transform duration-100 ease-out"
                            style={{
                                transform: 'translateZ(-50px) translateX(calc(var(--rotate-y, 0deg) * -1.5px)) translateY(calc(var(--rotate-x, 0deg) * 1.5px))',
                                background: 'radial-gradient(circle, rgba(118,184,133,0.4) 0%, transparent 70%)'
                            }}
                        />

                        <AgriLogo className="w-full h-auto drop-shadow-2xl" />

                        {/* Spotlight Overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
                            style={{
                                background: `radial-gradient(circle 400px at ${mousePos.x} ${mousePos.y}, rgba(255,255,255,0.4), transparent)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
