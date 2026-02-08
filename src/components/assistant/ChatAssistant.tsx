"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, ChevronDown, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
    id: string;
    role: "assistant" | "user";
    text: string;
    timestamp: Date;
}

export function ChatAssistant() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize with translated welcome message - resets on language change
    useEffect(() => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                text: t('chat.welcome'),
                timestamp: new Date(),
            },
        ]);
    }, [language, t]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulation of AI Response based on translated keywords
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = t('chat.fallback');

            // Keyword checking from translations
            const postKeywords = (t('chat.postKeywords') || []) as string[];
            const contactKeywords = (t('chat.contactKeywords') || []) as string[];
            const locationKeywords = (t('chat.locationKeywords') || []) as string[];
            const productKeywords = (t('chat.productKeywords') || []) as string[];

            const buyKeywords = (t('chat.buyKeywords') || []) as string[];

            const hasPost = postKeywords.some(k => lowerText.includes(k.toLowerCase()));
            const hasContact = contactKeywords.some(k => lowerText.includes(k.toLowerCase()));
            const hasLocation = locationKeywords.some(k => lowerText.includes(k.toLowerCase()));
            const hasProduct = productKeywords.some(k => lowerText.includes(k.toLowerCase()));
            const hasBuy = buyKeywords.some(k => lowerText.includes(k.toLowerCase()));

            // Priority Logic:
            // 1. If explicitly asking about posting/selling
            if (hasPost) {
                response = t('chat.r1');
            }
            // 2. If asking about contacting or finding people (not products)
            else if (hasContact) {
                response = t('chat.r3');
            }
            // 3. If asking about buying or finding products in specific ways
            else if (hasBuy || hasLocation) {
                response = t('chat.r5');
            }
            // 4. Exact matches for common questions as fallback for specific phrases
            else if (lowerText === t('chat.q1').toLowerCase()) {
                response = t('chat.r1');
            } else if (lowerText === t('chat.q2').toLowerCase()) {
                response = t('chat.r2');
            } else if (lowerText === t('chat.q3').toLowerCase()) {
                response = t('chat.r3');
            } else if (lowerText === t('chat.q4').toLowerCase()) {
                response = t('chat.r4');
            }
            // 5. Generic product mention (fallback location/how-to)
            else if (hasProduct) {
                response = t('chat.r5');
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                text: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const SUGGESTED = [
        { q: t('chat.q1'), r: t('chat.r1') },
        { q: t('chat.q2'), r: t('chat.r2') },
        { q: t('chat.q3'), r: t('chat.r3') },
        { q: t('chat.q4'), r: t('chat.r4') },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 flex h-[550px] w-[380px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-primary-900/20 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                        {/* Header */}
                        <div className="bg-primary-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{t('chat.name') || "Agri-ET Assistant"}</h3>
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary-100 uppercase tracking-tighter">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                            {t('chat.online')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto bg-zinc-50 p-4 space-y-4 dark:bg-zinc-900/50"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`flex max-w-[85%] gap-2 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${msg.role === "assistant" ? "bg-primary-600" : "bg-zinc-700"
                                            }`}>
                                            {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === "assistant"
                                            ? "bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                            : "bg-primary-600 text-white"
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex max-w-[85%] gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white leading-none">
                                            <RefreshCw size={14} className="animate-spin" />
                                        </div>
                                        <div className="rounded-2xl bg-white px-4 py-2.5 dark:bg-zinc-800">
                                            <div className="flex gap-1.5">
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.2s]" />
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length === 1 && (
                            <div className="bg-zinc-50 px-4 py-2 dark:bg-zinc-900/50">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t('chat.commonQuestions')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED.map((item) => (
                                        <button
                                            key={item.q}
                                            onClick={() => handleSend(item.q)}
                                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-all hover:border-primary-500 hover:text-primary-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 text-left"
                                        >
                                            {item.q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t('chat.placeholder')}
                                    className="flex-1 bg-transparent text-sm outline-none dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${isOpen ? "bg-zinc-800 text-white" : "bg-primary-600 text-white"
                    }`}
            >
                {isOpen ? <ChevronDown size={32} /> : (
                    <div className="relative">
                        <MessageSquare size={30} />
                        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-primary-600 bg-green-500" />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
