"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  type: string;
  status: string;
  message?: string;
  createdAt: string;
  propertyId?: string;
  blogId?: string;
  galleryId?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter(r => 
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    (r.message && r.message.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      REVIEWED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getReportTarget = (report: Report) => {
    if (report.propertyId) return "Property";
    if (report.blogId) return "Blog";
    if (report.galleryId) return "Gallery";
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
            <p className="text-muted-foreground mt-1">Track your submitted reports</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
              No reports found
            </div>
          ) : (
            filtered.map((report) => (
              <div key={report.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {report.type.replace(/_/g, " ")} - {getReportTarget(report)}
                    </h3>
                    {report.message && (
                      <p className="text-sm text-muted-foreground">{report.message}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
