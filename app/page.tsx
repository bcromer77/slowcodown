import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { HeroTagline } from "@/components/ui/hero-tagline";
import { TextAlertSignup } from "@/components/ui/text-alert-signup";
import { Compass, UtensilsCrossed, ArrowRight, Wine, Footprints, Waves, Sparkles } from "lucide-react";
import prisma from "@/lib/db";
import { EDITORS_LETTER, EDITOR_TITLE, EDITOR_ROLE, EDITOR_TAGLINE, EXPERIENCE_CATEGORIES } from "@/lib/constants";

export default async function HomePage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { description: { not: "" } },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { courses: true } },
    },
  });

  const courses = await prisma.course.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: {
        select: { name: true, slug: true, location: true },
      },
    },
  });

  const experiences = await prisma.experience.findMany({
    take: 6,
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero - Nothing else above the fold */}
        <section className="min-h-[90vh] flex items-center justify-center bg-warm-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
              Places chosen by season and sense.
            </h1>
            <HeroTagline />
          </div>
        </section>

        {/* Navigation - below the fold */}
        <section className="bg-warm-white py-16 border-t border-stone/20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/wander"
                className="inline-flex items-center gap-2 bg-charcoal text-warm-white px-6 py-3 hover:bg-charcoal/90 transition-colors"
              >
                <Compass size={18} />
                Wander
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-stone/50 text-charcoal px-6 py-3 hover:bg-stone/70 transition-colors"
              >
                <UtensilsCrossed size={18} />
                Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Editor's Section - Kevin McMahon */}
        <section className="bg-warm-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <div className="relative aspect-[3/4] bg-stone/30 mb-4">
                    <Image
                      src="/kevin-mcmahon.png"
                      alt={EDITOR_TITLE}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="font-serif text-lg text-charcoal">{EDITOR_TITLE}</p>
                  <p className="text-sm text-charcoal/60">{EDITOR_ROLE}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-charcoal/50 mb-6">Editor&apos;s Letter</p>
                <div className="prose prose-charcoal max-w-none">
                  {EDITORS_LETTER.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-charcoal/80 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Categories */}
        <section className="bg-stone/20 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-charcoal">Beyond the table</h2>
              <p className="mt-3 text-charcoal/60">County Down isn&apos;t just about food</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EXPERIENCE_CATEGORIES.slice(0, 4).map((cat) => {
                const Icon = cat.value === 'DRINKS' ? Wine : 
                             cat.value === 'WALKS' ? Footprints :
                             cat.value === 'SEA' ? Waves : Sparkles;
                return (
                  <Link 
                    key={cat.value} 
                    href={`/wander?category=${cat.value}`}
                    className="bg-warm-white p-6 hover:bg-stone/30 transition-colors group"
                  >
                    <Icon size={24} className="text-charcoal/40 group-hover:text-charcoal transition-colors" />
                    <h3 className="font-serif text-lg text-charcoal mt-4">{cat.label}</h3>
                    <p className="text-sm text-charcoal/50 mt-1">{cat.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Places to stay awhile */}
        {(restaurants?.length ?? 0) > 0 && (
          <section className="bg-warm-white py-24">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="font-serif text-3xl text-charcoal">Places to stay awhile</h2>
                  <p className="mt-2 text-charcoal/60">Restaurants across County Down</p>
                </div>
                <Link
                  href="/wander"
                  className="text-sm text-charcoal/70 hover:text-charcoal transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {restaurants?.map?.((r: { id: string; name: string; slug: string; location: string; coverImage?: string | null; _count?: { courses: number } }) => (
                  <Link key={r?.id} href={`/place/${r?.slug}`} className="group">
                    <div className="bg-stone/20 hover:bg-stone/30 transition-colors">
                      <div className="aspect-[4/3] relative bg-muted-stone overflow-hidden">
                        {r?.coverImage ? (
                          <Image
                            src={r.coverImage}
                            alt={r?.name || "Restaurant"}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-serif text-2xl text-charcoal/20">{r?.name?.[0] || "?"}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-lg text-charcoal">{r?.name}</h3>
                        <p className="text-sm text-charcoal/60 mt-1">{r?.location}</p>
                      </div>
                    </div>
                  </Link>
                )) ?? null}
              </div>
            </div>
          </section>
        )}

        {/* Courses worth lingering over */}
        {(courses?.length ?? 0) > 0 && (
          <section className="bg-stone/20 py-24">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="font-serif text-3xl text-charcoal">Courses worth lingering over</h2>
                  <p className="mt-2 text-charcoal/60">Dishes as artefacts</p>
                </div>
                <Link
                  href="/courses"
                  className="text-sm text-charcoal/70 hover:text-charcoal transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {courses?.map?.((c: { id: string; name: string; photo?: string | null; restaurant?: { name: string; slug: string; location: string } | null }) => (
                  <div key={c?.id} className="bg-warm-white">
                    <div className="aspect-square relative bg-muted-stone overflow-hidden">
                      {c?.photo ? (
                        <Image
                          src={c.photo}
                          alt={c?.name || "Course"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-xl text-charcoal/20">{c?.name?.[0] || "?"}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-charcoal">{c?.name}</h3>
                      <Link
                        href={`/place/${c?.restaurant?.slug}`}
                        className="text-xs text-charcoal/50 hover:text-charcoal/70 transition-colors"
                      >
                        {c?.restaurant?.name}
                      </Link>
                    </div>
                  </div>
                )) ?? null}
              </div>
            </div>
          </section>
        )}

        {/* Text Alerts */}
        <section className="bg-warm-white py-16 border-t border-stone/20">
          <div className="max-w-3xl mx-auto px-6">
            <TextAlertSignup />
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="bg-charcoal text-warm-white py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-sm text-warm-white/50">{EDITOR_TAGLINE}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
