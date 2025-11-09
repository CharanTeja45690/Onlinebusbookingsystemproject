import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, busId, seats, price, paymentMode, paymentDetails } = await req.json();

    // Validation
    if (!userId || !busId || !seats || !price || !paymentMode) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Validate payment details based on payment mode
    if (paymentMode === 'UPI' && !paymentDetails?.upiId) {
      return NextResponse.json({ message: "UPI ID is required" }, { status: 400 });
    }
    if ((paymentMode === 'CREDIT_CARD' || paymentMode === 'DEBIT_CARD') && !paymentDetails?.cardNumber) {
      return NextResponse.json({ message: "Card number is required" }, { status: 400 });
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

    // 3️⃣ Calculate total amount
    const totalAmount = bus.price * parseInt(seats);

    // Verify price matches
    if (Math.abs(totalAmount - parseFloat(price)) > 0.01) {
      return NextResponse.json({ message: "Price mismatch" }, { status: 400 });
    }

    // 4️⃣ Create booking and payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: parseInt(userId),
          busId: parseInt(busId),
          seats: parseInt(seats),
          price: totalAmount,
        },
      });

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          userId: parseInt(userId),
          amount: totalAmount,
          paymentMode: paymentMode,
          paymentStatus: 'COMPLETED', // Simulate successful payment
          paymentDate: new Date(),
          // transactionId is auto-generated via @default(cuid())
        },
      });

      // Update available seats
      const updatedBus = await tx.bus.update({
        where: { id: parseInt(busId) },
        data: { availableSeats: bus.availableSeats - parseInt(seats) },
      });

    

      return { booking, payment, updatedBus };
    });

    // 5️⃣ Return detailed response
    return NextResponse.json({
      message: "Booking successful",
      booking: result.booking,
      payment: result.payment,
      userEmail: user.email,
      userName: user.name,
      driverName: bus.driver.name,
      busName: bus.name,
      route: bus.route,
      transactionId: result.payment.transactionId,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ 
      message: "Internal Server Error", 
      error: error.message 
    }, { status: 500 });
  }
}
