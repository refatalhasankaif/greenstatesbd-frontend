"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getPropertyById, updateProperty, uploadPropertyImages } from "@/lib/api/property";
import { getToken } from "@/lib/auth-token";
import { IProperty, Division, PropertyType } from "@/types/property";

const DIVISIONS: Division[] = [
  "DHAKA", "CHITTAGONG", "KHULNA", "RAJSHAHI", "SYLHET", "BARISAL", "RANGPUR", "MYMENSINGH",
];

const PROPERTY_TYPES: PropertyType[] = ["APARTMENT", "LAND", "HOUSE", "COMMERCIAL"];

type FormData = {
  title: string;
  description: string;
  basePrice: string;
  location: Division | "";
  address: string;
  type: PropertyType | "";
};

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const token = getToken();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    title: "", description: "", basePrice: "", location: "", address: "", type: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!propertyId || !token) {
      router.push("/login");
      return;
    }

    getPropertyById(propertyId)
      .then((data) => {
        setProperty(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          basePrice: String(data.basePrice || ""),
          location: data.location || "",
          address: data.address || "",
          type: data.type || "",
        });
        if (data.images) {
          setPreviews(data.images.map((img) => img.url));
        }
      })
      .catch(() => {
        toast.error("Failed to load property");
        router.push("/my-properties");
      })
      .finally(() => setLoading(false));
  }, [propertyId, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => setPreviews((prev) => [...prev, evt.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (index < (property?.images?.length || 0)) {
      return;
    }
    const newIndex = index - (property?.images?.length || 0);
    setImages((prev) => prev.filter((_, i) => i !== newIndex));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.basePrice || !form.location || !form.type) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      await updateProperty(propertyId, {
        title: form.title,
        description: form.description,
        basePrice: Number(form.basePrice),
        location: form.location as Division,
        address: form.address || undefined,
        type: form.type as PropertyType,

      });
      toast.success("Property updated!");

      if (images.length > 0) {
        try {
          await uploadPropertyImages(propertyId, images);
          toast.success("Images uploaded!");
        } catch {
          toast.warning("Property updated but image upload failed");
        }
      }

      router.push(`/properties/${propertyId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-accent rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
            <p className="text-muted-foreground mt-1">Update your property details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Property Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type *</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground">
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Division *</label>
                <select name="location" value={form.location} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground">
                  <option value="">Select Division</option>
                  {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Base Price (৳) *</label>
              <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Images</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" id="edit-image-input" />
              <label htmlFor="edit-image-input" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Add more images</p>
              </label>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition">
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()}
              className="flex-1 px-6 py-2.5 rounded-lg border border-border hover:bg-accent transition text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}