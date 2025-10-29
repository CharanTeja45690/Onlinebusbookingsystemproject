import prisma from "@/utils/prisma";

export async function POST(req) {
  const { userId, busId, seatId } = await req.json();

  const seat = await prisma.seat.findUnique({ where: { id: seatId } });
  if (seat.isBooked) return Response.json({ error: "Seat already booked" }, { status: 400 });

  const booking = await prisma.booking.create({
    data: { userId, busId, seatId }
  });

  await prisma.seat.update({ where: { id: seatId }, data: { isBooked: true } });
  return Response.json(booking);
}
