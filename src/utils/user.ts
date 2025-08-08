import { auth } from "@/auth";
import { db } from "@/lib/prisma";





export const getUser = async () => {
    const session = await auth();
    const user = session?.user?.id ? await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            bookings: true,
            services: true,
        }
    }) : null;
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}