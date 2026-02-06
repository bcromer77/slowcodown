export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const mood = searchParams.get("mood");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (location) {
      where.location = location;
    }

    if (mood) {
      where.mood = mood;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        ...where,
        description: { not: "" },
      },
      include: {
        menus: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
