"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  name: string;
  slug: string;
  location: string;
  description: string;
  coverImage?: string | null;
  hasMenuToday?: boolean;
  courseCount?: number;
}

export function RestaurantCard({
  name,
  slug,
  location,
  description,
  coverImage,
  hasMenuToday,
  courseCount = 0,
}: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/place/${slug}`} className="block group">
        <div className="bg-stone/30 hover:bg-stone/50 transition-colors duration-300">
          <div className="aspect-[4/3] relative bg-muted-stone overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={name}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-2xl text-charcoal/20">{name?.[0] || "?"}</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-serif text-xl text-charcoal">{name}</h3>
            <div className="flex items-center gap-1 mt-2 text-sm text-charcoal/60">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
            {description && (
              <p className="mt-3 text-sm text-charcoal/70 line-clamp-2">
                {description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4 text-xs text-charcoal/50">
              {hasMenuToday && <span className="text-charcoal/70">Menu today</span>}
              {courseCount > 0 && <span>{courseCount} courses</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
