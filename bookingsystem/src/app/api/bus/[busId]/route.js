import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { busId } =await params;

    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(busId) },
      include: {
        route: true,
        driver: true,
      },
    });

    if (!bus) {
      return NextResponse.json({ message: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json({ bus }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json(
      { message: "Error fetching bus details" },
      { status: 500 }
    );
  }
}
