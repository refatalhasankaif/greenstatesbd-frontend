"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  basePrice: number;
  currentBid?: number;
  status: string;
  createdAt: string;
  images?: { url: string }[];
  bids?: Bid[];
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
  HANDED_OVER: "bg-teal-100 text-teal-700",
  SOLD: "bg-purple-100 text-purple-700",
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProperty(data.data);
    } catch (err) {
      toast.error("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (bidId: string) => {
    if (!confirm("Are you sure you want to accept this bid?")) return;
    
    setUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/accept-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bidId }),
      });
      if (!res.ok) throw new Error("Failed to accept bid");
      const data = await res.json();
      setProperty(data.data);
      setSelectedBidId(null);
      toast.success("Bid accepted successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept bid");
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setProperty(data.data);
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Property not found</p>
        <Link href="/dashboard/properties" className="text-primary hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  const bids = property.bids || [];
  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : null;
  const highestBidder = bids.length > 0 ? bids.reduce((max, bid) => bid.amount > max.amount ? bid : max) : null;

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:opacity-80"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {property.images?.[0]?.url ? (
                <Image
                  src={property.images[0].url}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-gray-600">{property.location}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-gray-700">{property.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-semibold">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="font-semibold">৳{property.basePrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Bids */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Bids ({bids.length})</h2>

            {bids.length === 0 ? (
              <p className="text-muted-foreground">No bids yet</p>
            ) : (
              <div className="space-y-3">
                {bids
                  .sort((a, b) => b.amount - a.amount)
                  .map((bid) => (
                    <div
                      key={bid.id}
                      className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition ${
                        selectedBidId === bid.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedBidId(bid.id)}
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{bid.user?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{bid.user?.email}</p>
                        <p className="text-sm text-primary font-bold mt-1">
                          ৳{bid.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          bid.status === "PROPERTY_SOLD"
                            ? "bg-purple-100 text-purple-700"
                            : bid.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-4">Property Status</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
                    property.status === status
                      ? color
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Highest Bidder Card */}
          {highestBidder && (
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="font-bold mb-4">🏆 Highest Bidder</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Bidder Name</p>
                  <p className="font-semibold text-lg">{highestBidder.user?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{highestBidder.user?.email || "Not available"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bid Amount</p>
                  <p className="text-3xl font-bold text-primary">৳{highestBidder.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {!highestBid && bids.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No bids received yet</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Bids</p>
              <p className="text-3xl font-bold">{bids.length}</p>
            </div>
            {highestBid && (
              <div>
                <p className="text-sm text-muted-foreground">Highest Bid</p>
                <p className="text-2xl font-bold">৳{highestBid.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
