"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useListings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const toggleLike = async (listingId: string, isLiked: boolean) => {
    if (!user) return alert("Please sign in to like posts.");

    setLoading(true);
    try {
      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        likesCount: increment(isLiked ? -1 : 1),
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading };
}
