import { NextResponse } from "next/server";
import { db } from "../../../lib/prisma";

export async function GET() {
    const users = await db.user.findMany({
        include: {
            services: true,
            bookings: true,
        }
    });
    return NextResponse.json({ users });
}


