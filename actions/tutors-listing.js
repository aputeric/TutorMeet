"use server";

import { db } from "@/lib/prisma";

/**
 * Get tutors by specialty
 */
export async function getTutorsBySpecialty(specialty) {
  try {
    const tutors = await db.user.findMany({
      where: {
        role: "TUTOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });

    return { tutors };
  } catch (error) {
    console.error("Failed to fetch tutors by specialty:", error);
    return { error: "Failed to fetch tutors" };
  }
}
