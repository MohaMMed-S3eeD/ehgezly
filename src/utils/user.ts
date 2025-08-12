import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";





export const getUser = async () => {
  noStore();
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        bookings: true,
        services: true,
      },
    });

    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    // فشل الوصول لقاعدة البيانات أو أي خطأ غير متوقع
    console.error("getUser error:", error);
    return null;
  }
};