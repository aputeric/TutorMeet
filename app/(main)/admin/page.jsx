import { TabsContent } from "@/components/ui/tabs";
import { PendingTutors } from "./components/pending-tutors";
import { VerifiedTutors } from "./components/verified-tutors";
import { PendingPayouts } from "./components/pending-payouts";
import {
  getPendingTutors,
  getVerifiedTutors,
  getPendingPayouts,
} from "@/actions/admin";

export default async function AdminPage() {
  // Fetch all data in parallel
  const [pendingTutorsData, verifiedTutorsData, pendingPayoutsData] =
    await Promise.all([
      getPendingTutors(),
      getVerifiedTutors(),
      getPendingPayouts(),
    ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0">
        <PendingTutors tutors={pendingTutorsData.tutors || []} />
      </TabsContent>

      <TabsContent value="tutors" className="border-none p-0">
        <VerifiedTutors tutors={verifiedTutorsData.tutors || []} />
      </TabsContent>

      <TabsContent value="payouts" className="border-none p-0">
        <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
      </TabsContent>
    </>
  );
}
