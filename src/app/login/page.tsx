"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Chrome, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ETHIOPIAN_REGIONS } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
    const { t } = useLanguage();
    const { signIn, signUp, signInWithGoogle, user, profile, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"farmer" | "merchant">("merchant");
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [region, setRegion] = useState("");
    const [zone, setZone] = useState("");
    const [woreda, setWoreda] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Redirect when user and profile are ready
    useEffect(() => {
        if (user && profile && !authLoading) {
            if (profile.role === "farmer") {
                router.push("/dashboard/farmer");
            } else if (profile.role === "merchant") {
                router.push("/dashboard/merchant");
            } else {
                router.push("/marketplace");
            }
        }
    }, [user, profile, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "signup") {
                await signUp(email, password, name, phone, role, region, zone, woreda, city);
            } else {
                await signIn(email, password);
            }
            // Redirect is handled by useEffect
        } catch (error: any) {
            console.error("Auth error", error);
            alert(t('auth.errorAuth'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            console.error("Google sign-in error", error);
            alert(t('auth.errorAuth'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 dark:bg-zinc-900">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                        <Sprout size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {mode === "signin" ? t('auth.signInTitle') : t('auth.signUpTitle')}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2 text-center">
                        {mode === "signin" ? "Welcome back to Agri-ET" : "Create your account to get started"}
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-center py-3 rounded-lg"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <Chrome size={18} className="mr-2" />
                        Continue with Google
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                        <span className="text-xs font-semibold text-zinc-400">OR</span>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {mode === "signup" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('auth.fullName')}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                        required={mode === "signup"}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('auth.phone')}</label>
                                    <input
                                        type="tel"
                                        placeholder="+251..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                        required={mode === "signup"}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('postListing.region')}</label>
                                        <select
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                            required={mode === "signup"}
                                        >
                                            <option value="">Select Region</option>
                                            {ETHIOPIAN_REGIONS.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('postListing.zone')}</label>
                                        <input
                                            type="text"
                                            value={zone}
                                            onChange={(e) => setZone(e.target.value)}
                                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                            required={mode === "signup"}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('postListing.woreda')}</label>
                                        <input
                                            type="text"
                                            value={woreda}
                                            onChange={(e) => setWoreda(e.target.value)}
                                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                            required={mode === "signup"}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('postListing.city')}</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                            required={mode === "signup"}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('auth.roleLabel')}</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setRole("farmer")}
                                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all font-bold ${role === "farmer"
                                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:border-primary-500 dark:text-primary-400"
                                                : "border-zinc-200 hover:border-primary-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                                                }`}
                                        >
                                            {t('auth.farmer')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("merchant")}
                                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all font-bold ${role === "merchant"
                                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:border-primary-500 dark:text-primary-400"
                                                : "border-zinc-200 hover:border-primary-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                                                }`}
                                        >
                                            {t('auth.merchant')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors mt-6"
                        isLoading={loading}
                    >
                        {mode === "signin" ? t('auth.btnSignIn') : t('auth.btnSignUp')}
                    </Button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {mode === "signin" ? t('auth.newToPlatform') : t('auth.alreadyHaveAccount')}
                        <button
                            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                            className="ml-2 text-primary-600 hover:text-primary-700 font-medium hover:underline"
                        >
                            {mode === "signin" ? t('auth.linkSignUp') : t('auth.linkSignIn')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
