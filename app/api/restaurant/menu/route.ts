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

    const { content, date } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { restaurant: true },
    });

    if (!user?.restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);

    const menu = await prisma.dailyMenu.upsert({
      where: {
        restaurantId_date: {
          restaurantId: user.restaurant.id,
          date: menuDate,
        },
      },
      update: { content },
      create: {
        restaurantId: user.restaurant.id,
        date: menuDate,
        content,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Create menu error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
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

    const menus = await prisma.dailyMenu.findMany({
      where: { restaurantId: user.restaurant.id },
      orderBy: { date: "desc" },
      take: 14,
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("Get menus error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
