import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding - TutorMeet",
  description: "Complete your profile to get started with TutorMeet",
};

export default async function OnboardingLayout({ children }) {
  // Get complete user profile
  const user = await getCurrentUser();

  // Redirect users who have already completed onboarding
  if (user) {
    if (user.role === "STUDENT") {
      redirect("/tutors");
    } else if (user.role === "TUTOR") {
      // Check verification status for tutors
      if (user.verificationStatus === "VERIFIED") {
        redirect("/tutor");
      } else {
        redirect("/tutor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to TutorMeet
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us how you want to use the platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
