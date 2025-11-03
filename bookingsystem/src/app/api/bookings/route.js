import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const route = searchParams.get("route");
    const busNumber = searchParams.get("busNumber");

    // 🧩 Build dynamic filter conditions
    const whereClause = {};

    if (date) {
      // Compare only date part (ignoring time)
      const parsedDate = new Date(date);
      const nextDay = new Date(parsedDate);
      nextDay.setDate(parsedDate.getDate() + 1);

      whereClause.bus = {
        route: {
          date: {
            gte: parsedDate,
            lt: nextDay, // Ensures same calendar date
          },
        },
      };
    }

    if (route) {
      whereClause.bus = {
        ...(whereClause.bus || {}),
        route: {
          ...(whereClause.bus?.route || {}),
          OR: [
            { source: { contains: route, mode: "insensitive" } },
            { destination: { contains: route, mode: "insensitive" } },
          ],
        },
      };
    }

    if (busNumber) {
      whereClause.bus = {
        ...(whereClause.bus || {}),
        busNumber: { contains: busNumber, mode: "insensitive" },
      };
    }

    // ✅ Fetch bookings (filtered or all)
    const bookings = await prisma.booking.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        bus: {
          select: {
            id: true,
            name: true,
            busNumber: true,
            driver: {
              select: {
                id: true,
                name: true,
                licenseNo: true,
              },
            },
            route: {
              select: {
                id: true,
                source: true,
                destination: true,
                date: true,
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // ✅ Format data for frontend
    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      user: b.user,
      bus: b.bus,
      driver: b.bus?.driver,
      route: b.bus?.route,
      seats: b.seats,
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Error fetching bookings", error: error.message },
      { status: 500 }
    );
  }
}
