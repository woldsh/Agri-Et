"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function AdminSetupPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const createAdmin = async () => {
        setLoading(true);
        setStatus("");

        try {
            const email = "wole@gmail.com";
            const password = "12123559";
            const name = "woldsh";

            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create User Profile
            await setDoc(doc(db, "users", user.uid), {
                id: user.uid,
                name: name,
                email: email,
                role: "admin",
                createdAt: new Date(),
                photoURL: ""
            });

            // 3. Create Admin Collection Entry
            await setDoc(doc(db, "admins", user.uid), {
                uid: user.uid,
                email: email,
                name: name,
                accessLevel: "super_admin",
                createdAt: new Date()
            });

            setStatus("✅ Admin Created Successfully! You can now log in.");
        } catch (error: any) {
            console.error(error);
            setStatus("❌ Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-4">
            <h1 className="text-2xl font-bold">Admin Setup</h1>
            <div className="w-full max-w-md space-y-4 rounded-3xl border bg-white p-8 shadow-xl">
                <div>
                    <p className="font-medium text-zinc-500">Target User</p>
                    <p className="text-xl font-bold">{`woldsh`}</p>
                    <p className="text-sm text-zinc-400">wole@gmail.com</p>
                </div>

                <Button
                    onClick={createAdmin}
                    className="w-full"
                    isLoading={loading}
                >
                    Create Admin & Collection
                </Button>

                {status && (
                    <div className={`rounded-xl p-4 text-sm ${status.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
