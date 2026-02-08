"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
    {
        url: "https://images.unsplash.com/photo-1625246333195-bf40b64d0d2b?q=80&w=1920&auto=format&fit=crop", // Teff/Green Field
        alt: "Ethiopian Teff Field",
    },
    {
        url: "https://images.unsplash.com/photo-1594719658564-9beaa73c6839?q=80&w=1920&auto=format&fit=crop", // Zebu Cow
        alt: "Ethiopian Zebu Cattle",
    },
    {
        url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1920&auto=format&fit=crop", // Coffee
        alt: "Premium Ethiopian Coffee",
    },
    {
        url: "https://images.unsplash.com/photo-1545624795-c49b6b718919?q=80&w=1920&auto=format&fit=crop", // Oxen Plowing
        alt: "Oxen Plowing Farm",
    },
    {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop", // Wheat/Golden Crop
        alt: "Golden Wheat Harvest",
    },
    {
        url: "https://images.unsplash.com/photo-1565551327170-c081ef77fb58?q=80&w=1920&auto=format&fit=crop", // Cows Grazing
        alt: "Cattle Grazing",
    },
    {
        url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1920&auto=format&fit=crop", // Maize/Corn
        alt: "Fresh Maize Field",
    },
    {
        url: "https://images.unsplash.com/photo-1484557985045-6f5c98403096?q=80&w=1920&auto=format&fit=crop", // Goats
        alt: "Farm Goats",
    },
    {
        url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1920&auto=format&fit=crop", // Onions/Red Crop
        alt: "Red Onion Harvest",
    },
    {
        url: "https://images.unsplash.com/photo-1582234038676-e63d3957a2f5?q=80&w=1920&auto=format&fit=crop", // Shepherd/Cattle
        alt: "Herding Livestock",
    }
];

export function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % IMAGES.length);
        }, 3000); // 3 seconds speed

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-primary-950">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${IMAGES[index].url})` }}
                        role="img"
                        aria-label={IMAGES[index].alt}
                    />

                    {/* Enhanced Gradient Overlays for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-950/60 to-primary-950/30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/40 to-primary-950" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
