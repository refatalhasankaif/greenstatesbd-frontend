"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, User, Mail, Calendar, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", profileImage: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUser(data.data);
      setEditForm({ name: data.data.name, email: data.data.email, profileImage: data.data.profileImage || "" });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Name and email cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          profileImage: editForm.profileImage || undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update");
      }

      const data = await res.json();
      setUser(data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  if (!user) return null;

  return (

    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">My Profile</h1>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">


          <div className="flex flex-wrap items-center gap-3">

            <div className="shrink-0">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent flex items-center justify-center border-2 border-primary">
                  <User size={32} className="text-accent-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">

              <h2 className="text-lg sm:text-xl font-bold text-foreground wrap-break-word">{user.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
            </div>


            <div className="flex gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition text-sm"
                  >
                    <Save size={14} />
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: user.name, email: user.email, profileImage: user.profileImage || "" });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg hover:opacity-90 transition text-sm"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>


          <div className="border-t border-border pt-5 grid grid-cols-1 md:grid-cols-2 gap-3">


            <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg min-w-0">
              <User size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-sm"
                  />
                ) : (

                  <p className="text-sm font-medium text-foreground wrap-break-word">{user.name}</p>
                )}
              </div>
            </div>


            <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg min-w-0">
              <Mail size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-sm"
                  />
                ) : (

                  <p className="text-sm font-medium text-foreground break-all">{user.email}</p>
                )}
              </div>
            </div>


            <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg md:col-span-2 min-w-0">
              <ImageIcon size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Profile Picture URL</p>
                {isEditing ? (
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={editForm.profileImage}
                    onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                    className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-sm"
                  />
                ) : (

                  <p className="text-sm font-medium text-foreground break-all">
                    {editForm.profileImage || "No image URL set"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg min-w-0">
              <Calendar size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Joined</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg min-w-0">
              <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`} />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Status</p>
                <p className="text-sm font-medium text-foreground">{user.isBlocked ? "Blocked" : "Active"}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Quick Links</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/my-properties"
                className="p-3 bg-muted rounded-lg hover:border-primary border border-transparent transition"
              >
                <p className="font-semibold text-foreground text-sm">My Properties</p>
                <p className="text-xs text-muted-foreground">View and manage listings</p>
              </Link>
              <Link
                href="/bids"
                className="p-3 bg-muted rounded-lg hover:border-primary border border-transparent transition"
              >
                <p className="font-semibold text-foreground text-sm">My Bids</p>
                <p className="text-xs text-muted-foreground">Track your active bids</p>
              </Link>
              <Link
                href="/reports"
                className="p-3 bg-muted rounded-lg hover:border-primary border border-transparent transition"
              >
                <p className="font-semibold text-foreground text-sm">My Reports</p>
                <p className="text-xs text-muted-foreground">View submitted reports</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}