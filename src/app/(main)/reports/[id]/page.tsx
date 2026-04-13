"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-token";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Report {
  id: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  property?: { id: string; title: string };
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setReport(data.data);
      } catch {
        toast.error("Failed to load report");
        router.push("/reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [params.id, router]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      IN_REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;
  if (!report) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/reports" className="flex items-center gap-2 text-primary hover:opacity-80 mb-6">
          <ArrowLeft size={18} /> Back to Reports
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{report.type} Report</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Property: {report.property?.title || "Unknown"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{report.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Report Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">{report.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Submitted</p>
                <p className="font-semibold text-gray-900 dark:text-white">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
