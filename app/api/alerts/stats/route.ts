import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subscriberCount = await prisma.textAlertSubscriber.count({
      where: { active: true },
    });

    return NextResponse.json({ subscriberCount });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ subscriberCount: 0 });
  }
}
