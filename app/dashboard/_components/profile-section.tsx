"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { COUNTY_DOWN_LOCATIONS, MOODS } from "@/lib/constants";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  coverImage?: string | null;
  mood: string;
}

export function ProfileSection({
  restaurant,
  onUpdate,
}: {
  restaurant: Restaurant;
  onUpdate: () => void;
}) {
  const [name, setName] = useState(restaurant?.name ?? "");
  const [location, setLocation] = useState(restaurant?.location ?? "County Down");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [mood, setMood] = useState(restaurant?.mood ?? "QUIET");
  const [coverImage, setCoverImage] = useState(restaurant?.coverImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get presigned URL
      const presignRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true,
        }),
      });

      const { uploadUrl, cloud_storage_path } = await presignRes.json();

      // Check if content-disposition is in signed headers
      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get("X-Amz-SignedHeaders") || "";
      const includesContentDisposition = signedHeaders.includes("content-disposition");

      // Upload to S3
      const headers: Record<string, string> = { "Content-Type": file.type };
      if (includesContentDisposition) {
        headers["Content-Disposition"] = "attachment";
      }

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers,
      });

      // Get public URL
      const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "";
      const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
      const publicUrl = `https://lh7-us.googleusercontent.com/cvLYd3lEzI_Wjxn2dTD2D-CVvRTIu0xLif6omeNWc9VV9jf-ECbzqZVfAs9DJ9h5dUwbVIbL3vuYPiUHVJv1OGTxtRvaphdfQiIFMQ_Hgn5ODyYPj_g9Hb2Z3KjDqioU0ixjYGWFL4kd6LxfBJfPNHA`;
      
      setCoverImage(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          description,
          mood,
          coverImage: coverImage || null,
          coverImagePublic: true,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully");
        onUpdate();
      } else {
        setMessage("Failed to update profile");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const locationOptions = COUNTY_DOWN_LOCATIONS.map((l) => ({ value: l.value, label: l.label }));
  const moodOptions = MOODS.map((m) => ({ value: m.value, label: m.label }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="font-serif text-xl text-charcoal">Restaurant Profile</h2>

      <Input
        label="Restaurant Name"
        value={name}
        onChange={(e) => setName(e?.target?.value ?? "")}
        required
      />

      <Select
        label="Location"
        value={location}
        onChange={(e) => setLocation(e?.target?.value ?? "")}
        options={locationOptions}
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e?.target?.value ?? "")}
        rows={4}
        placeholder="Tell visitors about your place..."
      />

      <Select
        label="Mood"
        value={mood}
        onChange={(e) => setMood(e?.target?.value ?? "")}
        options={moodOptions}
      />

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-charcoal/70 mb-2">Cover Image</label>
        {coverImage ? (
          <div className="relative aspect-video bg-stone/30">
            <Image src={coverImage} alt="Cover" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 p-1 bg-charcoal text-warm-white hover:bg-charcoal/80"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-40 bg-stone/30 cursor-pointer hover:bg-stone/40 transition-colors">
            <Upload size={24} className="text-charcoal/40" />
            <span className="mt-2 text-sm text-charcoal/50">
              {uploading ? "Uploading..." : "Click to upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <Button type="submit" loading={saving}>
        Save Profile
      </Button>
    </form>
  );
}
