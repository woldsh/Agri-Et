"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "@/types";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, pass: string, name: string, phone: string, role: string, region: string, zone: string, woreda: string, city: string) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const buildDefaultProfile = (firebaseUser: User): UserProfile => {
        return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            role: "merchant",
            email: firebaseUser.email || undefined,
            phone: "",
            region: "",
            zone: "",
            woreda: "",
            city: "",
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
        };
    };

    const ensureUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
        if (!db) return buildDefaultProfile(firebaseUser);
        const docRef = doc(db as any, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef as any);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }

        const newProfile = buildDefaultProfile(firebaseUser);
        await setDoc(docRef, newProfile);
        return newProfile;
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const ensuredProfile = await ensureUserProfile(firebaseUser);
                setProfile(ensuredProfile);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, pass: string, name: string, phone: string, role: string, region: string, zone: string, woreda: string, city: string) => {
        const res = await createUserWithEmailAndPassword(auth as any, email, pass);
        const userId = res.user.uid;

        const newProfile: UserProfile = {
            id: userId,
            name,
            role: role as any,
            phone,
            region,
            zone,
            woreda,
            city,
            createdAt: new Date(),
        };

        await setDoc(doc(db as any, "users", userId), newProfile);
        setProfile(newProfile);
    };

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth as any, email, pass);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        const res = await signInWithPopup(auth as any, provider);
        const ensuredProfile = await ensureUserProfile(res.user);
        setProfile(ensuredProfile);
    };

    const signOut = async () => {
        await firebaseSignOut(auth as any);
    };

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user || !profile || !db) return;

        const docRef = doc(db as any, "users", user.uid);
        await setDoc(docRef as any, data, { merge: true });

        setProfile({ ...profile, ...data });
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
