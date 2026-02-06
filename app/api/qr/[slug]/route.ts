export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
      select: {
        name: true,
        location: true,
        description: true,
        coverImage: true,
        coverImagePublic: true,
        menus: {
          where: {
            date: today,
          },
          take: 1,
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description?.split(".")?.[0] || "",
      coverImage: restaurant.coverImage,
      todayMenu: restaurant.menus?.[0]?.content || null,
    });
  } catch (error) {
    console.error("QR data error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
