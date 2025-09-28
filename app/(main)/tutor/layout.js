import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Tutor Dashboard - TutorMeet",
  description: "Manage your appointments and availability",
};

export default async function TutorDashboardLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<GraduationCap />} title="Tutor Dashboard" />

      {children}
    </div>
  );
}
