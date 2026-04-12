"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Flag, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getGallery, likeGallery } from "@/lib/api/gallery";
import { getToken } from "@/lib/auth-token";
import { IGallery } from "@/types/gallery";

const LIKED_KEY = "gallery_liked_ids";
const PAGE_LIMIT = 9;

function getLikedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveLikedIds(ids: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden w-full">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-28 bg-muted animate-pulse rounded" />
          <div className="h-2.5 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="w-full aspect-4/3 bg-muted animate-pulse" />
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-10 bg-muted animate-pulse rounded" />
          <div className="h-4 w-6 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [data, setData] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => getLikedIds());

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await getGallery(pageRef.current, PAGE_LIMIT);
      setData((prev) =>
        pageRef.current === 1 ? res.data : [...prev, ...res.data]
      );
      hasMoreRef.current = pageRef.current < res.meta.totalPage;
      setHasMore(hasMoreRef.current);
      pageRef.current += 1;
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const requireAuth = useCallback(() => {
    if (!getToken()) {
      toast.info("Please log in to continue");
      router.push("/login");
      return false;
    }
    return true;
  }, [router]);

  const handleLike = useCallback(
    async (id: string) => {
      if (!requireAuth()) return;
      if (likedIds.has(id)) {
        toast.info("Already liked");
        return;
      }

      const next = new Set(likedIds).add(id);
      setLikedIds(next);
      saveLikedIds(next);

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, likesCount: item.likesCount + 1 }
            : item
        )
      );

      try {
        const result = await likeGallery(id);
        if (result?.likesCount !== undefined) {
          setData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, likesCount: result.likesCount }
                : item
            )
          );
        }
        toast.success("Liked!");
      } catch {
        const rollback = new Set(likedIds);
        rollback.delete(id);
        setLikedIds(rollback);
        saveLikedIds(rollback);
        setData((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, likesCount: item.likesCount - 1 }
              : item
          )
        );
        toast.error("Failed to like. Try again.");
      }
    },
    [likedIds, requireAuth]
  );

  const handleReport = useCallback(() => {
    if (!requireAuth()) return;
    toast.info("Report submitted");
  }, [requireAuth]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-xl mx-auto px-4 h-11 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-wide uppercase">
            Gallery
          </span>
          <Link
            href="/gallery/upload"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            <Plus size={17} />
            Upload
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-0 sm:px-4 py-4 space-y-4">
        {loading && data.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                liked={likedIds.has(item.id)}
                onLike={handleLike}
                onReport={handleReport}
              />
            ))}

        <div ref={sentinelRef} className="flex items-center justify-center py-6">
          {loading && data.length > 0 && (
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          )}
          {!hasMore && data.length > 0 && (
            <p className="text-xs text-muted-foreground">
              You&apos;ve seen it all
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function FeedCard({
  item,
  liked,
  onLike,
  onReport,
}: {
  item: IGallery;
  liked: boolean;
  onLike: (id: string) => void;
  onReport: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden w-full">
      <div className="flex items-center gap-3 px-4 py-3">
        {item.user.profileImage ? (
          <Image
            src={item.user.profileImage}
            alt={item.user.name}
            width={36}
            height={36}
            className="rounded-full shrink-0 ring-1 ring-border object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm text-primary-foreground font-semibold shrink-0">
            {item.user.name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold leading-tight">{item.user.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="relative w-full aspect-4/3 bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 576px"
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium truncate">{item.title}</p>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onLike(item.id)}
            disabled={liked}
            className={`hidden items-center gap-1.5 transition-colors ${
              liked
                ? "text-rose-500 cursor-default"
                : "text-muted-foreground hover:text-rose-500 cursor-pointer"
            }`}
            aria-label="Like"
          >
            <Heart
              size={18}
              fill={liked ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
            <span className="text-xs font-semibold tabular-nums">
              {item.likesCount}
            </span>
          </button>

          <button
            onClick={onReport}
            className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            aria-label="Report"
          >
            <Flag size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}