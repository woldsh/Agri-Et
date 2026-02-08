"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "danger";
    size?: "sm" | "md" | "lg" | "xl";
    isLoading?: boolean;
    glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, glow = false, children, ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/30 border border-primary-500/20",
            secondary: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-400 hover:to-accent-500 shadow-lg shadow-accent-500/30",
            outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-500",
            ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-primary-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
            glass: "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-lg",
            danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/30",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
            md: "px-5 py-2.5 text-sm font-bold",
            lg: "px-8 py-3.5 text-base font-bold tracking-wide",
            xl: "px-10 py-5 text-lg font-black tracking-wide",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale",
                    variants[variant],
                    sizes[size],
                    glow && variant === 'primary' && "shadow-[0_0_20px_rgba(31,140,86,0.5)] hover:shadow-[0_0_30px_rgba(31,140,86,0.6)]",
                    glow && variant === 'secondary' && "shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]",
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : null}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
