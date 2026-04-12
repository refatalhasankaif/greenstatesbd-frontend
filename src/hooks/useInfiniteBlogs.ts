import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { IBlog } from "@/types/blog";

export const useInfiniteBlogs = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);

            const res = await apiFetch<{
                data: {
                    data: IBlog[];
                    meta: { totalPage: number };
                };
            }>(`/blogs?page=${page}&limit=5`);

            const newBlogs = res.data.data;

            setBlogs((prev) => {
                const map = new Map<string, IBlog>();
                [...prev, ...newBlogs].forEach((b) => map.set(b.id, b));
                return Array.from(map.values());
            });

            setPage((prev) => prev + 1);

            if (page >= res.data.meta.totalPage) {
                setHasMore(false);
            }

        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        blogs,
        loading,
        initialLoading,
        hasMore,
        loadMore,
    };
};