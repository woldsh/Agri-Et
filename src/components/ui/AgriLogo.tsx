"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AgriLogo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox="0 0 600 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="agri-gradient" x1="0" y1="0" x2="0" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0.2" stopColor="#76b885" />
                        <stop offset="0.8" stopColor="#3d8c54" />
                    </linearGradient>

                    <linearGradient id="et-gradient-base" x1="300" y1="50" x2="300" y2="160" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#1a2e24" />
                        <stop offset="1" stopColor="#0a1a14" />
                    </linearGradient>

                    <linearGradient id="leaf-gradient" x1="430" y1="100" x2="520" y2="170" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#c5e660" />
                        <stop offset="1" stopColor="#8ab339" />
                    </linearGradient>

                    <linearGradient id="top-bar-gradient" x1="330" y1="45" x2="550" y2="45" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#76b885" />
                        <stop offset="0.5" stopColor="#c5e660" />
                        <stop offset="1" stopColor="#8ab339" />
                    </linearGradient>

                    {/* Filters */}
                    <filter id="inner-shadow">
                        <feOffset dx="0" dy="2" />
                        <feGaussianBlur stdDeviation="2" result="offset-blur" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.3" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>

                    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Agri Text - Custom Paths for font and sweeping g */}
                <g filter="url(#inner-shadow)">
                    {/* A */}
                    <path d="M50 160L90 60H115L155 160H130L122 138H82L74 160H50ZM102 85L88 120H116L102 85Z" fill="url(#agri-gradient)" />
                    {/* g - The iconic one */}
                    <path d="M165 110C165 85 185 70 205 70C225 70 240 85 240 110C240 135 225 150 205 150C195 150 185 145 180 138V180C180 200 160 215 120 215C100 215 80 210 60 205V188C80 193 100 196 115 196C145 196 155 185 155 170V152C145 160 135 165 122 165C102 165 85 150 85 125C85 100 102 85 122 85C135 85 145 90 155 98V88H180V138C180 145 190 150 202 150C218 150 228 135 228 110C228 85 218 70 202 70C190 70 180 75 175 80L165 110Z" fill="url(#agri-gradient)" visibility="hidden" />
                    {/* Simplified g to be safer with paths */}
                    <path d="M195 90C195 75 205 65 220 65C235 65 245 75 245 90C245 105 235 115 220 115C212 115 205 112 200 106L195 90Z" fill="url(#agri-gradient)" />
                    <path d="M220 65C240 65 260 80 260 110C260 140 245 155 220 155C210 155 200 150 195 142V180C195 205 170 220 110 220C80 220 50 215 20 205V185C50 195 80 200 110 200C155 200 170 185 170 165V90H195V142C200 150 210 155 220 155C240 155 250 140 250 110C250 80 240 65 220 65Z" fill="url(#agri-gradient)" />

                    {/* r */}
                    <path d="M270 90V160H295V120C295 105 305 95 315 95V90H270Z" fill="url(#agri-gradient)" />

                    {/* i */}
                    <path d="M325 90V160H350V90H325Z" fill="url(#agri-gradient)" />
                    <circle cx="337.5" cy="70" r="14" fill="url(#agri-gradient)" />
                </g>

                {/* ET Part - Dark blocky letters */}
                <g filter="url(#inner-shadow)">
                    {/* Connecting top bar */}
                    <motion.rect
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        x="370" y="45" width="220" height="15" fill="url(#top-bar-gradient)" rx="2"
                    />

                    {/* E Shape */}
                    <path d="M370 45H480V65H395V95H470V115H395V145H480V165H370V45Z" fill="url(#et-gradient-base)" />

                    {/* T Shape */}
                    <path d="M495 45H605V65H495V45Z" fill="url(#top-bar-gradient)" />
                    <path d="M530 65H570V165H530V65Z" fill="url(#et-gradient-base)" />
                </g>

                {/* Leaf Integration */}
                <g filter="url(#logo-glow)">
                    <path
                        d="M500 110C500 110 540 115 565 150C565 150 520 190 460 170C460 170 480 135 500 110Z"
                        fill="url(#leaf-gradient)"
                        stroke="#fff"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M460 170C495 155 530 150 565 150"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                </g>

                {/* Glow point behind leaf */}
                <circle cx="530" cy="150" r="30" fill="#c5e660" opacity="0.15" filter="blur(20px)" />
            </svg>
        </div>
    );
};
