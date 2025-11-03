import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, busId, seats } = await req.json();

    if (!userId || !busId || !seats) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // 1️⃣ Fetch user and bus details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { email: true, name: true },
    });

    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(busId) },
      include: { driver: true, route: true },
    });

    if (!user || !bus) {
      return NextResponse.json({ message: "User or bus not found" }, { status: 404 });
    }

    // 2️⃣ Check available seats
    if (bus.availableSeats < seats) {
      return NextResponse.json({ message: "Not enough seats available" }, { status: 400 });
    }

    // 3️⃣ Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        busId: parseInt(busId),
        seats: parseInt(seats),
      },
    });

    // 4️⃣ Update available seats
    const updatedBus = await prisma.bus.update({
      where: { id: parseInt(busId) },
      data: { availableSeats: bus.availableSeats - parseInt(seats) },
    });

    // 5️⃣ Delete bus if seats are 0
    if (updatedBus.availableSeats === 0) {
      await prisma.bus.delete({ where: { id: parseInt(busId) } });
      console.log(`🚌 Bus ${busId} deleted (no seats left)`);
    }

    // 6️⃣ Return detailed response
    return NextResponse.json({
      message: "Booking successful",
      booking,
      userEmail: user.email,
      userName: user.name,
      driverEmail: bus.driver.email,
      driverName: bus.driver.name,
      busName: bus.name,
      route: bus.route,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
