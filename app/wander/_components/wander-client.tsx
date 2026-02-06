"use client";

import { useState, useEffect } from "react";
import { RestaurantCard } from "@/components/ui/restaurant-card";
import { 
  WANDER_WHEN, 
  WANDER_WEATHER, 
  WANDER_SENSE, 
  WANDER_SETTING 
} from "@/lib/constants";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  coverImage?: string | null;
  mood: string;
  menus?: { id: string }[];
  _count?: { courses: number };
}

function FilterSelect({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: readonly { value: string; label: string }[]; 
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent text-charcoal/70 text-sm py-2 pr-6 cursor-pointer focus:outline-none border-b border-stone/30 hover:border-charcoal/30 transition-colors appearance-none"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function WanderClient() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [when, setWhen] = useState("");
  const [weather, setWeather] = useState("");
  const [sense, setSense] = useState("");
  const [setting, setSetting] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams();
        // These filters can be expanded in the API later
        // For now, fetch all and let the filters indicate intent
        const res = await fetch(`/api/explore/restaurants?${params}`);
        const data = await res.json();
        setRestaurants(data ?? []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Client-side filtering based on selected values (future: move to API)
  const filtered = restaurants;

  return (
    <div>
      {/* Filters - language matters */}
      <div className="flex flex-wrap gap-6 mb-12">
        <FilterSelect label="When" value={when} options={WANDER_WHEN} onChange={setWhen} />
        <FilterSelect label="Weather" value={weather} options={WANDER_WEATHER} onChange={setWeather} />
        <FilterSelect label="Sense" value={sense} options={WANDER_SENSE} onChange={setSense} />
        <FilterSelect label="Setting" value={setting} options={WANDER_SETTING} onChange={setSetting} />
      </div>

      {/* Results - no infinite scroll, finite list */}
      {loading ? (
        <div className="py-12 text-charcoal/40">...</div>
      ) : (filtered?.length ?? 0) === 0 ? (
        <div className="py-12">
          <p className="text-charcoal/50">Nothing here yet.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {filtered?.map?.((r) => (
              <RestaurantCard
                key={r?.id}
                name={r?.name ?? ""}
                slug={r?.slug ?? ""}
                location={r?.location ?? ""}
                description={r?.description ?? ""}
                coverImage={r?.coverImage}
                hasMenuToday={(r?.menus?.length ?? 0) > 0}
                courseCount={r?._count?.courses ?? 0}
              />
            )) ?? null}
          </div>
          
          {/* End marker - no infinite scroll */}
          <div className="mt-16 text-center">
            <p className="text-sm text-charcoal/30">That&apos;s enough for now.</p>
          </div>
        </>
      )}
    </div>
  );
}
