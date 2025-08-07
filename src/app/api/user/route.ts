import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
    const users = await db.user.findMany({
        include: {
            services: true,
            bookings: true,
        }
    });
    return NextResponse.json({ users });
}


