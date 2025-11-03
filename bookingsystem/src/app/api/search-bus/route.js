import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { source, destination, date } = await req.json();

    if (!source || !destination || !date) {
      return NextResponse.json(
        { message: "Source, destination, and date are required." },
        { status: 400 }
      );
    }

    // Convert input date to Date object (ignore time)
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // Fetch buses that match the search filters
    const buses = await prisma.bus.findMany({
      where: {
        route: {
          source: {
            equals: source,
            mode: "insensitive", 
          },
          destination: {
            equals: destination,
            mode: "insensitive",
          },
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      },
      include: {
        route: true,
        driver: true,
      },
    });

    if (!buses || buses.length === 0) {
      return NextResponse.json({ buses: [] }, { status: 200 });
    }

    return NextResponse.json({ buses }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Server error during search." },
      { status: 500 }
    );
  }
}
