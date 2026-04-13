"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, Eye, Trash2, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  title?: string;
  imageUrl: string;
  category?: string;
  isBlocked?: boolean;
  createdAt: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGallery = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery?page=${pageNum}&limit=12`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGallery(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(page);
  }, [page]);

  const toggleBlock = async (itemId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${itemId}/block`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setGallery(gallery.map(item => 
        item.id === itemId ? { ...item, isBlocked: !currentStatus } : item
      ));
      toast.success(!currentStatus ? "Gallery item blocked" : "Gallery item unblocked");
    } catch {
      toast.error("Failed to update gallery item");
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setGallery(gallery.filter(item => item.id !== itemId));
      toast.success("Gallery item deleted");
    } catch {
      toast.error("Failed to delete gallery item");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage gallery items</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-96 text-muted-foreground">
            <p>No gallery items found</p>
          </div>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition">
              <div className="relative h-40 bg-muted overflow-hidden">
                <Image
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.title || "Gallery item"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {item.isBlocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-semibold">Blocked</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{item.title || "Unnamed"}</h3>
                {item.category && <p className="text-sm text-muted-foreground mb-3">{item.category}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBlock(item.id, item.isBlocked || false)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition text-sm"
                  >
                    {item.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                    {item.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
