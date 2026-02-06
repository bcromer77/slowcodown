"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { SENSES, SEASONS, COUNTY_DOWN_LOCATIONS, BEST_ENJOYED_WHEN } from "@/lib/constants";

interface Course {
  id: string;
  name: string;
  description: string;
  photo?: string | null;
  sense: string;
  season: string;
  bestEnjoyedWhen?: string | null;
  ingredients: string[];
  restaurant?: {
    name: string;
    slug: string;
    location: string;
  };
}

export function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sense, setSense] = useState("");
  const [season, setSeason] = useState("");
  const [location, setLocation] = useState("");
  const [bestEnjoyedWhen, setBestEnjoyedWhen] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (sense) params.set("sense", sense);
        if (season) params.set("season", season);
        if (location) params.set("location", location);
        if (bestEnjoyedWhen) params.set("bestEnjoyedWhen", bestEnjoyedWhen);

        const res = await fetch(`/api/explore/courses?${params}`);
        const data = await res.json();
        setCourses(data ?? []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [search, sense, season, location, bestEnjoyedWhen]);

  const filters = [
    {
      name: "Best enjoyed",
      value: bestEnjoyedWhen,
      options: BEST_ENJOYED_WHEN.map((b) => ({ value: b.value, label: b.label })),
      onChange: setBestEnjoyedWhen,
    },
    {
      name: "Sense",
      value: sense,
      options: SENSES.map((s) => ({ value: s.value, label: s.label })),
      onChange: setSense,
    },
    {
      name: "Season",
      value: season,
      options: SEASONS.map((s) => ({ value: s.value, label: s.label })),
      onChange: setSeason,
    },
    {
      name: "Location",
      value: location,
      options: COUNTY_DOWN_LOCATIONS.map((l) => ({ value: l.value, label: l.label })),
      onChange: setLocation,
    },
  ];

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search courses or ingredients..."
            value={search}
            onChange={(e) => setSearch(e?.target?.value ?? "")}
            className="w-full bg-stone/30 text-charcoal px-4 py-3 pl-12 text-sm focus:outline-none focus:bg-stone/50 transition-colors"
          />
        </div>
        <FilterBar filters={filters} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-charcoal/50">Loading...</div>
      ) : (courses?.length ?? 0) === 0 ? (
        <div className="text-center py-12">
          <p className="text-charcoal/50">No courses found.</p>
          <p className="text-sm text-charcoal/40 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map?.((c) => (
            <CourseCard
              key={c?.id}
              name={c?.name ?? ""}
              description={c?.description ?? ""}
              photo={c?.photo}
              sense={c?.sense ?? "TASTE"}
              season={c?.season ?? "ALL_YEAR"}
              ingredients={c?.ingredients ?? []}
              restaurant={c?.restaurant}
            />
          )) ?? null}
        </div>
      )}
    </div>
  );
}
