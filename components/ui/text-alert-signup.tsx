"use client";

import { useState } from "react";
import { COUNTY_DOWN_LOCATIONS } from "@/lib/constants";

const FOOD_INTERESTS = [
  "Scallops",
  "Oysters",
  "Lobster",
  "Crab",
  "Mussels",
  "Trout",
  "Salmon",
  "Lamb",
  "Venison",
  "Cheese",
];

export function TextAlertSignup() {
  const [phone, setPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [expanded, setExpanded] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!phone) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          interests: selectedInterests,
          locations: selectedLocation ? [selectedLocation] : [],
        }),
      });
      
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-charcoal/70 text-sm">Done. We'll be in touch.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left text-charcoal/50 hover:text-charcoal/70 transition-colors text-sm"
        >
          Text me when something good appears →
        </button>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-charcoal/60">
            Tell us what you're looking for. We'll text you when it shows up.
          </p>

          {/* Food interests */}
          <div>
            <p className="text-xs text-charcoal/40 mb-3">What interests you?</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 text-sm border transition-colors ${
                    selectedInterests.includes(interest)
                      ? "border-charcoal bg-charcoal text-warm-white"
                      : "border-stone/40 text-charcoal/60 hover:border-charcoal/40"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs text-charcoal/40 mb-3">Where? (optional)</p>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-b border-stone/40 text-charcoal text-sm focus:outline-none focus:border-charcoal/60"
            >
              <option value="">Anywhere in County Down</option>
              {COUNTY_DOWN_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full px-3 py-2 bg-transparent border-b border-stone/40 text-charcoal text-sm focus:outline-none focus:border-charcoal/60 placeholder:text-charcoal/30"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded(false)}
              className="text-xs text-charcoal/40 hover:text-charcoal/60"
            >
              Never mind
            </button>
            <button
              onClick={handleSubmit}
              disabled={!phone || status === "loading"}
              className="px-4 py-2 bg-charcoal text-warm-white text-sm hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "loading" ? "..." : "Let me know"}
            </button>
          </div>

          {status === "error" && (
            <p className="text-xs text-red-600">Something went wrong. Try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
