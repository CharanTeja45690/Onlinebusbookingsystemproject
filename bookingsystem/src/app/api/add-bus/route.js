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
      price,
      ownerid,
    } = body;
// console.log(ownerid);

    // Validate all required fields
    if (
      !name || !busNumber || !totalSeats || !availableSeats ||
      !source || !destination || !date || !driverName || !licenseNo || !price || !ownerid
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate number fields
    const parsedTotalSeats = parseInt(totalSeats);
    const parsedAvailableSeats = parseInt(availableSeats);
    const parsedOwnerId = parseInt(ownerid);
    const parsedPrice = parseFloat(price);

    if (
      isNaN(parsedTotalSeats) ||
      isNaN(parsedAvailableSeats) ||
      isNaN(parsedOwnerId) ||
      isNaN(parsedPrice)
    ) {
      return NextResponse.json(
        { message: "Seats, price, and owner ID must be valid numbers" },
        { status: 400 }
      );
    }

    // ✅ Check that owner user exists
    const existingOwner = await prisma.user.findUnique({
      where: { id: parsedOwnerId },
    });
    if (!existingOwner) {
      return NextResponse.json(
        { message: "No such owner (user) exists. Please login again or register the owner user." },
        { status: 404 }
      );
    }

    // Create or find route
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

    // Create or find the driver by license number
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

    // Check if the bus number already exists
    const existingBus = await prisma.bus.findUnique({
      where: { busNumber },
    });
    if (existingBus) {
      return NextResponse.json(
        { message: "Bus number already exists" },
        { status: 400 }
      );
    }

    // Create the bus entry
    const newBus = await prisma.bus.create({
      data: {
        name,
        busNumber,
        totalSeats: parsedTotalSeats,
        availableSeats: parsedAvailableSeats,
        routeId: route.id,
        driverId: driver.id,
        ownerId: parsedOwnerId,
        price: parsedPrice,
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
    // Add extra logging for debugging
    if (error.code === "P2003") { // Prisma foreign key constraint violation
      return NextResponse.json(
        { message: "Owner ID is invalid. Please make sure the user exists.", error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
