"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, or, getDocs, doc, getDoc, orderBy, onSnapshot } from "firebase/firestore";
import { Loader2, MessageCircle } from "lucide-react";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { ConversationList, ConversationSummary } from "@/components/messages/ConversationList";

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);

    useEffect(() => {
        if (!user) return;

        // Listen for real-time updates to conversations list if possible
        // For simplicity, we'll fetch once for the list structure, but could upgrade to onSnapshot for the list itself
        const fetchConversations = async () => {
            try {
                if (!db) return;
                const messagesRef = collection(db as any, "messages");
                const q = query(
                    messagesRef,
                    or(
                        where("senderId", "==", user.uid),
                        where("receiverId", "==", user.uid)
                    ),
                    orderBy("createdAt", "desc") // This might require an index
                );

                // Using onSnapshot for the list to be real-time
                const unsubscribe = onSnapshot(query(messagesRef, or(where("senderId", "==", user.uid), where("receiverId", "==", user.uid))), async (snapshot) => {
                    const messagesData = snapshot.docs.map((doc) => doc.data());
                    const conversationsMap = new Map<string, any>();

                    for (const msg of messagesData) {
                        const otherUserId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
                        const convId = msg.conversationId;

                        // Keep only the latest message for the list summary
                        if (!conversationsMap.has(convId) || (msg.createdAt?.toMillis?.() || 0) > (conversationsMap.get(convId).lastMessageTime?.toMillis?.() || 0)) {
                            conversationsMap.set(convId, {
                                id: convId,
                                otherUserId,
                                lastMessage: msg.message,
                                lastMessageTime: msg.createdAt,
                                unreadCount: 0
                            });
                        }

                        // Increment unread count if receiver is me and not read
                        if (msg.receiverId === user.uid && !msg.read) {
                            const conv = conversationsMap.get(convId);
                            conv.unreadCount += 1;
                        }
                    }

                    // Fetch names (could cache this)
                    const conversationsWithNames = await Promise.all(
                        Array.from(conversationsMap.values()).map(async (conv) => {
                            // Optimized: In a real app, store user names in the message doc or a separate 'conversations' collection
                            const userDoc = await getDoc(doc(db as any, "users", conv.otherUserId) as any);
                            return {
                                ...conv,
                                otherUserName: userDoc.exists() ? (userDoc.data() as any)?.name : "Unknown User",
                            };
                        })
                    );

                    setConversations(conversationsWithNames.sort((a, b) =>
                        (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0)
                    ));
                    setLoading(false);
                });

                return () => unsubscribe();

            } catch (error) {
                console.error("Error fetching conversations:", error);
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-65px)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-zinc-50 dark:bg-black">
            {/* Sidebar - always visible on desktop, hidden on mobile if chat is open */}
            <div className={`${selectedConversation ? 'hidden md:block' : 'w-full'} md:w-80 lg:w-96 h-full flex-shrink-0`}>
                <ConversationList
                    conversations={conversations}
                    selectedId={selectedConversation?.id}
                    onSelect={setSelectedConversation}
                />
            </div>

            {/* Chat Area */}
            <div className={`${selectedConversation ? 'w-full' : 'hidden md:flex'} flex-1 h-full flex-col`}>
                {selectedConversation ? (
                    <div className="h-full relative">
                        {/* Back button for mobile */}
                        <button
                            onClick={() => setSelectedConversation(null)}
                            className="md:hidden absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm"
                        >
                            ← Back
                        </button>
                        <ChatWindow
                            conversationId={selectedConversation.id}
                            receiverId={selectedConversation.otherUserId}
                            receiverName={selectedConversation.otherUserName}
                        />
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6 dark:bg-zinc-800">
                            <MessageCircle size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-300">Your Messages</h3>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
