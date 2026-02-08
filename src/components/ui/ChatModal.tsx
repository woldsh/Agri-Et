"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase/config";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    or,
    getDocs,
    doc,
    getDoc,
    writeBatch
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/types";
import { getOptimizedImage } from "@/lib/cloudinary/upload";

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    message: string;
    read?: boolean;
    createdAt: any;
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
    listingTitle?: string;
}

export function ChatModal({ isOpen, onClose, receiverId, receiverName, listingTitle }: ChatModalProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationId = [user?.uid, receiverId].sort().join("_");
    const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchReceiverProfile = async () => {
            if (!receiverId) return;
            try {
                const docRef = doc(db, "users", receiverId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setReceiverProfile(docSnap.data() as UserProfile);
                }
            } catch (error) {
                console.error("Error fetching receiver profile:", error);
            }
        };
        fetchReceiverProfile();
    }, [receiverId]);

    useEffect(() => {
        if (!user || !isOpen) return;

        setLoading(true);

        // Listen to messages in real-time
        const q = query(
            collection(db, "messages"),
            where("conversationId", "==", conversationId),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];

            setMessages(messagesData);
            setLoading(false);

            // Scroll to bottom
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => unsubscribe();
    }, [user, receiverId, conversationId, isOpen]);

    // Mark messages as read
    useEffect(() => {
        if (!messages.length || !user || !isOpen) return;

        const unreadMessages = messages.filter(msg =>
            msg.receiverId === user.uid && !msg.read
        );

        if (unreadMessages.length > 0) {
            console.log(`[ChatModal] Marking ${unreadMessages.length} messages as read...`);
            const batch = writeBatch(db);
            unreadMessages.forEach(msg => {
                const msgRef = doc(db, "messages", msg.id);
                batch.update(msgRef, { read: true });
            });
            batch.commit()
                .then(() => console.log("[ChatModal] Messages marked as read successfully"))
                .catch(err => console.error("[ChatModal] Error marking messages as read:", err));
        }
    }, [messages, user, isOpen]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setSending(true);
        try {
            await addDoc(collection(db, "messages"), {
                conversationId,
                senderId: user.uid,
                receiverId,
                message: newMessage.trim(),
                read: false,
                createdAt: serverTimestamp(),
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl dark:bg-zinc-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b bg-primary-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/20">
                                {receiverProfile?.photoURL ? (
                                    <img
                                        src={getOptimizedImage(receiverProfile.photoURL!, 150)}
                                        alt={receiverName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center font-bold">
                                        {receiverName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold">{receiverName}</h3>
                                {listingTitle && <p className="text-xs text-primary-100">{listingTitle}</p>}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 transition-colors hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <p className="mb-2 text-sm font-bold text-zinc-900 dark:text-white">
                                    Start the conversation
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Send a message to {receiverName}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg) => {
                                    const isOwn = msg.senderId === user?.uid;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2`}
                                        >
                                            {!isOwn && (
                                                <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200">
                                                    {receiverProfile?.photoURL ? (
                                                        <img
                                                            src={getOptimizedImage(receiverProfile.photoURL!, 100)}
                                                            alt={receiverName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500">
                                                            {receiverName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-2 ${isOwn
                                                    ? "bg-primary-600 text-white"
                                                    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                                <p
                                                    className={`mt-1 text-[10px] ${isOwn ? "text-primary-100" : "text-zinc-500"
                                                        }`}
                                                >
                                                    {msg.createdAt?.toDate?.()?.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }) || "Sending..."}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="border-t p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                className="px-6"
                                disabled={!newMessage.trim() || sending}
                                isLoading={sending}
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
