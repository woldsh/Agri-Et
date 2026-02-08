import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/useAuth";

export function useUnreadMessages() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user || !db) {
            setUnreadCount(0);
            return;
        }

        // Query for messages where the receiver is the current user and read is false
        const q = query(
            collection(db as any, "messages"),
            where("receiverId", "==", user.uid),
            where("read", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [user]);

    return { unreadCount };
}
