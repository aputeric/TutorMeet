import { getTutorById, getAvailableTimeSlots } from "@/actions/appointments";
import { TutorProfile } from "./_components/tutor-profile";
import { redirect } from "next/navigation";

export default async function TutorProfilePage({ params }) {
  const { id } = await params;

  try {
    // Fetch tutor data and available slots in parallel
    const [tutorData, slotsData] = await Promise.all([
      getTutorById(id),
      getAvailableTimeSlots(id),
    ]);

    return (
      <TutorProfile
        tutor={tutorData.tutor}
        availableDays={slotsData.days || []}
      />
    );
  } catch (error) {
    console.error("Error loading tutor profile:", error);
    redirect("/tutors");
  }
}
