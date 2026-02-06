export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        restaurant: {
          include: {
            courses: { orderBy: { createdAt: "desc" } },
            menus: { orderBy: { date: "desc" }, take: 7 },
          },
        },
      },
    });

    if (!user?.restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(user.restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, location, description, coverImage, coverImagePublic, mood } = data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { restaurant: true },
    });

    if (!user?.restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const updated = await prisma.restaurant.update({
      where: { id: user.restaurant.id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(coverImagePublic !== undefined && { coverImagePublic }),
        ...(mood && { mood }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update restaurant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
