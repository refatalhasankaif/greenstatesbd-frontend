"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteBlogs } from "@/hooks/useInfiniteBlogs";
import { apiFetch } from "@/lib/apiFetch";
import { post } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BlogSkeleton from "@/components/blog/BlogSkeleton";

export default function BlogsPage() {
    const { blogs, loading, initialLoading, hasMore, loadMore } =
        useInfiniteBlogs();

    const [user, setUser] = useState<{ id: string } | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await apiFetch<{ data: { id: string } }>("/users/me");
                setUser(res.data);
            } catch { }
        };
        loadUser();
    }, []);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 500 &&
            hasMore &&
            !loading
        ) {
            loadMore();
        }
    }, [hasMore, loading, loadMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);


    const handleReport = async (blogId: string) => {
        try {
            await post("/reports", {
                type: "SCAM",
                blogId,
            });
            toast.success("Reported");
        } catch {
            toast.error("Failed");
        }
    };

    return (
        <div className="min-h-screen max-w-3xl mx-auto py-10 px-4 space-y-10">


            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Blogs</h1>

                <Link href="/blogs/create">
                    <Button>Create Blog</Button>
                </Link>
            </div>


            {initialLoading && (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <BlogSkeleton key={i} />
                    ))}
                </div>
            )}


            <div className="space-y-10">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="border rounded-xl p-5 space-y-4"
                    >

                        <div>
                            <p className="font-semibold">
                                {blog.author?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold">
                            {blog.title}
                        </h2>

                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {blog.content}
                        </p>

                        {user && blog.authorId !== user.id && (
                            <div className="flex justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReport(blog.id)}
                                >
                                    Report
                                </Button>
                            </div>
                        )}

                    </div>
                ))}
            </div>


            {loading && !initialLoading && (
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <BlogSkeleton key={i} />
                    ))}
                </div>
            )}


            {!hasMore && !initialLoading && (
                <p className="text-center text-sm text-muted-foreground">
                    No more blogs
                </p>
            )}
        </div>
    );
}