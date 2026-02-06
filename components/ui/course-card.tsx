"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Droplets, Hand, Ear, UtensilsCrossed, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const senseIcons: Record<string, React.ElementType> = {
  TASTE: UtensilsCrossed,
  SMELL: Droplets,
  TEXTURE: Hand,
  SIGHT: Eye,
  SOUND: Ear,
};

const seasonLabels: Record<string, string> = {
  SPRING: "Spring",
  SUMMER: "Summer",
  AUTUMN: "Autumn",
  WINTER: "Winter",
  ALL_YEAR: "All year",
};

interface CourseCardProps {
  name: string;
  description: string;
  photo?: string | null;
  sense: string;
  season: string;
  ingredients?: string[];
  restaurant?: {
    name: string;
    slug: string;
    location: string;
  };
}

export function CourseCard({
  name,
  description,
  photo,
  sense,
  season,
  ingredients = [],
  restaurant,
}: CourseCardProps) {
  const SenseIcon = senseIcons[sense] || UtensilsCrossed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-stone/20 hover:bg-stone/40 transition-colors duration-300"
    >
      <div className="aspect-square relative bg-muted-stone overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SenseIcon size={32} className="text-charcoal/20" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-charcoal">{name}</h3>
        <p className="mt-2 text-sm text-charcoal/70 line-clamp-3">{description}</p>
        
        <div className="mt-4 flex items-center gap-3 text-xs text-charcoal/50">
          <span className="flex items-center gap-1">
            <SenseIcon size={12} />
            {sense?.toLowerCase?.() || "taste"}
          </span>
          <span>{seasonLabels[season] || "All year"}</span>
        </div>

        {(ingredients?.length ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {ingredients?.slice?.(0, 3)?.map?.((ing, i) => (
              <span
                key={i}
                className="text-xs bg-warm-white px-2 py-0.5 text-charcoal/60"
              >
                {ing}
              </span>
            )) ?? null}
            {(ingredients?.length ?? 0) > 3 && (
              <span className="text-xs text-charcoal/40">+{(ingredients?.length ?? 0) - 3}</span>
            )}
          </div>
        )}

        {restaurant && (
          <Link
            href={`/place/${restaurant.slug}`}
            className="mt-4 flex items-center gap-1 text-xs text-charcoal/60 hover:text-charcoal transition-colors"
          >
            <MapPin size={12} />
            <span>{restaurant.name}, {restaurant.location}</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
