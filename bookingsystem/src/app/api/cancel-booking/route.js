import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("Fetching bookings for userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" }, 
        { status: 400 }
      );
    }

    // Validate userId is a valid number
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { message: "Invalid User ID" }, 
        { status: 400 }
      );
    }

    // Fetch all bookings for the user with related data
    const bookings = await prisma.booking.findMany({
      where: {
        userId: parsedUserId,
      },
      include: {
        bus: {
          include: {
            route: true,
            driver: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${bookings.length} bookings for user ${parsedUserId}`);

    return NextResponse.json({ 
      success: true,
      bookings,
      count: bookings.length 
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        success: false,
        message: "Internal Server Error", 
        error: error.message// Return empty array on error
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client to avoid connection issues
    await prisma.$disconnect();
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId, userId } = body;

    console.log("Cancel booking request:", { bookingId, userId });

    if (!bookingId || !userId) {
      return NextResponse.json(
        { message: "Booking ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find the booking with payment and bus info
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: parseInt(userId),
      },
      include: {
        payment: true,
        bus: true,
      },
    });

    console.log("Found booking:", booking);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    if (booking.payment?.paymentStatus === "REFUNDED") {
      return NextResponse.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Perform all updates/deletes in one transaction:
    await prisma.$transaction(async (tx) => {
      // 1. Update payment to REFUNDED, if payment exists
      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { paymentStatus: "REFUNDED" },
        });
      }

      // 2. Increment back available seats on the bus
      await tx.bus.update({
        where: { id: booking.busId },
        data: {
          availableSeats: {
            increment: booking.seats,
          },
        },
      });

      // 3. Delete the booking record itself
      await tx.booking.delete({
        where: { id: booking.id },
      });
    });

    console.log("Booking cancelled, deleted, and seats restored.");

    return NextResponse.json({
      success: true,
      message: "Booking cancelled, refund initiated, and booking deleted.",
      refundInitiated: true,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal Server Error", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
