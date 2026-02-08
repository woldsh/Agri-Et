"use client";

import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, writeBatch, doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Loader2 } from "lucide-react";
import { Message, UserProfile } from "@/types";
import { getOptimizedImage } from "@/lib/cloudinary/upload";

interface ChatWindowProps {
    conversationId: string;
    receiverId: string;
    receiverName: string;
}

export function ChatWindow({ conversationId, receiverId, receiverName }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchReceiverProfile = async () => {
            if (!receiverId || !db) return;
            try {
                const docRef = doc(db as any, "users", receiverId);
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
        if (!conversationId || !db) return;

        const q = query(
            collection(db as any, "messages"),
            where("conversationId", "==", conversationId),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [conversationId]);

    // Mark messages as read
    useEffect(() => {
        if (!messages.length || !user) return;

        const unreadMessages = messages.filter(msg =>
            msg.receiverId === user.uid && !msg.read
        );

        if (unreadMessages.length > 0) {
            console.log(`[ChatWindow] Marking ${unreadMessages.length} messages as read...`);
            const batch = writeBatch(db as any);
            unreadMessages.forEach(msg => {
                const msgRef = doc(db as any, "messages", msg.id!);
                batch.update(msgRef, { read: true });
            });
            batch.commit()
                .then(() => console.log("[ChatWindow] Messages marked as read successfully"))
                .catch(err => console.error("[ChatWindow] Error marking messages as read:", err));
        } else {
            // console.log("[ChatWindow] No unread messages to mark.");
        }
    }, [messages, user]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || sending) return;

        setSending(true);
        try {
            if (!db) throw new Error("Firebase not initialized");
            await addDoc(collection(db as any, "messages"), {
                conversationId,
                senderId: user.uid,
                receiverId,
                message: newMessage,
                createdAt: serverTimestamp(),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-[#F8FAF9] dark:bg-black">
            {/* Header */}
            <div className="flex items-center gap-4 border-b bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 sticky top-0 z-10">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md">
                    {receiverProfile?.photoURL ? (
                        <img
                            src={getOptimizedImage(receiverProfile.photoURL, 150)}
                            alt={receiverName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="font-bold">{receiverName.charAt(0)}</span>
                    )}
                </div>
                <div>
                    <h2 className="font-bold text-zinc-900 dark:text-white">{receiverName}</h2>
                    <p className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === user?.uid;
                    const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2 group`}>
                            {!isMe && (
                                <div className={`h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-primary-100 items-center justify-center text-primary-700 text-xs font-bold ${showAvatar ? 'flex' : 'invisible'}`}>
                                    {receiverProfile?.photoURL ? (
                                        <img
                                            src={getOptimizedImage(receiverProfile.photoURL, 100)}
                                            alt={receiverName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        receiverName.charAt(0)
                                    )}
                                </div>
                            )}

                            <div
                                className={`max-w-[70%] px-5 py-3 shadow-sm transition-all hover:shadow-md ${isMe
                                    ? "rounded-2xl rounded-br-none bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                                    : "rounded-2xl rounded-bl-none bg-white text-zinc-800 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                                    }`}
                            >
                                <p className="leading-relaxed text-[15px]">{msg.message}</p>
                                <p className={`mt-1.5 text-[10px] font-medium opacity-70 ${isMe ? "text-primary-100 text-right" : "text-zinc-400"}`}>
                                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 border-t dark:border-zinc-800">
                <form onSubmit={handleSend} className="flex gap-3 items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-2xl border-none bg-zinc-100 px-6 py-4 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none dark:bg-zinc-800 dark:text-white"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="h-14 w-14 rounded-2xl p-0 flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform"
                        disabled={sending || !newMessage.trim()}
                    >
                        {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
