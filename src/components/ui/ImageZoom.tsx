"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageZoomProps {
    src: string;
    alt: string;
}

export const ImageZoom = ({ src, alt }: ImageZoomProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        // Calculate mouse position relative to the image container (0-1)
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setPosition({ x, y });
        setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
    };

    return (
        <div
            className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-100 cursor-crosshair group"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
            />

            {/* Magnifying Lens (visible on hover) */}
            {showZoom && (
                <div
                    className="absolute pointer-events-none hidden md:block border border-zinc-200 bg-white/20 backdrop-blur-[1px] shadow-sm rounded-full"
                    style={{
                        left: cursorPosition.x - 75, // Center the lens (150px width / 2)
                        top: cursorPosition.y - 75,
                        width: '150px',
                        height: '150px',
                    }}
                />
            )}

            {/* Zoomed View (Overlay) */}
            {showZoom && (
                <div
                    className="absolute inset-0 pointer-events-none hidden md:block bg-white"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "250%", // 2.5x Zoom
                    }}
                >
                    {/* Optional: Add a label or indicator */}
                </div>
            )}
        </div>
    );
};
