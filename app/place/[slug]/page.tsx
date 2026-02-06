import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { MapPin, ArrowLeft, UtensilsCrossed, Droplets, Hand, Eye, Ear } from "lucide-react";
import prisma from "@/lib/db";
import { EDITOR_TAGLINE } from "@/lib/constants";

interface CourseType {
  id: string;
  name: string;
  description: string;
  photo?: string | null;
  sense: string;
  season: string;
  ingredients: string[];
}

interface MenuType {
  id: string;
  date: Date | string;
  content: string;
}

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

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      menus: {
        orderBy: { date: "desc" },
        take: 7,
      },
      courses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMenu = restaurant.menus?.find?.((m: { date: Date | string }) => {
    const menuDate = new Date(m.date);
    menuDate.setHours(0, 0, 0, 0);
    return menuDate.getTime() === today.getTime();
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm-white">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px] bg-stone/30">
          {restaurant.coverImage && (
            <Image
              src={restaurant.coverImage}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-charcoal/30" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-5xl mx-auto">
              <Link
                href="/wander"
                className="inline-flex items-center gap-1 text-sm text-warm-white/80 hover:text-warm-white mb-4 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to wander
              </Link>
              <h1 className="font-serif text-4xl md:text-5xl text-warm-white">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-1 mt-3 text-warm-white/80">
                <MapPin size={16} />
                <span>{restaurant.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="md:col-span-2">
              {restaurant.description && (
                <div className="mb-12">
                  <p className="text-charcoal/80 leading-relaxed">
                    {restaurant.description}
                  </p>
                </div>
              )}

              {/* Today's Menu */}
              <div className="mb-12 bg-stone/20 p-8">
                {todayMenu ? (
                  <>
                    <h2 className="font-serif text-xl text-charcoal mb-4">Today</h2>
                    <p className="text-charcoal/70 whitespace-pre-line">{todayMenu.content}</p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-charcoal/50 italic">Today&apos;s menu has passed.</p>
                    <p className="text-charcoal/40 text-sm mt-1">Tomorrow will arrive in its own time.</p>
                  </div>
                )}
              </div>

              {/* Editorial tagline */}
              <p className="text-xs text-charcoal/40 mb-12">{EDITOR_TAGLINE}</p>

              {/* Courses */}
              {(restaurant.courses?.length ?? 0) > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-charcoal mb-6">Courses</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {restaurant.courses?.map?.((c: CourseType) => {
                      const SenseIcon = senseIcons[c?.sense ?? ""] || UtensilsCrossed;
                      return (
                        <div key={c?.id} className="bg-stone/20">
                          <div className="aspect-[4/3] relative bg-muted-stone overflow-hidden">
                            {c?.photo ? (
                              <Image
                                src={c.photo}
                                alt={c?.name || "Course"}
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
                            <h3 className="font-serif text-lg text-charcoal">{c?.name}</h3>
                            <p className="mt-2 text-sm text-charcoal/70">{c?.description}</p>
                            <div className="mt-4 flex items-center gap-3 text-xs text-charcoal/50">
                              <span className="flex items-center gap-1">
                                <SenseIcon size={12} />
                                {c?.sense?.toLowerCase?.() || "taste"}
                              </span>
                              <span>{seasonLabels[c?.season ?? ""] || "All year"}</span>
                            </div>
                            {(c?.ingredients?.length ?? 0) > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {c?.ingredients?.map?.((ing: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-warm-white px-2 py-0.5 text-charcoal/60"
                                  >
                                    {ing}
                                  </span>
                                )) ?? null}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }) ?? null}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-stone/20 p-6">
                  <h3 className="font-serif text-lg text-charcoal mb-4">Visit</h3>
                  <div className="space-y-2 text-sm text-charcoal/70">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} />
                      {restaurant.location}, County Down
                    </p>
                  </div>
                </div>

                {/* Recent Menus */}
                {(restaurant.menus?.length ?? 0) > 1 && (
                  <div className="bg-stone/10 p-6">
                    <h3 className="font-serif text-lg text-charcoal mb-4">Recent Menus</h3>
                    <div className="space-y-3">
                      {restaurant.menus?.slice?.(0, 5)?.map?.((m: MenuType) => (
                        <div key={m?.id} className="text-sm">
                          <p className="text-charcoal/50 text-xs">
                            {new Date(m?.date)?.toLocaleDateString?.("en-GB", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }) || ""}
                          </p>
                          <p className="text-charcoal/70 line-clamp-2 mt-1">{m?.content}</p>
                        </div>
                      )) ?? null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
