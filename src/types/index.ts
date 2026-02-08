export type UserRole = "farmer" | "merchant" | "admin";

export interface UserProfile {
    id: string;
    role: UserRole;
    name: string;
    email?: string;
    phone: string;
    region: string;
    zone: string;
    woreda: string;
    city?: string;
    photoURL?: string;
    createdAt: any; // Firestore Timestamp
}

export interface Listing {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: "crops" | "vegetables" | "fruits" | "livestock" | "poultry" | "dairy";
    price: number;
    negotiable: boolean;
    quantity: string;
    location: {
        region: string;
        zone: string;
        woreda: string;
        city?: string;
    };
    mediaUrls: string[];
    mediaLabels?: string[];
    likesCount: number;
    views?: number;
    createdAt: any; // Firestore Timestamp
}

export interface Like {
    userId: string;
    listingId: string;
}

export interface Message {
    id?: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    message: string;
    read?: boolean;
    createdAt: any; // Firestore Timestamp
}
