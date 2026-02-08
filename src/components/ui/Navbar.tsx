"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getOptimizedImage } from "@/lib/cloudinary/upload";
import { Button } from "./Button";
import { Search, Menu, ShoppingCart, User, Sprout, LogOut, PlusCircle, Bell, X, ChevronDown, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { AgriLogo } from "./AgriLogo";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
    const { user, profile, signOut } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isLightTheme = theme === "light";
    const showSolidNav = scrolled || isLightTheme;

    // Smooth scroll detection
    const { scrollY } = useScroll();
    const navBackground = useTransform(
        scrollY,
        [0, 50],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
    );
    const navBackdropFilter = useTransform(
        scrollY,
        [0, 50],
        ["blur(0px)", "blur(12px)"]
    );

    const LanguageSwitcher = () => {
        const [isOpen, setIsOpen] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const languages = [
            { code: 'en', label: 'English', flag: '🇺🇸' },
            { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
            { code: 'om', label: 'Oromiffa', flag: '🇪🇹' },
            { code: 'ti', label: 'ትግርኛ', flag: '🇪🇹' }
        ] as const;

        return (
            <div className="relative mr-2" ref={ref}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 group ${showSolidNav
                        ? "border-zinc-200 bg-white/50 backdrop-blur-md hover:bg-white hover:border-primary-200"
                        : "border-primary-100/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50"
                        }`}
                >
                    <Globe size={16} className={`group-hover:rotate-12 transition-transform duration-500 ${showSolidNav ? "text-primary-600" : "text-white"}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${showSolidNav ? "text-primary-800" : "text-white"}`}>{language}</span>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl z-50 ring-1 ring-black/5"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors flex items-center gap-3 ${language === lang.code ? 'bg-primary-50/50 text-primary-700 font-bold' : 'text-zinc-600 dark:text-zinc-300'}`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { href: "/", label: t('nav.home') },
        { href: "/marketplace", label: t('nav.marketplace') },
        { href: "/about", label: t('nav.about') },
    ];

    const dashboardLink = profile?.role === "farmer" ? "/dashboard/farmer" : "/dashboard/merchant";

    // Nav Item Motion
    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut" as const
            }
        })
    };

    return (
        <>
            <motion.nav
                style={{
                    backgroundColor: showSolidNav
                        ? isLightTheme
                            ? "rgba(255, 255, 255, 0.85)"
                            : "rgba(5, 20, 14, 0.85)"
                        : "transparent",
                    backdropFilter: showSolidNav ? "blur(12px)" : "blur(0px)",
                    borderColor: showSolidNav
                        ? isLightTheme
                            ? "rgba(0,0,0,0.06)"
                            : "rgba(255,255,255,0.08)"
                        : "transparent"
                }}
                className={`fixed top-0 z-50 w-full transition-colors duration-500 border-b`}
            >
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10 scale-90 md:scale-100 origin-left">
                        <AgriLogo className="w-32 md:w-36 h-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={`hidden items-center gap-1 md:flex rounded-full px-2 py-1 backdrop-blur-sm border ${showSolidNav ? "bg-white/60 border-zinc-200/70" : "bg-white/5 border-white/10"}`}>
                        {navLinks.map((link, i) => (
                            <Link key={link.href} href={link.href} className="relative group">
                                <motion.div
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={navItemVariants}
                                    className={`relative px-5 py-2.5 rounded-full transition-all duration-300 ${pathname === link.href
                                        ? showSolidNav ? "bg-primary-50 text-primary-700" : "bg-white/20 text-white"
                                        : showSolidNav ? "text-zinc-600 hover:text-primary-600 hover:bg-zinc-50" : "text-primary-100 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    <span className="text-sm font-medium tracking-wide">{link.label}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4 relative z-10">
                        {user ? (
                            <>
                                <button
                                    onClick={toggleTheme}
                                    className={`mr-2 flex items-center justify-center rounded-full p-2 transition-all duration-300 ${showSolidNav
                                        ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                </button>

                                <LanguageSwitcher />

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className={`flex items-center gap-2 rounded-full border p-1 pl-3 pr-2 shadow-sm transition-all ${showSolidNav
                                            ? "bg-white border-zinc-100 hover:border-primary-200"
                                            : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                                            }`}
                                    >
                                        <div className="flex flex-col items-end mr-1">
                                            <span className={`text-xs font-bold leading-none mb-0.5 ${showSolidNav ? "text-zinc-900" : "text-white"}`}>{profile?.name?.split(' ')[0]}</span>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider leading-none ${showSolidNav ? "text-primary-600" : "text-primary-200"}`}>{profile?.role}</span>
                                        </div>
                                        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/20">
                                            {profile?.photoURL ? (
                                                <Image
                                                    src={getOptimizedImage(profile.photoURL, 100)}
                                                    alt={profile.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {profile?.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""} ${showSolidNav ? "text-zinc-400" : "text-primary-200"}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                                                className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-3xl border border-white/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5"
                                            >
                                                <div className="relative p-6 pb-8 bg-gradient-to-br from-primary-600 to-primary-800">
                                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                                        <Sprout size={64} className="text-white transform rotate-12" />
                                                    </div>
                                                    <p className="font-black text-xl text-white relative z-10">{profile?.name}</p>
                                                    <p className="text-primary-100 text-sm font-medium relative z-10">{user.email}</p>
                                                    <div className="absolute -bottom-6 right-6 h-12 w-12 rounded-full bg-accent-500 border-4 border-white shadow-lg flex items-center justify-center text-white z-20">
                                                        <User size={20} />
                                                    </div>
                                                </div>

                                                <div className="pt-8 p-3 space-y-1">
                                                    <Link href={dashboardLink} onClick={() => setIsUserMenuOpen(false)}>
                                                        <div className="flex items-center gap-3 rounded-2xl p-3 text-sm font-bold text-zinc-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                                <LayoutDashboard size={18} />
                                                            </div>
                                                            {t('common.dashboard')}
                                                        </div>
                                                    </Link>
                                                    <Link href="/messages" onClick={() => setIsUserMenuOpen(false)}>
                                                        <div className="flex items-center gap-3 rounded-2xl p-3 text-sm font-bold text-zinc-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                                <Bell size={18} />
                                                            </div>
                                                            {t('common.messages')}
                                                        </div>
                                                    </Link>
                                                    <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}>
                                                        <div className="flex items-center gap-3 rounded-2xl p-3 text-sm font-bold text-zinc-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                                <Settings size={18} />
                                                            </div>
                                                            {t('common.settings')}
                                                        </div>
                                                    </Link>

                                                    <div className="h-px bg-zinc-100 my-2 mx-2" />

                                                    <button
                                                        onClick={() => signOut()}
                                                        className="w-full flex items-center gap-3 rounded-2xl p-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 group"
                                                    >
                                                        <div className="p-2 rounded-xl bg-red-50 text-red-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                                                            <LogOut size={18} />
                                                        </div>
                                                        {t('common.signOut')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleTheme}
                                    className={`mr-2 flex items-center justify-center rounded-full p-2 transition-all duration-300 ${showSolidNav
                                        ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                                <LanguageSwitcher />
                                <Link href="/login">
                                    <Button variant="ghost" className={`font-bold ${showSolidNav ? "!text-primary-600 hover:!bg-primary-50" : "text-white hover:bg-white/10"}`}>
                                        {t('common.signIn')}
                                    </Button>
                                </Link>
                                <Link href="/login?mode=signup">
                                    <Button variant="primary" className="shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow">
                                        <User size={18} className="mr-2" />
                                        Join Now
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`md:hidden p-2 rounded-xl transition-colors ${showSolidNav ? "text-zinc-600 hover:bg-zinc-100" : "text-white hover:bg-white/20"}`}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-900 shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 opacity-20">
                                    <Sprout size={150} />
                                </div>
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h2 className="text-xl font-black tracking-tight">Agri-ET <span className="text-primary-300">Menu</span></h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={toggleTheme}
                                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                        >
                                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                        </button>
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                                {user && (
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg font-bold">
                                            {profile?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg leading-tight">{profile?.name}</p>
                                            <p className="text-primary-200 text-sm">{profile?.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-2">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">Navigation</p>
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center justify-between gap-3 rounded-xl p-4 text-base font-bold transition-all ${pathname === link.href
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-zinc-600 hover:bg-zinc-50"
                                            }`}>
                                            {link.label}
                                            {pathname === link.href && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                        </div>
                                    </Link>
                                ))}

                                <div className="h-px bg-zinc-100 my-4" />

                                {user && (
                                    <>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">Account</p>
                                        <Link href={dashboardLink} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="flex items-center gap-3 rounded-xl p-4 text-base font-bold text-zinc-600 hover:bg-zinc-50">
                                                <LayoutDashboard size={20} className="text-zinc-400" />
                                                Dashboard
                                            </div>
                                        </Link>

                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
