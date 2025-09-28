export const metadata = {
  title: "Find Tutors - TutorMeet",
  description: "Browse and book appointments with top healthcare providers",
};

export default async function TutorsLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
