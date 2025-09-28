import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get all appointments for the authenticated student
 */
export async function getStudentAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "STUDENT",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("Student not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Failed to get student appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
}
