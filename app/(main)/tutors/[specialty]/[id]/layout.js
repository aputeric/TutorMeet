import { getTutorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { tutor } = await getTutorById(id);
  return {
    title: `Tr. ${tutor.name} - TutorMeet`,
    description: `Book an appointment with Tr. ${tutor.name}, ${tutor.specialty} specialist with ${tutor.experience} years of experience.`,
  };
}

export default async function TutorProfileLayout({ children, params }) {
  const { id } = await params;
  const { tutor } = await getTutorById(id);

  if (!tutor) redirect("/tutors");

  return (
    <div className="container mx-auto">
      <PageHeader
        // icon={<GraduationCap />}
        title={"Tr. " + tutor.name}
        backLink={`/tutors/${tutor.specialty}`}
        backLabel={`Back to ${tutor.specialty}`}
      />

      {children}
    </div>
  );
}
