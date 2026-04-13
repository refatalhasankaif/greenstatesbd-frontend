"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  basePrice: number;
  status: string;
  createdAt: string;
  images?: { url: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
  HANDED_OVER: "bg-teal-100 text-teal-700",
  SOLD: "bg-purple-100 text-purple-700",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProperties(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(page);
  }, [page]);

  const updateStatus = async (propertyId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setProperties(properties.map(p => p.id === propertyId ? { ...p, status: newStatus } : p));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setProperties(properties.filter(p => p.id !== propertyId));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    }
  };

  const filtered = (Array.isArray(properties) ? properties : []).filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4">Property</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No properties found</td>
                </tr>
              ) : (
                filtered.map((property) => (
                  <tr key={property.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                          {property.images?.[0]?.url ? (
                            <Image 
                              src={property.images[0].url} 
                              alt={property.title} 
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load property image:', property.images?.[0]?.url);
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No img</div>
                          )}
                        </div>
                        <p className="font-medium truncate max-w-48">{property.title}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{property.type}</td>
                    <td className="p-4 text-sm">{property.location}</td>
                    <td className="p-4 text-sm">৳{property.basePrice.toLocaleString()}</td>
                    <td className="p-4">
                      <select
                        value={property.status}
                        onChange={(e) => updateStatus(property.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[property.status] || "bg-gray-100"}`}
                      >
                        {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/properties/${property.id}`} className="p-2 hover:bg-accent rounded-lg">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => deleteProperty(property.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-border rounded disabled:opacity-50">Prev</button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border border-border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
