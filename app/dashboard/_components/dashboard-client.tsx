"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProfileSection } from "./profile-section";
import { MenuSection } from "./menu-section";
import { CoursesSection } from "./courses-section";
import { QRSection } from "./qr-section";

interface Course {
  id: string;
  name: string;
  description: string;
  photo?: string | null;
  sense: string;
  season: string;
  ingredients: string[];
}

interface Menu {
  id: string;
  date: string;
  content: string;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  coverImage?: string | null;
  mood: string;
  courses: Course[];
  menus: Menu[];
}

type Section = "menu" | "courses" | "profile" | "qr";

export function DashboardClient({ initialRestaurant }: { initialRestaurant: Restaurant }) {
  const [expandedSection, setExpandedSection] = useState<Section>("menu");
  const [restaurant, setRestaurant] = useState<Restaurant>(initialRestaurant);

  const refreshRestaurant = async () => {
    try {
      const res = await fetch("/api/restaurant");
      const data = await res.json();
      if (data && !data.error) {
        setRestaurant(data);
      }
    } catch (err) {
      console.error("Error refreshing restaurant:", err);
    }
  };

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? "menu" : section);
  };

  const SectionHeader = ({ 
    section, 
    label 
  }: { 
    section: Section; 
    label: string;
  }) => {
    const isExpanded = expandedSection === section;
    return (
      <button
        onClick={() => toggleSection(section)}
        className={`w-full flex items-center justify-between py-4 text-left border-b border-stone/20 transition-colors ${
          isExpanded ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal/70"
        }`}
      >
        <span className={`text-sm ${isExpanded ? "font-medium" : ""}`}>{label}</span>
        {isExpanded ? (
          <ChevronDown size={16} className="text-charcoal/40" />
        ) : (
          <ChevronRight size={16} className="text-charcoal/30" />
        )}
      </button>
    );
  };

  return (
    <div className="max-w-2xl">
      {/* Simple header - like opening a notebook */}
      <div className="mb-10">
        <h1 className="font-serif text-2xl text-charcoal">{restaurant?.name || "Your place"}</h1>
      </div>

      {/* Today's Menu - always visible first, expanded by default */}
      <div className="mb-1">
        <SectionHeader section="menu" label="Today's menu" />
        {expandedSection === "menu" && (
          <div className="py-6">
            <MenuSection restaurant={restaurant} onUpdate={refreshRestaurant} />
          </div>
        )}
      </div>

      {/* Courses - collapsed */}
      <div className="mb-1">
        <SectionHeader section="courses" label="Courses" />
        {expandedSection === "courses" && (
          <div className="py-6">
            <CoursesSection restaurant={restaurant} onUpdate={refreshRestaurant} />
          </div>
        )}
      </div>

      {/* Profile - collapsed, less prominent */}
      <div className="mb-1">
        <SectionHeader section="profile" label="About your place" />
        {expandedSection === "profile" && (
          <div className="py-6">
            <ProfileSection restaurant={restaurant} onUpdate={refreshRestaurant} />
          </div>
        )}
      </div>

      {/* QR Code - collapsed, minimal */}
      <div className="mb-1">
        <SectionHeader section="qr" label="QR code" />
        {expandedSection === "qr" && (
          <div className="py-6">
            <QRSection restaurant={restaurant} />
          </div>
        )}
      </div>
    </div>
  );
}
