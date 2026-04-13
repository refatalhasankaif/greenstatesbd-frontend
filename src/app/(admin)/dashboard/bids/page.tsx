"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, Gavel } from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  property?: { title: string };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PROPERTY_SOLD: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBids = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBids(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids(page);
  }, [page]);

  const updateStatus = async (bidId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids/${bidId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setBids(bids.map(b => b.id === bidId ? { ...b, status: newStatus } : b));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = bids.filter(b => 
    b.property?.title.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bids</h1>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search bids..."
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
                <th className="p-4">Bidder</th>
                <th className="p-4">Property</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No bids found</td>
                </tr>
              ) : (
                filtered.map((bid) => (
                  <tr key={bid.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-4">
                      <p className="font-medium">{bid.user?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{bid.user?.email}</p>
                    </td>
                    <td className="p-4 text-sm">{bid.property?.title || "Unknown"}</td>
                    <td className="p-4 font-medium">৳{bid.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <select
                        value={bid.status}
                        onChange={(e) => updateStatus(bid.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[bid.status] || "bg-gray-100"}`}
                      >
                        {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(bid.createdAt).toLocaleDateString()}
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
