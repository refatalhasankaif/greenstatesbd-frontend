"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Plus, Edit, Trash2, Eye, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  basePrice: number;
  type: string;
  status: string;
  createdAt: string;
  images?: Array<{ url: string }>;
  bids?: Array<{ id: string; amount: number; userId: string }>;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.push("/login?returnUrl=/my-properties");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const propertiesArray = Array.isArray(data.data) ? data.data : (data.data?.data ? data.data.data : []);
      setProperties(propertiesArray);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setDeleting(propertyId);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed");
      setProperties(properties.filter((p) => p.id !== propertyId));
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
            <p className="text-muted-foreground mt-1">{properties.length} properties listed</p>
          </div>
          <Link
            href="/properties/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition"
          >
            <Plus size={18} />
            Create Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven&apos;t created any properties yet</p>
            <Link
              href="/properties/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition"
            >
              <Plus size={16} />
              Create Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-card border border-border rounded overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                {/* Image Container - Fixed Height */}
                <div className="relative w-full h-40 bg-muted overflow-hidden">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Eye size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                    {property.status || "ACTIVE"}
                  </div>
                </div>

                {/* Content - Constrained to prevent overflow */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-bold text-foreground line-clamp-2 text-sm">{property.title}</h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 mt-1">{property.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote size={14} className="shrink-0" />
                      <span>৳{property.basePrice?.toLocaleString()}</span>
                    </div>
                    {property.bids && property.bids.length > 0 && (
                      <div className="text-xs bg-accent/50 px-2 py-1 rounded w-fit">
                        {property.bids.length} bid(s)
                      </div>
                    )}
                  </div>

                  {/* Actions - Fixed at bottom */}
                  <div className="flex gap-2 pt-2 border-t border-border mt-auto">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs bg-accent hover:bg-accent/80 rounded transition truncate"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <Link
                      href={`/properties/${property.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs bg-accent hover:bg-accent/80 rounded transition truncate"
                    >
                      <Edit size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      disabled={deleting === property.id}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive rounded transition disabled:opacity-50 truncate"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">{deleting === property.id ? "..." : "Delete"}</span>
                    </button>
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
