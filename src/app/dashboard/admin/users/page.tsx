"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, Trash2, Search, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserProfile } from "@/types";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary/upload";

export default function UserManagementPage() {
    const { user, profile } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
                setUsers(userList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchUsers();
        }
    }, [user]);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (profile?.role !== "admin") {
        return <div className="p-10 text-center">Access Denied</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Manage Users</h1>
                    <p className="text-zinc-500">View and manage all registered users.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-xl border border-zinc-200 pl-10 pr-4 py-2 focus:border-primary-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">User</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Contact</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Location</th>
                                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredUsers.map((userItem) => (
                                <tr key={userItem.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-100">
                                                {userItem.photoURL ? (
                                                    <Image
                                                        src={getOptimizedImage(userItem.photoURL, 100)}
                                                        alt={userItem.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                                        <User size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">{userItem.name}</p>
                                                <p className="text-xs text-zinc-500">Since {new Date(userItem.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${userItem.role === 'farmer' ? 'bg-green-100 text-green-700' :
                                            userItem.role === 'merchant' ? 'bg-blue-100 text-blue-700' :
                                                'bg-purple-100 text-purple-700'
                                            }`}>
                                            {userItem.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-zinc-900 dark:text-white">{userItem.phone}</p>
                                            <p className="text-zinc-500">{userItem.email || "No email"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-500">
                                            {userItem.region}, {userItem.woreda}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteUser(userItem.id)}
                                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
