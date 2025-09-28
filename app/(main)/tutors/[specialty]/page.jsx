import { redirect } from "next/navigation";
import { getTutorsBySpecialty } from "@/actions/tutors-listing";
import { TutorCard } from "../components/tutor-card";
import { PageHeader } from "@/components/page-header";

export default async function TutorSpecialtyPage({ params }) {
  const { specialty } = await params;

  // Redirect to main tutors page if no specialty is provided
  if (!specialty) {
    redirect("/tutors");
  }

  // Fetch tutors by specialty
  const { tutors, error } = await getTutorsBySpecialty(specialty);

  if (error) {
    console.error("Error fetching tutors:", error);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.split("%20").join(" ")}
        backLink="/tutors"
        backLabel="All Specialties"
      />

      {tutors && tutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No tutors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified tutors in this specialty. Please
            check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
}
