"use client";

import { Message, UserProfile } from "@/types";
import { User, Search } from "lucide-react";

export interface ConversationSummary {
    id: string; // conversationId
    otherUserId: string;
    otherUserName: string;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: number;
}

interface ConversationListProps {
    conversations: ConversationSummary[];
    selectedId?: string;
    onSelect: (conversation: ConversationSummary) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
    return (
        <div className="flex flex-col h-full bg-[#fcfdfc] border-r dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-5">
                <h2 className="text-2xl font-black mb-6 text-primary-900 tracking-tight dark:text-white">Messages</h2>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-zinc-100 shadow-sm focus:shadow-md focus:border-primary-100 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="text-zinc-300" size={24} />
                        </div>
                        <p className="text-zinc-500 font-medium">No messages yet</p>
                        <p className="text-xs text-zinc-400 mt-1">Chat start when you contact a farmer</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => onSelect(conv)}
                                className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all duration-200 text-left group relative overflow-hidden ${selectedId === conv.id
                                    ? "bg-primary-600 shadow-md shadow-primary-500/20"
                                    : "hover:bg-white hover:shadow-sm"
                                    }`}
                            >
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-transform group-hover:scale-105 ${selectedId === conv.id
                                    ? "bg-white/20 text-white backdrop-blur-sm"
                                    : "bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700"
                                    }`}>
                                    {conv.otherUserName.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold truncate ${selectedId === conv.id ? "text-white" : "text-zinc-900 dark:text-white"
                                            }`}>{conv.otherUserName}</h3>
                                        <span className={`text-[10px] font-medium flex-shrink-0 ${selectedId === conv.id ? "text-primary-100" : "text-zinc-400"
                                            }`}>
                                            {conv.lastMessageTime?.toDate ? conv.lastMessageTime.toDate().toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate font-medium ${selectedId === conv.id ? "text-primary-100" : "text-zinc-500 group-hover:text-primary-600"
                                        }`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] rounded-full bg-green-500 text-white text-xs font-bold px-1.5 shadow-sm">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
