export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, restaurantName } = await req.json();

    if (!email || !password || !restaurantName) {
      return NextResponse.json(
        { error: "Email, password, and restaurant name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique slug
    let slug = slugify(restaurantName);
    let slugExists = await prisma.restaurant.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(restaurantName)}-${counter}`;
      slugExists = await prisma.restaurant.findUnique({ where: { slug } });
      counter++;
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        restaurant: {
          create: {
            name: restaurantName,
            slug,
            location: "County Down",
            description: "",
          },
        },
      },
      include: {
        restaurant: true,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      restaurantId: user.restaurant?.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
