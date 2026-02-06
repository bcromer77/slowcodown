import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { sendSMS } from "@/lib/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { restaurant: true },
    });

    const restaurant = user?.restaurant;

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || message.length > 160) {
      return NextResponse.json({ error: "Message required (max 160 chars)" }, { status: 400 });
    }

    // Get subscribers in this restaurant's location or all subscribers if location matches
    const subscribers = await prisma.textAlertSubscriber.findMany({
      where: {
        active: true,
        OR: [
          { locations: { isEmpty: true } }, // Subscribed to all locations
          { locations: { has: restaurant.location } }, // Subscribed to this location
        ],
      },
    });

    // Format message with restaurant name
    const fullMessage = `${restaurant.name}: ${message}`;

    // Send to all matching subscribers (in batches to avoid rate limits)
    let sentCount = 0;
    for (const sub of subscribers) {
      const result = await sendSMS(sub.phone, fullMessage);
      if (result.success) sentCount++;
      // Small delay between messages
      await new Promise((r) => setTimeout(r, 100));
    }

    // Log the alert
    await prisma.textAlert.create({
      data: {
        message,
        sentBy: restaurant.id,
        sentByName: restaurant.name,
        location: restaurant.location,
        recipientCount: sentCount,
      },
    });

    return NextResponse.json({ success: true, sentCount });
  } catch (error) {
    console.error("Send alert error:", error);
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { restaurant: true },
    });

    const restaurant = user?.restaurant;

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Get recent alerts sent by this restaurant
    const alerts = await prisma.textAlert.findMany({
      where: { sentBy: restaurant.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json({ error: "Failed to get alerts" }, { status: 500 });
  }
}
