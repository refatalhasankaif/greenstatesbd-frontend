"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getToken } from "@/lib/auth-token";
import { Loader2, Search, Eye, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  author?: { name: string };
  images?: { url: string }[];
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (pageNum = 1) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/admin/all?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBlogs(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const togglePublish = async (blogId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogId}/publish`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setBlogs(blogs.map(b => b.id === blogId ? { ...b, isPublished: !currentStatus } : b));
      toast.success(!currentStatus ? "Blog published" : "Blog unpublished");
    } catch {
      toast.error("Failed to update blog");
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setBlogs(blogs.filter(b => b.id !== blogId));
      toast.success("Blog deleted");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const filtered = (Array.isArray(blogs) ? blogs : []).filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search blogs..."
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
                <th className="p-4">Blog</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No blogs found</td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                          {blog.images?.[0]?.url ? (
                            <Image 
                              src={blog.images[0].url} 
                              alt={blog.title} 
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load blog image:', blog.images?.[0]?.url);
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                          )}
                        </div>
                        <p className="font-medium truncate max-w-48">{blog.title}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{blog.author?.name || "Unknown"}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${blog.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublish(blog.id, blog.isPublished)} className="p-2 hover:bg-accent rounded-lg">
                          {blog.isPublished ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                        </button>
                        <Link href={`/blogs/${blog.id}`} className="p-2 hover:bg-accent rounded-lg">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => deleteBlog(blog.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg">
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
