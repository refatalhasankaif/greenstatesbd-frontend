"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createProperty, uploadPropertyImages } from "@/lib/api/property";
import { getToken } from "@/lib/auth-token";
import { ICreatePropertyPayload, Division, PropertyType } from "@/types/property";

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

type FieldErrors = Partial<Record<keyof FormData, string>>;

function validateForm(form: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.title.trim() || form.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!form.description.trim() || form.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!form.basePrice || Number(form.basePrice) <= 0) {
    errors.basePrice = "Enter a valid base price";
  }

  if (!form.location) {
    errors.location = "Select a division";
  }

  if (!form.type) {
    errors.type = "Select a property type";
  }

  return errors;
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const token = getToken();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    basePrice: "",
    location: "",
    address: "",
    type: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">You must be logged in to create a property</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPreviews((prev) => [...prev, evt.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const payload: ICreatePropertyPayload = {
        title: form.title,
        description: form.description,
        basePrice: Number(form.basePrice),
        location: form.location as Division,
        address: form.address || undefined,
        type: form.type as PropertyType,
      };

      const property = await createProperty(payload);

      if (images.length > 0) {
        try {
          await uploadPropertyImages(property.id, images);
          toast.success("Property created successfully!");
        } catch (err) {
          toast.success("Property created successfully!");
        }
      } else {
        toast.success("Property created successfully!");
      }

      router.push(`/properties/${property.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Property</h1>
            <p className="text-muted-foreground mt-1">List your property for bidding on GreenStatesBD</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Beautiful House in Dhaka"
                className={`w-full px-4 py-2.5 rounded border ${
                  errors.title
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.title && <p className="text-xs text-destructive mt-1.5">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your property in detail..."
                rows={5}
                className={`w-full px-4 py-2.5 rounded border ${
                  errors.description
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-vertical`}
              />
              {errors.description && <p className="text-xs text-destructive mt-1.5">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address or street name"
                className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Location & Type Section */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Location & Type</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Division *
              </label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded border ${
                  errors.location
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                <option value="">Select a division</option>
                {DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-destructive mt-1.5">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded border ${
                  errors.type
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-destructive mt-1.5">{errors.type}</p>}
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Base Price</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Base Price (৳) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className={`w-full px-4 py-2.5 rounded border ${
                  errors.basePrice
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.basePrice && <p className="text-xs text-destructive mt-1.5">{errors.basePrice}</p>}
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Property Images</h2>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Click to upload images</p>
                <p className="text-xs text-muted-foreground">Up to 10 images (JPG, PNG)</p>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {images.length}/10 images selected
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Creating Property...
              </span>
            ) : (
              "Create Property"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
