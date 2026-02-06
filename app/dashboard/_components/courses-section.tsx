"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X, Trash2 } from "lucide-react";
import { SENSES, SEASONS, BEST_ENJOYED_WHEN } from "@/lib/constants";

interface Course {
  id: string;
  name: string;
  description: string;
  photo?: string | null;
  sense: string;
  season: string;
  bestEnjoyedWhen?: string | null;
  ingredients: string[];
}

interface Restaurant {
  id: string;
  name: string;
  courses: Course[];
}

export function CoursesSection({
  restaurant,
  onUpdate,
}: {
  restaurant: Restaurant;
  onUpdate: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [sense, setSense] = useState("TASTE");
  const [season, setSeason] = useState("ALL_YEAR");
  const [bestEnjoyedWhen, setBestEnjoyedWhen] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
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

      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get("X-Amz-SignedHeaders") || "";
      const includesContentDisposition = signedHeaders.includes("content-disposition");

      const headers: Record<string, string> = { "Content-Type": file.type };
      if (includesContentDisposition) {
        headers["Content-Disposition"] = "attachment";
      }

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers,
      });

      const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "";
      const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
      const publicUrl = `https://lh7-us.googleusercontent.com/docsz/AD_4nXeRjH_ipSbCIfJCgfHgHDB68qoV5pHmpy9VNNiauYlFYvZDnWdTS2bk2ldNIRBM9wJc_FjeES1n2DWjVW3swOiwNLnfOuiTEOlnlbcBNBnFWHtfP__79UBcjV4Oz7QGPqCiGyxuLAYgSC57cj8kC1hMqvM?key=4wpSYsNmp0F9VmZgnd5rKA`;
      
      setPhoto(publicUrl);
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

    if (description.length > 300) {
      setMessage("Description must be 300 characters or less");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/restaurant/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          photo: photo || null,
          photoPublic: true,
          sense,
          season,
          bestEnjoyedWhen: bestEnjoyedWhen || null,
          ingredients: ingredients?.split?.(",")?.map?.((i) => i?.trim?.())?.filter?.(Boolean) ?? [],
        }),
      });

      if (res.ok) {
        setMessage("Course added successfully");
        setName("");
        setDescription("");
        setPhoto("");
        setSense("TASTE");
        setSeason("ALL_YEAR");
        setBestEnjoyedWhen("");
        setIngredients("");
        onUpdate();
      } else {
        const data = await res.json();
        setMessage(data?.error || "Failed to add course");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await fetch(`/api/restaurant/courses/${id}`, { method: "DELETE" });
      onUpdate();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const senseOptions = SENSES.map((s) => ({ value: s.value, label: s.label }));
  const seasonOptions = SEASONS.map((s) => ({ value: s.value, label: s.label }));
  const bestEnjoyedOptions = [{ value: "", label: "Select..." }, ...BEST_ENJOYED_WHEN.map((b) => ({ value: b.value, label: b.label }))];

  return (
    <div className="space-y-8">
      <div className="max-w-xl">
        <h2 className="font-serif text-xl text-charcoal mb-6">Add Course</h2>
        <p className="text-sm text-charcoal/60 mb-6">
          Courses are artifacts—standalone dishes that represent your craft.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e?.target?.value ?? "")}
            placeholder="e.g., Pan-seared Strangford Scallops"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e?.target?.value ?? "")}
            rows={3}
            maxLength={300}
            charCount={description?.length ?? 0}
            maxChars={300}
            placeholder="A brief description of the dish..."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Dominant Sense"
              value={sense}
              onChange={(e) => setSense(e?.target?.value ?? "TASTE")}
              options={senseOptions}
            />
            <Select
              label="Season"
              value={season}
              onChange={(e) => setSeason(e?.target?.value ?? "ALL_YEAR")}
              options={seasonOptions}
            />
          </div>

          <Select
            label="⏱ Best enjoyed when"
            value={bestEnjoyedWhen}
            onChange={(e) => setBestEnjoyedWhen(e?.target?.value ?? "")}
            options={bestEnjoyedOptions}
          />

          <Input
            label="Ingredients/Origin Tags (comma-separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e?.target?.value ?? "")}
            placeholder="Strangford Lough, local scallops, samphire"
          />

          {/* Photo Upload */}
          <div>
            <label className="block text-sm text-charcoal/70 mb-2">Photo</label>
            {photo ? (
              <div className="relative aspect-square w-40 bg-stone/30">
                <Image src={photo} alt="Course" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="absolute top-2 right-2 p-1 bg-charcoal text-warm-white hover:bg-charcoal/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-40 h-40 bg-stone/30 cursor-pointer hover:bg-stone/40 transition-colors">
                <Upload size={20} className="text-charcoal/40" />
                <span className="mt-2 text-xs text-charcoal/50">
                  {uploading ? "Uploading..." : "Upload"}
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
            Add Course
          </Button>
        </form>
      </div>

      {/* Existing courses */}
      {(restaurant?.courses?.length ?? 0) > 0 && (
        <div>
          <h3 className="font-serif text-lg text-charcoal mb-4">Your Courses</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant?.courses?.map?.((course) => (
              <div key={course?.id} className="bg-warm-white p-4 relative group">
                {course?.photo && (
                  <div className="aspect-square relative bg-stone/30 mb-3">
                    <Image src={course.photo} alt={course?.name || ""} fill className="object-cover" />
                  </div>
                )}
                <h4 className="font-serif text-charcoal">{course?.name}</h4>
                <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">{course?.description}</p>
                <div className="flex gap-2 text-xs text-charcoal/40 mt-2">
                  <span>{course?.sense?.toLowerCase?.()}</span>
                  <span>·</span>
                  <span>{course?.season?.toLowerCase?.()?.replace?.("_", " ")}</span>
                </div>
                <button
                  onClick={() => handleDelete(course?.id)}
                  className="absolute top-2 right-2 p-1 bg-warm-white/80 text-charcoal/50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )) ?? null}
          </div>
        </div>
      )}
    </div>
  );
}
