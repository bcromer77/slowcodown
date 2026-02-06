import Image from "next/image";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function QRPage({ params }: { params: { slug: string } }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      location: true,
      description: true,
      coverImage: true,
      menus: {
        where: { date: today },
        take: 1,
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const todayMenu = restaurant.menus?.[0];
  const shortDescription = restaurant.description?.split?.(".")?.[0] || "";

  return (
    <div className="h-screen bg-warm-white overflow-hidden flex flex-col">
      <div className="max-w-sm mx-auto px-6 py-6 flex-1 flex flex-col">
        {/* One image */}
        {restaurant.coverImage && (
          <div className="aspect-[3/2] relative bg-stone/20">
            <Image
              src={restaurant.coverImage}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Name */}
        <div className="mt-5">
          <h1 className="font-serif text-xl text-charcoal">{restaurant.name}</h1>
          {shortDescription && (
            <p className="mt-2 text-sm text-charcoal/60">{shortDescription}.</p>
          )}
        </div>

        {/* Today's menu OR poetic absence */}
        <div className="mt-6 flex-1">
          {todayMenu ? (
            <p className="text-sm text-charcoal/70 whitespace-pre-line leading-relaxed">
              {todayMenu.content}
            </p>
          ) : (
            <p className="text-charcoal/40 text-sm italic">
              Today&apos;s menu has passed. Tomorrow will arrive in its own time.
            </p>
          )}
        </div>

        {/* You're done here - small, grey, unstyled */}
        <p className="text-[11px] text-stone-400 mt-auto pb-4">
          You&apos;re done here.
        </p>
      </div>
    </div>
  );
}
