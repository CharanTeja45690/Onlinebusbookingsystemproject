import prisma from "@/utils/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const bus = await prisma.bus.findUnique({
      where: { id: Number(id) },
      include: { seats: true },
    });
    if (!bus) return Response.json({ error: "Bus not found" }, { status: 404 });
    return Response.json(bus);
  }

  const buses = await prisma.bus.findMany({ include: { seats: true } });
  return Response.json(buses);
}
