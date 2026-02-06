"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface Menu {
  id: string;
  date: string;
  content: string;
}

interface Restaurant {
  id: string;
  name: string;
  menus: Menu[];
}

export function MenuSection({
  restaurant,
  onUpdate,
}: {
  restaurant: Restaurant;
  onUpdate: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/restaurant/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content }),
      });

      if (res.ok) {
        setMessage("Menu saved successfully");
        setContent("");
        onUpdate();
      } else {
        setMessage("Failed to save menu");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-xl">
        <h2 className="font-serif text-xl text-charcoal mb-6">Add Daily Menu</h2>
        <p className="text-sm text-charcoal/60 mb-6">
          Menus are meant to expire naturally. Add what&apos;s available today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-charcoal/70 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e?.target?.value ?? today)}
              className="bg-stone/30 text-charcoal px-4 py-3 text-sm focus:outline-none focus:bg-stone/50 transition-colors"
            />
          </div>

          <Textarea
            label="Menu"
            value={content}
            onChange={(e) => setContent(e?.target?.value ?? "")}
            rows={6}
            placeholder="Describe today's offerings...\n\nStarter: Oysters from Strangford Lough\nMain: Pan-seared sea bass with samphire\nDessert: Armagh apple tart"
            required
          />

          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <Button type="submit" loading={saving}>
            Save Menu
          </Button>
        </form>
      </div>

      {/* Recent menus */}
      {(restaurant?.menus?.length ?? 0) > 0 && (
        <div>
          <h3 className="font-serif text-lg text-charcoal mb-4">Recent Menus</h3>
          <div className="space-y-4">
            {restaurant?.menus?.map?.((menu) => (
              <div key={menu?.id} className="bg-warm-white p-4">
                <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-2">
                  <Calendar size={14} />
                  {new Date(menu?.date)?.toLocaleDateString?.("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }) || ""}
                </div>
                <p className="text-charcoal/70 whitespace-pre-line text-sm">{menu?.content}</p>
              </div>
            )) ?? null}
          </div>
        </div>
      )}
    </div>
  );
}
