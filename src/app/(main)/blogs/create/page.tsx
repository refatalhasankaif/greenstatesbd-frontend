"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import { post } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Loader2, ArrowLeft, Sparkles, Trash2 } from "lucide-react";

type Blog = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export default function CreateBlogPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        loadMyBlogs();
    }, []);

    const loadMyBlogs = async () => {
        try {
            const res = await apiFetch<{ data: Blog[] }>("/blogs/me");
            setMyBlogs(res.data);
        } catch {
            toast.error("Failed to load blogs");
        } finally {
            setFetching(false);
        }
    };

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title & content required");
            return;
        }

        try {
            setLoading(true);

            await post("/blogs", { title, content });

            toast.success("Blog created");

            setTitle("");
            setContent("");

            loadMyBlogs();
        } catch {
            toast.error("Failed");
        } finally {
            setLoading(false);
        }
    };


    const handleGenerateAI = async () => {
        if (!title.trim()) {
            toast.error("Enter title first");
            return;
        }

        try {
            setLoading(true);

            const res = await post<{ data: string }>("/ai/blog", {
                topic: title,
            });

            setContent(res.data);
            toast.success("Generated with AI");
        } catch {
            toast.error("AI failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiFetch(`/blogs/${id}`, { method: "DELETE" });

            setMyBlogs((prev) => prev.filter((b) => b.id !== id));
            toast.success("Deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen max-w-3xl mx-auto py-10 px-4 space-y-8">

            <Link href="/blogs">
                <Button variant="ghost">
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Blogs
                </Button>
            </Link>

            <div className="border rounded-xl p-5 space-y-4">

                <h1 className="text-xl font-semibold">Create Blog</h1>

                <Input
                    placeholder="Blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                    rows={10}
                    placeholder="Write your content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex gap-2 flex-wrap">

                    <Button onClick={handleCreate} disabled={loading}>
                        {loading && (
                            <Loader2 className="animate-spin mr-2" size={16} />
                        )}
                        Publish
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleGenerateAI}
                        disabled={loading || !title}
                    >
                        <Sparkles size={16} className="mr-2" />
                        Generate with AI
                    </Button>

                </div>
            </div>

            <div className="space-y-4">

                <h2 className="font-semibold">My Blogs</h2>

                {fetching && (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                )}

                {!fetching && myBlogs.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No blogs yet
                    </p>
                )}

                {myBlogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="border rounded-lg p-4 flex justify-between gap-4"
                    >
                        <div>
                            <h3 className="font-medium">{blog.title}</h3>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {blog.content}
                            </p>
                        </div>

                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(blog.id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}