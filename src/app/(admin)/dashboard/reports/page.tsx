"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, Eye, CheckCircle, XCircle, ImageIcon, FileText, Home } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  basePrice: number;
  status: string;
  images?: Array<{ url: string }>;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author: User;
}

interface Gallery {
  id: string;
  title: string;
  imageUrl: string;
  user: User;
}

interface Report {
  id: string;
  type: string;
  message?: string;
  status: string;
  createdAt: string;
  user: User;
  propertyId?: string;
  blogId?: string;
  galleryId?: string;
  property?: Property;
  blog?: Blog;
  gallery?: Gallery;
}

const STATUS_OPTIONS = ["PENDING", "REVIEWED", "RESOLVED", "REJECTED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actioning, setActioning] = useState(false);

  const fetchReports = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const updateStatus = async (reportId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus });
      }
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const takeAction = async (reportId: string, action: "BLOCK" | "ALLOW") => {
    setActioning(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/action`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed");
      

      await fetchReports(page);
      setSelectedReport(null);
      toast.success(`Content ${action === "BLOCK" ? "blocked" : "allowed"} successfully`);
    } catch (err) {
      toast.error("Failed to take action");
    } finally {
      setActioning(false);
    }
  };

  const getTargetInfo = (report: Report) => {
    if (report.property) {
      return { type: "Property", data: report.property };
    }
    if (report.blog) {
      return { type: "Blog", data: report.blog };
    }
    if (report.gallery) {
      return { type: "Gallery", data: report.gallery };
    }
    return { type: "Unknown", data: null };
  };

  const filtered = (Array.isArray(reports) ? reports : []).filter(r => 
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    (r.message && r.message.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reports found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((report) => {
            const targetInfo = getTargetInfo(report);
            const isProperty = !!report.property;
            const isBlog = !!report.blog;
            const isGallery = !!report.gallery;

            return (
              <div key={report.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                          {report.type.replace(/_/g, " ")}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${STATUS_COLORS[report.status]}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reported by <span className="font-medium">{report.user?.name}</span> on{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      {report.message && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded">{report.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Reported Content Preview */}
                  {isProperty && report.property && (
                    <div className="border-t pt-4 bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                      <div className="flex gap-3">
                        {report.property.images?.[0]?.url && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <Image 
                              src={report.property.images[0].url} 
                              alt={report.property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Home size={14} className="text-blue-600" />
                            <p className="font-semibold text-sm line-clamp-1">{report.property.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{report.property.location}</p>
                          <p className="text-xs font-medium mt-1">৳{report.property.basePrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isBlog && report.blog && (
                    <div className="border-t pt-4 bg-purple-50 dark:bg-purple-950/20 p-3 rounded">
                      <div className="flex gap-3">
                        <FileText size={16} className="text-purple-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">{report.blog.title}</p>
                          <p className="text-xs text-muted-foreground">by {report.blog.author?.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{report.blog.content}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isGallery && report.gallery && (
                    <div className="border-t pt-4 bg-pink-50 dark:bg-pink-950/20 p-3 rounded">
                      <div className="flex gap-3">
                        {report.gallery.imageUrl && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <Image 
                              src={report.gallery.imageUrl} 
                              alt={report.gallery.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <ImageIcon size={14} className="text-pink-600" />
                            <p className="font-semibold text-sm line-clamp-1">{report.gallery.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">by {report.gallery.user?.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[report.status] || "bg-gray-100"}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button
                      onClick={() => setSelectedReport(report)}
                      className="ml-auto px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:opacity-90 transition flex items-center gap-1"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="px-3 py-1 border border-border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages} 
            className="px-3 py-1 border border-border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Report Details</h2>
                  <p className="text-sm text-muted-foreground">{selectedReport.type} Report</p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-2xl leading-none">×</button>
              </div>

              {/* Full Content */}
              {selectedReport.property && (
                <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <h3 className="font-bold flex items-center gap-2"><Home size={16} /> Property</h3>
                  {selectedReport.property.images?.[0]?.url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image 
                        src={selectedReport.property.images[0].url} 
                        alt={selectedReport.property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedReport.property.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.property.location}</p>
                    <p className="text-sm">Base Price: ৳{selectedReport.property.basePrice.toLocaleString()}</p>
                    <p className="text-sm">Status: <span className="font-medium">{selectedReport.property.status}</span></p>
                  </div>
                </div>
              )}

              {selectedReport.blog && (
                <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded">
                  <h3 className="font-bold flex items-center gap-2"><FileText size={16} /> Blog Post</h3>
                  <div>
                    <p className="font-semibold">{selectedReport.blog.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">by {selectedReport.blog.author?.name}</p>
                    <p className="text-sm whitespace-pre-wrap line-clamp-6">{selectedReport.blog.content}</p>
                  </div>
                </div>
              )}

              {selectedReport.gallery && (
                <div className="space-y-3 p-4 bg-pink-50 dark:bg-pink-950/20 rounded">
                  <h3 className="font-bold flex items-center gap-2"><ImageIcon size={16} /> Gallery Image</h3>
                  {selectedReport.gallery.imageUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image 
                        src={selectedReport.gallery.imageUrl} 
                        alt={selectedReport.gallery.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedReport.gallery.title}</p>
                    <p className="text-xs text-muted-foreground">by {selectedReport.gallery.user?.name}</p>
                  </div>
                </div>
              )}

              {/* Report Info */}
              <div className="p-4 bg-muted rounded space-y-2">
                <p><span className="font-medium">Type:</span> {selectedReport.type}</p>
                <p><span className="font-medium">Message:</span> {selectedReport.message || "-"}</p>
                <p><span className="font-medium">Reported by:</span> {selectedReport.user?.name} ({selectedReport.user?.email})</p>
                <p><span className="font-medium">Status:</span> <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[selectedReport.status]}`}>{selectedReport.status}</span></p>
              </div>

              {/* Action Buttons */}
              {selectedReport.status === "PENDING" || selectedReport.status === "REVIEWED" ? (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => takeAction(selectedReport.id, "BLOCK")}
                    disabled={actioning}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {actioning ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    Block Content
                  </button>
                  <button
                    onClick={() => takeAction(selectedReport.id, "ALLOW")}
                    disabled={actioning}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {actioning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Allow Content
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded text-center text-sm text-muted-foreground">
                  This report has already been resolved
                </div>
              )}

              <button
                onClick={() => setSelectedReport(null)}
                className="w-full px-4 py-2 border border-border rounded hover:bg-accent transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
