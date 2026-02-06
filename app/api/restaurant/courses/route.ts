export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, photo, photoPublic, sense, season, bestEnjoyedWhen, dateServed, ingredients } = data;

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    if (description.length > 300) {
      return NextResponse.json({ error: "Description must be 300 characters or less" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { restaurant: true },
    });

    if (!user?.restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const course = await prisma.course.create({
      data: {
        restaurantId: user.restaurant.id,
        name,
        description,
        photo: photo || null,
        photoPublic: photoPublic ?? true,
        sense: sense || "TASTE",
        season: season || "ALL_YEAR",
        bestEnjoyedWhen: bestEnjoyedWhen || null,
        dateServed: dateServed ? new Date(dateServed) : null,
        ingredients: ingredients || [],
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { restaurant: true },
    });

    if (!user?.restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const courses = await prisma.course.findMany({
      where: { restaurantId: user.restaurant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
