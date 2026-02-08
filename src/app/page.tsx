"use client";

import { Button } from "@/components/ui/Button";
import { AgriLogo } from "@/components/ui/AgriLogo";
import { ListingCard } from "@/components/marketplace/ListingCard";
import Link from "next/link";
import {
  Sprout,
  Users,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Search,
  Package,
  CheckCircle2,
  Star,
  Leaf,
  Globe,
  MessageCircle
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Listing } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

export default function Home() {
  const { t } = useLanguage();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"), limit(3));
        const snapshot = await getDocs(q);
        const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Listing[];
        setFeaturedListings(listings);
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      }
    };
    fetchFeaturedListings();
  }, []);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = t('hero.title_phrases') as unknown as string[];

  useEffect(() => {
    if (!phrases || !phrases.length) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phrases?.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-[95vh] items-center justify-center overflow-hidden bg-primary-950 px-4 text-white">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>

        {/* Isometric Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />

        <div className="container relative z-10 mx-auto max-w-7xl">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-6 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            >
              <Sprout size={18} className="text-accent-400" />
              <span className="text-sm font-bold tracking-wide text-accent-300 uppercase">The Future of Agri-Trade</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8 flex flex-col items-center text-7xl font-black leading-tight tracking-tighter md:text-9xl"
            >
              <span className="relative block mb-10">
                <span className="absolute -inset-1 blur-2xl bg-primary-500/20 rounded-full" />
                <span className="relative bg-gradient-to-b from-white via-white to-primary-200 bg-clip-text text-transparent drop-shadow-2xl flex items-baseline">
                  {t('hero.title_prefix') === "Agri-ET" ? (
                    <AgriLogo className="w-[1.6em] md:w-[2.2em] h-auto" />
                  ) : (
                    t('hero.title_prefix')
                  )}
                </span>
              </span>
              <div className="relative h-[1.2em] w-full overflow-hidden text-center flex items-center justify-center mt-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute block w-full bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent drop-shadow-xl text-2xl md:text-5xl font-extrabold tracking-tight"
                  >
                    {phrases?.[phraseIndex] || ""}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto mb-12 max-w-2xl text-lg font-medium text-primary-200/80 md:text-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row w-full sm:w-auto"
            >
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-xl shadow-accent-500/20 hover:shadow-accent-500/40" glow>
                  <Search className="mr-2" size={20} />
                  {t('hero.cta_buy')}
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  <Package className="mr-2" size={20} />
                  {t('hero.cta_sell')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Glass Stats */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, type: "spring" }}
            className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8"
          >
            {[
              { label: t('hero.stat_farmers'), value: "10k+", icon: Sprout, color: "text-green-400" },
              { label: t('hero.stat_products'), value: "50k+", icon: Package, color: "text-yellow-400" },
              { label: t('hero.stat_deals'), value: "25k+", icon: TrendingUp, color: "text-blue-400" },
              { label: t('hero.stat_regions'), value: "14", icon: MapPin, color: "text-red-400" },
            ].map((stat, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/20">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 shadow-inner">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="h-12 w-8 rounded-full border-2 border-current flex justify-center pt-2">
            <div className="h-2 w-1.5 rounded-full bg-current" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-primary-950 dark:text-white md:text-5xl mb-6">
              {t('features.title')}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-zinc-600 dark:text-zinc-400">
              {t('features.subtitle_desc')}
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: t('features.f1_title'),
                desc: t('features.f1_desc'),
                icon: CheckCircle2,
                gradient: "from-green-500 to-emerald-600",
              },
              {
                title: t('features.f2_title'),
                desc: t('features.f2_desc'),
                icon: Globe,
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                title: t('features.f3_title'),
                desc: t('features.f3_desc'),
                icon: ShieldCheck,
                gradient: "from-purple-500 to-violet-600",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-10 shadow-lg shadow-zinc-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/5 dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800"
              >
                <div className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-primary-900 dark:text-white group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary-900 text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-800/50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black md:text-5xl tracking-tight">
              {t('howItWorks.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-primary-200">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-4 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30"></div>

            {[
              { step: "01", title: t('howItWorks.step1_title'), description: t('howItWorks.step1_desc'), icon: Users },
              { step: "02", title: t('howItWorks.step2_title'), description: t('howItWorks.step2_desc'), icon: Search },
              { step: "03", title: t('howItWorks.step3_title'), description: t('howItWorks.step3_desc'), icon: MessageCircle },
              { step: "04", title: t('howItWorks.step4_title'), description: t('howItWorks.step4_desc'), icon: CheckCircle2 },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="group relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary-800 bg-primary-950 shadow-2xl transition-transform duration-300 hover:scale-110">
                  <div className="absolute inset-0 rounded-full bg-primary-800/20 blur-xl group-hover:bg-accent-500/20 transition-colors"></div>
                  <step.icon size={40} className="text-accent-400 group-hover:text-accent-300 transition-colors" />
                  <div className="absolute -top-2 -right-2 h-10 w-10 flex items-center justify-center rounded-full bg-accent-500 text-primary-950 font-black text-sm border-2 border-primary-950">
                    {step.step}
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-primary-200/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {
        featuredListings.length > 0 && (
          <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4">
              <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="mb-2 text-4xl font-black text-primary-950 dark:text-white">{t('featuredListings.title')}</h2>
                  <p className="text-xl text-zinc-500">{t('featuredListings.subtitle')}</p>
                </div>
                <Link href="/marketplace">
                  <Button variant="outline" className="group border-zinc-200 dark:border-zinc-800 hover:border-primary-500">
                    {t('featuredListings.viewAll')}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredListings.map((listing) => (
                  <div key={listing.id} className="h-full">
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary-600">Trust & Excellence</span>
            <h2 className="text-4xl font-black text-primary-950 dark:text-white md:text-5xl">
              {t('testimonials.title')}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: t('testimonials.t1_name'),
                role: t('testimonials.t1_role'),
                quote: t('testimonials.t1_quote'),
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200"
              },
              {
                name: t('testimonials.t2_name'),
                role: t('testimonials.t2_role'),
                quote: t('testimonials.t2_quote'),
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=200&h=200"
              },
              {
                name: t('testimonials.t3_name'),
                role: t('testimonials.t3_role'),
                quote: t('testimonials.t3_quote'),
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=200&h=200"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col rounded-[2rem] bg-zinc-50 p-8 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
              >
                <div className="mb-6 flex gap-1 text-accent-500">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mb-8 flex-1 italic leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 mt-auto border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  {/* Avatar with fallback */}
                  <div className="h-12 w-12 rounded-full bg-zinc-200 overflow-hidden relative">
                    {/* Ideally use Next Image here, simplified for now */}
                    <div className="absolute inset-0 bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-950 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-primary-900 text-center text-white shadow-2xl shadow-primary-900/40"
          >
            {/* Background Art */}
            <div className="absolute inset-0 z-0">
              <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-primary-800/80 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-accent-600/40 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 px-8 py-20 md:p-32">
              <Leaf className="mx-auto mb-8 text-accent-400" size={48} />
              <h2 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
                {t('finalCTA.title')}
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-primary-100/90 font-medium">
                {t('finalCTA.subtitle')}
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto min-w-[200px]" glow>
                    <CheckCircle2 className="mr-2" size={20} />
                    {t('finalCTA.btnGetStarted')}
                  </Button>
                </Link>
                <Link href="/marketplace" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full border-primary-400 text-primary-100 hover:bg-white/10 hover:text-white hover:border-white sm:w-auto min-w-[200px]">
                    {t('finalCTA.btnBrowse')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div >
  );
}
