"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Set tutor's availability slots
 */
export async function setAvailabilitySlots(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the tutor
    const tutor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "TUTOR",
      },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    // Get form data
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    // Validate input
    if (!startTime || !endTime) {
      throw new Error("Start time and end time are required");
    }

    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // Check if the tutor already has slots
    const existingSlots = await db.availability.findMany({
      where: {
        tutorId: tutor.id,
      },
    });

    // If slots exist, delete them all (we're replacing them)
    if (existingSlots.length > 0) {
      // Don't delete slots that already have appointments
      const slotsWithNoAppointments = existingSlots.filter(
        (slot) => !slot.appointment
      );

      if (slotsWithNoAppointments.length > 0) {
        await db.availability.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointments.map((slot) => slot.id),
            },
          },
        });
      }
    }

    // Create new availability slot
    const newSlot = await db.availability.create({
      data: {
        tutorId: tutor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });

    revalidatePath("/tutor");
    return { success: true, slot: newSlot };
  } catch (error) {
    console.error("Failed to set availability slots:", error);
    throw new Error("Failed to set availability: " + error.message);
  }
}

/**
 * Get tutor's current availability slots
 */
export async function getTutorAvailability() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const tutor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "TUTOR",
      },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    const availabilitySlots = await db.availability.findMany({
      where: {
        tutorId: tutor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { slots: availabilitySlots };
  } catch (error) {
    throw new Error("Failed to fetch availability slots " + error.message);
  }
}

/**
 * Get tutor's upcoming appointments
 */

export async function getTutorAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const tutor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "TUTOR",
      },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        tutorId: tutor.id,
        status: {
          in: ["SCHEDULED"],
        },
      },
      include: {
        student: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    throw new Error("Failed to fetch appointments " + error.message);
  }
}

/**
 * Cancel an appointment (can be done by both tutor and student)
 */
export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment with both student and tutor details
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        student: true,
        tutor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the tutor or the student for this appointment
    if (appointment.tutorId !== user.id && appointment.studentId !== user.id) {
      throw new Error("You are not authorized to cancel this appointment");
    }

    // Perform cancellation in a transaction
    await db.$transaction(async (tx) => {
      // Update the appointment status to CANCELLED
      await tx.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      // Always refund credits to student and deduct from tutor
      // Create credit transaction for student (refund)
      await tx.creditTransaction.create({
        data: {
          userId: appointment.studentId,
          amount: 2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Create credit transaction for tutor (deduction)
      await tx.creditTransaction.create({
        data: {
          userId: appointment.tutorId,
          amount: -2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Update student's credit balance (increment)
      await tx.user.update({
        where: {
          id: appointment.studentId,
        },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      // Update tutor's credit balance (decrement)
      await tx.user.update({
        where: {
          id: appointment.tutorId,
        },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });
    });

    // Determine which path to revalidate based on user role
    if (user.role === "TUTOR") {
      revalidatePath("/tutor");
    } else if (user.role === "STUDENT") {
      revalidatePath("/appointments");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}

/**
 * Add notes to an appointment
 */
export async function addAppointmentNotes(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const tutor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "TUTOR",
      },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    const appointmentId = formData.get("appointmentId");
    const notes = formData.get("notes");

    if (!appointmentId || !notes) {
      throw new Error("Appointment ID and notes are required");
    }

    // Verify the appointment belongs to this tutor
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        tutorId: tutor.id,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Update the appointment notes
    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes,
      },
    });

    revalidatePath("/tutor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Failed to add appointment notes:", error);
    throw new Error("Failed to update notes: " + error.message);
  }
}

/**
 * Mark an appointment as completed (only by tutor after end time)
 */
export async function markAppointmentCompleted(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const tutor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "TUTOR",
      },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        tutorId: tutor.id, // Ensure appointment belongs to this tutor
      },
      include: {
        student: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found or not authorized");
    }

    // Check if appointment is currently scheduled
    if (appointment.status !== "SCHEDULED") {
      throw new Error("Only scheduled appointments can be marked as completed");
    }

    // Check if current time is after the appointment end time
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);

    if (now < appointmentEndTime) {
      throw new Error(
        "Cannot mark appointment as completed before the scheduled end time"
      );
    }

    // Update the appointment status to COMPLETED
    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath("/tutor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Failed to mark appointment as completed:", error);
    throw new Error(
      "Failed to mark appointment as completed: " + error.message
    );
  }
}
