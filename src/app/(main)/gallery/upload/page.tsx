"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    CloudUpload,
    Trash2,
    CheckCircle2,
    Loader2,
    ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { uploadGallery, getMyGallery, deleteGallery } from "@/lib/api/gallery";
import { IGallery } from "@/types/gallery";
import { useMyGallery } from "@/hooks/useGallery";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [dragging, setDragging] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: myImages, loading: imagesLoading } = useMyGallery();
    const [localImages, setLocalImages] = useState<IGallery[] | null>(null);
    const displayedImages = localImages ?? myImages;

    const refreshImages = useCallback(() => {
        getMyGallery()
            .then((res) => setLocalImages(res))
            .catch(() => toast.error("Failed to refresh images"));
    }, []);

    const handleFile = (f: File) => {
        if (!f.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setStatus("idle");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    }, []);

    const handleUpload = async () => {
        if (!file) { toast.warning("Please select an image first"); return; }
        if (!title.trim()) { toast.warning("Please add a title"); return; }
        setStatus("uploading");
        const tid = toast.loading("Uploading…");
        try {
            await uploadGallery(title.trim(), file);
            toast.dismiss(tid);
            toast.success("Uploaded successfully!");
            setFile(null);
            setPreview(null);
            setTitle("");
            setStatus("success");
            refreshImages();
            setTimeout(() => setStatus("idle"), 2500);
        } catch (err: unknown) {
            toast.dismiss(tid);
            toast.error(err instanceof Error ? err.message : "Upload failed");
            setStatus("error");
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const tid = toast.loading("Deleting…");
        try {
            await deleteGallery(id);
            toast.dismiss(tid);
            toast.success("Deleted");
            refreshImages();
        } catch {
            toast.dismiss(tid);
            toast.error("Failed to delete");
        } finally {
            setDeletingId(null);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setStatus("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border">
                <div className="max-w-xl mx-auto px-4 h-11 flex items-center gap-4">
                    <Link
                        href="/gallery"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                    <span className="text-sm font-semibold">Upload Image</span>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-5 space-y-5">
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !file && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-md transition-all duration-200 ${dragging
                        ? "border-primary bg-primary/5"
                        : file
                            ? "border-border"
                            : "border-border hover:border-primary hover:bg-muted/30 cursor-pointer"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(f);
                        }}
                    />

                    {preview ? (
                        <div className="relative">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={800}
                                height={600}
                                className="w-full max-h-96 object-contain rounded-md"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                className="absolute top-3 right-3 bg-black/60 hover:bg-destructive text-white p-1.5 rounded-full transition-colors cursor-pointer"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                            <div className="w-11 h-11 rounded-md bg-muted flex items-center justify-center">
                                <CloudUpload size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Drop image here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, WEBP
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add a title…"
                        value={title}
                        maxLength={80}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpload()}
                        className="flex-1 bg-muted rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition cursor-text"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || !title.trim() || status === "uploading"}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all ${!file || !title.trim() || status === "uploading"
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : status === "success"
                                ? "bg-primary text-primary-foreground cursor-default"
                                : "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                            }`}
                    >
                        {status === "uploading" ? (
                            <><Loader2 size={14} className="animate-spin" />Uploading…</>
                        ) : status === "success" ? (
                            <><CheckCircle2 size={14} />Uploaded!</>
                        ) : (
                            <><CloudUpload size={14} />Upload</>
                        )}
                    </button>
                </div>
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                        My Images
                    </h2>

                    {imagesLoading && !localImages ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-card border border-border rounded-md overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                    </div>
                                    <div className="aspect-4/3 bg-muted animate-pulse w-full" />
                                    <div className="px-4 py-3 flex justify-between">
                                        <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                                        <div className="h-4 w-14 bg-muted animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayedImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                            <ImageOff size={32} strokeWidth={1} />
                            <p className="text-sm">No uploads yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayedImages.map((img) => (
                                <div
                                    key={img.id}
                                    className="bg-card border border-border rounded-md overflow-hidden w-full"
                                >

                                    <div className="relative w-full aspect-4/3 bg-muted">
                                        <Image
                                            src={img.imageUrl}
                                            alt={img.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, 576px"
                                        />
                                    </div>

                                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium truncate">{img.title}</p>
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            disabled={deletingId === img.id}
                                            className="flex items-center gap-1.5 text-xs text-destructive hover:opacity-80 disabled:opacity-40 transition-opacity cursor-pointer disabled:cursor-not-allowed shrink-0 font-medium"
                                        >
                                            {deletingId === img.id ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={13} />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}