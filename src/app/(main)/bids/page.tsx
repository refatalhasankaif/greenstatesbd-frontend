"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Eye, TrendingUp, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Bid {
  id: string;
  amount: number;
  status: "ACTIVE" | "PROPERTY_SOLD" | "CANCELLED";
  createdAt: string;
  property: {
    id: string;
    title: string;
    basePrice: number;
    location: string;
    currentBid?: number;
    images?: Array<{ url: string }>;
  };
}

export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PROPERTY_SOLD" | "CANCELLED">("ALL");

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch bids");
      const data = await res.json();
      const bidsArray = Array.isArray(data.data) ? data.data : [];
      setBids(bidsArray.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error("Failed to load your bids");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "ALL" ? bids : bids.filter((b) => b.status === filter);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      PROPERTY_SOLD: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-muted";
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Bids</h1>
          <p className="text-muted-foreground mt-1">
            Total {bids.length} bid{bids.length !== 1 ? "s" : ""} • {bids.filter((b) => b.status === "ACTIVE").length} active
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["ALL", "ACTIVE", "PROPERTY_SOLD", "CANCELLED"] as const).map((status) => {
            const count = status === "ALL" ? bids.length : bids.filter((b) => b.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded font-medium transition whitespace-nowrap ${
                  filter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Bids list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{filter === "ALL" ? "No bids yet" : `No ${filter.toLowerCase()} bids`}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bid) => (
              <div
                key={bid.id}
                className="bg-card border border-border rounded overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                {/* Property Image */}
                <div className="relative w-full h-40 bg-muted overflow-hidden">
                  {bid.property.images?.[0] ? (
                    <Image
                      src={bid.property.images[0].url}
                      alt={bid.property.title}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Eye size={32} />
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{bid.property.title}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                      <MapPin size={12} />
                      <span className="truncate">{bid.property.location}</span>
                    </div>
                  </div>

                  {/* Bid Details */}
                  <div className="bg-accent/50 rounded p-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Your Bid</span>
                      <span className="font-bold text-foreground">৳{bid.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Base Price</span>
                      <span className="text-xs text-muted-foreground">৳{bid.property.basePrice.toLocaleString()}</span>
                    </div>
                    {bid.property.currentBid && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Current</span>
                        <span className="text-xs font-medium text-foreground">৳{bid.property.currentBid.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-xs text-muted-foreground">
                    {new Date(bid.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-2">
                    <Link
                      href={`/bids/${bid.id}`}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded text-sm text-center transition flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={14} />
                      Bid Details
                    </Link>
                    <Link
                      href={`/properties/${bid.property.id}`}
                      className="w-full px-4 py-2 border border-border text-foreground hover:bg-accent rounded text-sm text-center transition flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View Property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
