/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    MapPin,
    Home,
    Loader2,
    Flag,
    Share2,
    ChevronLeft,
    ChevronRight,
    Gavel,
    X,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import { getPropertyById, placeBid, reportProperty } from "@/lib/api/property";
import { IProperty } from "@/types/property";
import Link from "next/link";
import { getToken } from "@/lib/auth-token";

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    CLOSED: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    HANDED_OVER: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
    SOLD: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
};

const REPORT_TYPES = [
    { value: "FAKE_PROPERTY", label: "Fake Property" },
    { value: "SCAM", label: "Scam" },
    { value: "WRONG_INFO", label: "Wrong Information" },
    { value: "DUPLICATE", label: "Duplicate Listing" },
    { value: "OTHER", label: "Other" },
];

function BidModal({ open, onClose, minBid, onSubmit, loading }: any) {
    const [amount, setAmount] = useState("");
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Gavel size={20} /> Place a Bid</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Minimum Bid</p>
                    <p className="text-lg font-bold">৳{minBid.toLocaleString()}</p>
                </div>
                <input
                    type="number"
                    placeholder={`More than ৳${minBid.toLocaleString()}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={() => { onSubmit(Number(amount)); setAmount(""); }}
                    disabled={loading || !amount}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Gavel size={16} />}
                    {loading ? "Placing..." : "Confirm Bid"}
                </button>
            </div>
        </div>
    );
}

function ReportModal({ open, onClose, onSubmit, loading }: any) {
    const [type, setType] = useState("FAKE_PROPERTY");
    const [message, setMessage] = useState("");
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Flag size={20} /> Report Property</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        {REPORT_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium block mb-2">Additional Notes (optional)</label>
                    <textarea rows={3} placeholder="Provide details..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <button
                    onClick={() => { onSubmit(type, message); setType("FAKE_PROPERTY"); setMessage(""); }}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
                    {loading ? "Submitting..." : "Submit Report"}
                </button>
            </div>
        </div>
    );
}

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const propertyId = params.id as string;
    const token = getToken();

    const [property, setProperty] = useState<IProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBid, setShowBid] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [bidLoading, setBidLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!propertyId) return;

        const fetchProperty = async () => {
            try {
                setLoading(true);
                const data = await getPropertyById(propertyId);
                setProperty(data);
            } catch (error) {
                toast.error("Failed to load property");
                router.push("/properties");
            } finally {
                setLoading(false);
            }
        };


        if (token) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(tokenData.sub || tokenData.id);
            } catch (err) {
                console.error("Failed to parse token", err);
            }
        }

        fetchProperty();
    }, [propertyId, router, token]);

    const handleBid = async (amount: number) => {
        if (!token) {
            toast.info("Please log in to bid");
            router.push("/login");
            return;
        }
        try {
            setBidLoading(true);
            await placeBid(propertyId, amount);
            toast.success("Bid placed successfully!");
            setShowBid(false);
            const data = await getPropertyById(propertyId);
            setProperty(data);
        } catch (err: any) {
            toast.error(err.message || "Failed to place bid");
        } finally {
            setBidLoading(false);
        }
    };

    const handleReport = async (type: string, message: string) => {
        if (!token) {
            toast.info("Please log in to report");
            router.push("/login");
            return;
        }
        try {
            setReportLoading(true);
            await reportProperty(propertyId, type, message);
            toast.success("Report submitted successfully");
            setShowReport(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to submit report");
        } finally {
            setReportLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Property not found</h2>
                    <Link href="/properties" className="text-primary hover:underline flex items-center gap-2 justify-center">
                        <ArrowLeft className="w-4 h-4" />
                        Back to properties
                    </Link>
                </div>
            </div>
        );
    }

    const images = property.images || [];
    const currentImage = images[currentImageIndex]?.url || "/placeholder-property.jpg";
    const minBid = property.currentBid || property.basePrice;
    const isOwner = currentUserId === property.ownerId;
    const canBid = !isOwner && property.status === "ACTIVE";

    return (
        <div className="min-h-screen bg-background">
            <BidModal open={showBid} onClose={() => setShowBid(false)} minBid={minBid} onSubmit={handleBid} loading={bidLoading} />
            <ReportModal open={showReport} onClose={() => setShowReport(false)} onSubmit={handleReport} loading={reportLoading} />

            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 hover:bg-accent rounded-lg transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="flex-1 font-bold truncate text-foreground">{property.title}</h1>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {images.length > 0 && (
                    <div className="space-y-3">
                        <div className="relative aspect-video bg-card rounded-xl overflow-hidden">
                            <Image
                                src={currentImage}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                                onError={(e) => {
                                    console.error('Failed to load property detail image:', currentImage);
                                }}
                            />
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition ${idx === currentImageIndex ? "border-primary" : "border-border hover:border-primary/50"}`}>
                                        <Image
                                            src={img.url}
                                            alt={`Image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                            onError={(e) => {
                                                console.error('Failed to load thumbnail:', img.url);
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_COLORS[property.status]}`}>
                                    {property.status}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="p-2 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setShowReport(true)} className="p-2 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-foreground">{property.title}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{property.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-card rounded-xl p-4 border border-border">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                                <p className="font-semibold text-foreground flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    {property.type}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Location</p>
                                <p className="font-semibold text-foreground">{property.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                                <p className="font-semibold text-foreground">৳{property.basePrice.toLocaleString()}</p>
                            </div>
                            {property.currentBid && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                                    <p className="font-semibold text-primary">৳{property.currentBid.toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-3 text-foreground">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                        </div>

                        {property.address && (
                            <div>
                                <h3 className="text-lg font-bold mb-3 text-foreground">Address</h3>
                                <p className="text-muted-foreground flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    {property.address}
                                </p>
                            </div>
                        )}

                        {(property.biddingStart || property.biddingEnd) && (
                            <div className="bg-card rounded-xl p-4 space-y-3 border border-border">
                                <h3 className="font-bold text-foreground flex items-center gap-2"><Clock size={18} /> Bidding Schedule</h3>
                                <div className="space-y-2">
                                    {property.biddingStart && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Starts At</p>
                                            <p className="text-sm font-semibold text-foreground">{new Date(property.biddingStart).toLocaleString()}</p>
                                        </div>
                                    )}
                                    {property.biddingEnd && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Ends At</p>
                                            <p className="text-sm font-semibold text-foreground">{new Date(property.biddingEnd).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-card rounded-xl p-4 space-y-4 border border-border">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                                <p className="text-3xl font-bold text-primary">৳{property.basePrice.toLocaleString()}</p>
                                {property.currentBid && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Current Bid: ৳{property.currentBid.toLocaleString()}</p>}
                            </div>

                            {isOwner ? (
                                <div className="bg-muted p-3 rounded-lg text-sm text-center">
                                    <p className="text-muted-foreground">This is your property</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowBid(true)}
                                    disabled={!canBid}
                                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${canBid
                                            ? "bg-primary text-primary-foreground hover:opacity-90"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                        }`}
                                >
                                    <Gavel size={16} />
                                    {!canBid && property.status !== "ACTIVE" ? "Not Open for Bidding" : "Place Bid"}
                                </button>
                            )}
                        </div>

                        {property.owner && (
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <p className="text-sm text-muted-foreground mb-3">Listed by</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        {property.owner.profileImage && (
                                            <Image
                                                src={property.owner.profileImage}
                                                alt={property.owner.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    console.error('Failed to load owner profile image:', property.owner.profileImage);
                                                }}
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-foreground">{property.owner.name}</p>
                                            <p className="text-xs text-muted-foreground">Owner</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
