import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { driverId } =await params;

    if (!driverId) {
      return NextResponse.json(
        { message: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Fetch all buses belonging to this driver
    const buses = await prisma.Bus.findMany({
      where: {
        ownerId: parseInt(driverId),
      },
      include: {
        route: true, 
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!buses || buses.length === 0) {
      return NextResponse.json(
        { message: "No buses found for this driver", buses: [] },
        { status: 400 }
      );
    }

    return NextResponse.json({ buses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver buses:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
