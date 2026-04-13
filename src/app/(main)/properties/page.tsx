"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Search,
  MapPin,
  Home,
  TrendingUp,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { IProperty } from "@/types/property";
import { API } from "@/lib/api";

const PROPERTY_TYPES = ["APARTMENT", "LAND", "HOUSE", "COMMERCIAL"];
const DIVISIONS = ["DHAKA", "CHITTAGONG", "KHULNA", "RAJSHAHI", "SYLHET", "BARISAL", "RANGPUR", "MYMENSINGH"];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300",
  UPCOMING: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  ONGOING: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
  CLOSED: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  ADVANCE_PAID: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  FULLY_PAID: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
  HANDED_OVER: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
};

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    location: searchParams.get("location") || "",
    page: 1,
  });
  const [meta, setMeta] = useState({ total: 0, totalPage: 1, page: 1, limit: 10 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(filters.page),
        limit: "10",
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.location && { location: filters.location }),
      });

      const res = await fetch(`${API}/properties?${params}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to load properties");
      

      const propertiesData = json.data || [];
      const metaData = json.meta || { total: 0, totalPage: 1, page: 1, limit: 10 };
      

      if (Array.isArray(propertiesData)) {
        setProperties(propertiesData);
        setMeta(metaData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load properties");
      setProperties([]);
      setMeta({ total: 0, totalPage: 1, page: 1, limit: 10 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: "", type: "", location: "", page: 1 });
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">Explore {meta.total} available properties</p>
          </div>
          <Link
            href="/properties/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Create Property</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Search size={16} />
              Filters
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-muted-foreground hover:text-foreground transition"
            >
              <ChevronDown size={20} className={showFilters ? "rotate-180" : ""} />
            </button>
          </div>

          <div className={`grid gap-4 ${showFilters ? "grid-cols-1" : "hidden md:grid"} md:grid-cols-4`}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Locations</option>
                {DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
            {(filters.search || filters.type || filters.location) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <Home size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="h-full rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary transition bg-card cursor-pointer">
                    {/* Image */}
                    <div className="relative h-40 w-full bg-muted overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0].url}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          onError={(e) => {
                            console.error('Failed to load property image:', property.images[0].url);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Home size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{property.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin size={12} />
                          <span>{property.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Base Price</p>
                          <p className="font-bold text-foreground">৳{property.basePrice.toLocaleString()}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${STATUS_COLORS[property.status] || STATUS_COLORS.DRAFT}`}
                        >
                          {property.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                        <TrendingUp size={12} />
                        <span>{property.type}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleFilterChange("page", String(Math.max(1, meta.page - 1)))}
                  disabled={meta.page === 1}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition text-foreground"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPage}
                </span>
                <button
                  onClick={() => handleFilterChange("page", String(Math.min(meta.totalPage, meta.page + 1)))}
                  disabled={meta.page >= meta.totalPage}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition text-foreground"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
