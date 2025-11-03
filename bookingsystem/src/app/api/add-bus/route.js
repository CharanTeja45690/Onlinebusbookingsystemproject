import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; 

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      busNumber,
      totalSeats,
      availableSeats,
      source,
      destination,
      date,
      driverName,
      licenseNo,
      ownerid,
    } = body;

    // ✅ Validate fields
    if (
      !name ||
      !busNumber ||
      !totalSeats ||
      !availableSeats ||
      !source ||
      !destination ||
      !date ||
      !driverName ||
      !licenseNo
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Create or find the route
    let route = await prisma.route.findFirst({
      where: { source, destination, date: new Date(date) },
    });

    if (!route) {
      route = await prisma.route.create({
        data: {
          source,
          destination,
          date: new Date(date),
        },
      });
    }

    // ✅ Create or find the driver
    let driver = await prisma.driver.findFirst({
      where: { licenseNo },
    });

    if (!driver) {
      driver = await prisma.driver.create({
        data: {
          name: driverName,
          licenseNo,
        },
      });
    }

    // ✅ Check if the bus number already exists
    const existingBus = await prisma.bus.findUnique({
      where: { busNumber },
    });

    if (existingBus) {
      return NextResponse.json(
        { message: "Bus number already exists" },
        { status: 400 }
      );
    }

    // ✅ Create the bus entry
    const newBus = await prisma.bus.create({
      data: {
        name,
        busNumber,
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(availableSeats),
        routeId: route.id,
        driverId: driver.id,
        ownerId: parseInt(ownerid),
      },
      include: {
        route: true,
        driver: true,
      },
    });

    return NextResponse.json(
      {
        message: "Bus added successfully!",
        bus: newBus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding bus:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
