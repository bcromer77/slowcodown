import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendSMS } from "@/lib/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, locations, interests } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Clean phone number - remove spaces, dashes, etc.
    const cleanPhone = phone.replace(/[^+\d]/g, "");
    
    // Check if already subscribed
    const existing = await prisma.textAlertSubscriber.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      // Update preferences if exists
      await prisma.textAlertSubscriber.update({
        where: { id: existing.id },
        data: { 
          active: true, 
          name: name || existing.name, 
          locations: locations || existing.locations,
          interests: interests || existing.interests,
        },
      });
      return NextResponse.json({ success: true, updated: true });
    }

    // Build welcome message based on interests
    const interestList = interests && interests.length > 0 
      ? interests.slice(0, 3).join(", ")
      : "seasonal specials";
    
    const locationList = locations && locations.length > 0
      ? ` in ${locations.slice(0, 2).join(" & ")}`
      : "";

    // Create new subscriber
    await prisma.textAlertSubscriber.create({
      data: {
        phone: cleanPhone,
        name: name || null,
        locations: locations || [],
        interests: interests || [],
      },
    });

    // Send welcome SMS
    await sendSMS(
      cleanPhone,
      `Slow County Down: We'll text you when ${interestList} appears${locationList}. Nothing else. Reply STOP anytime.`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
