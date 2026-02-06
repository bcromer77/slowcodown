export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sense = searchParams.get("sense");
    const season = searchParams.get("season");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const bestEnjoyedWhen = searchParams.get("bestEnjoyedWhen");

    const where: Record<string, unknown> = {};

    if (sense) {
      where.sense = sense;
    }

    if (season) {
      where.season = season;
    }

    if (bestEnjoyedWhen) {
      where.bestEnjoyedWhen = bestEnjoyedWhen;
    }

    if (location) {
      where.restaurant = { location };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { ingredients: { hasSome: [search] } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        restaurant: {
          select: {
            name: true,
            slug: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
