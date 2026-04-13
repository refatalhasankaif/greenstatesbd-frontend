"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, ArrowLeft, MapPin, Banknote, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  amount: number;
  status: "ACTIVE" | "PROPERTY_SOLD" | "CANCELLED";
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    currentBid?: number;
    location: string;
    type: string;
    images?: Array<{ url: string }>;
  };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PROPERTY_SOLD: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function BidDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bidId = params.id as string;

  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBid();
  }, [bidId]);

  const fetchBid = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Bid not found");
          router.push("/bids");
          return;
        }
        throw new Error("Failed to fetch bid");
      }

      const data = await res.json();
      setBid(data.data);
    } catch (error) {
      toast.error("Failed to load bid details");
      router.push("/bids");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Bid not found</p>
        <Link href="/bids" className="text-primary hover:underline flex items-center gap-2 justify-center">
          <ArrowLeft size={18} /> Back to Bids
        </Link>
      </div>
    );
  }

  const isWinning = bid.status === "PROPERTY_SOLD";
  const isDifference = bid.amount - (bid.property.currentBid || bid.property.basePrice);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bid Details</h1>
            <p className="text-muted-foreground text-sm">ID: {bidId}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Property Image */}
              <div className="relative w-full h-64 bg-muted">
                {bid.property.images?.[0]?.url ? (
                  <Image
                    src={bid.property.images[0].url}
                    alt={bid.property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{bid.property.title}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{bid.property.location}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{bid.property.description}</p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                    <p className="font-semibold">{bid.property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                    <p className="font-semibold">৳{bid.property.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Information */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold">Your Bid</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Bid</p>
                  <p className="text-3xl font-bold text-primary">৳{bid.amount.toLocaleString()}</p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current Bid</p>
                  <p className="text-3xl font-bold">৳{(bid.property.currentBid || bid.property.basePrice).toLocaleString()}</p>
                </div>

                <div className={`bg-accent/50 rounded-lg p-4 text-center ${isDifference >= 0 ? "border-2 border-green-500" : "border-2 border-red-500"}`}>
                  <p className="text-sm text-muted-foreground mb-2">Difference</p>
                  <p className={`text-2xl font-bold ${isDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {isDifference >= 0 ? "+" : ""}৳{Math.abs(isDifference).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[bid.status]}`}>
                    {bid.status === "PROPERTY_SOLD" ? "🏆 " : ""}{bid.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed on</span>
                  <span className="font-semibold">
                    {new Date(bid.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isWinning && (
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
                    <p className="text-green-800 dark:text-green-300 font-semibold">
                      🎉 Congratulations! You won this property!
                    </p>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                      The property has been transferred to your ownership.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${STATUS_COLORS[bid.status]}`}>
                  {bid.status}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {isWinning ? "This bid has won the property!" : bid.status === "CANCELLED" ? "This bid has been cancelled." : "This bid is still active."}
              </p>
            </div>

            {/* Bidder Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-4">Your Information</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold">{bid.user?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{bid.user?.email || "Unknown"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={`/properties/${bid.property.id}`}
                className="w-full inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-center hover:opacity-90 transition"
              >
                View Property
              </Link>
              <Link
                href="/bids"
                className="w-full inline-block px-4 py-2 border border-border rounded-lg font-medium text-center hover:bg-accent transition"
              >
                Back to Bids
              </Link>
            </div>

            {/* Additional Info */}
            <div className="bg-accent/50 rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Placed on</p>
                  <p className="font-semibold">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
