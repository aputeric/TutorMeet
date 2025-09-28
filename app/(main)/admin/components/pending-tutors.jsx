"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, User, Medal, FileText, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { updateTutorStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

export function PendingTutors({ tutors }) {
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Custom hook for approve/reject server action
  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateTutorStatus);

  // Open tutor details dialog
  const handleViewDetails = (tutor) => {
    setSelectedTutor(tutor);
  };

  // Close tutor details dialog
  const handleCloseDialog = () => {
    setSelectedTutor(null);
  };

  // Handle approve or reject tutor
  const handleUpdateStatus = async (tutorId, status) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("status", status);

    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      handleCloseDialog();
    }
  }, [data]);

  return (
    <div>
      <Card className="bg-muted/20 border-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Pending Tutor Verifications
          </CardTitle>
          <CardDescription>
            Review and approve tutor applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tutors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending verification requests at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {tutors.map((tutor) => (
                <Card
                  key={tutor.id}
                  className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/20 rounded-full p-2">
                          <User className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {tutor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tutor.specialty} • {tutor.experience} years
                            experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <Badge
                          variant="outline"
                          className="bg-amber-900/20 border-amber-900/30 text-amber-400"
                        >
                          Pending
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(tutor)}
                          className="border-emerald-900/30 hover:bg-muted/80"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutor Details Dialog */}
      {selectedTutor && (
        <Dialog open={!!selectedTutor} onOpenChange={handleCloseDialog}>
          <DialogContent className="w-full max-w-4xl md:max-w-5xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Tutor Verification Details
              </DialogTitle>
              <DialogDescription>
                Review the tutor&apos;s information carefully before making a
                decision
              </DialogDescription>
            </DialogHeader>

            {/* Responsive grid layout for details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </h4>
                  <p className="text-base font-medium text-white">
                    {selectedTutor.name}
                  </p>
                  <h4 className="text-sm font-medium text-muted-foreground mt-4">
                    Email
                  </h4>
                  <p className="text-base font-medium text-white">
                    {selectedTutor.email}
                  </p>
                  <h4 className="text-sm font-medium text-muted-foreground mt-4">
                    Application Date
                  </h4>
                  <p className="text-base font-medium text-white">
                    {format(new Date(selectedTutor.createdAt), "PPP")}
                  </p>
                </div>

                {/* Professional Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Medal className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-white font-medium">
                      Professional Information
                    </h3>
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Specialty
                  </h4>
                  <p className="text-white">{selectedTutor.specialty}</p>
                  <h4 className="text-sm font-medium text-muted-foreground mt-4">
                    Years of Experience
                  </h4>
                  <p className="text-white">
                    {selectedTutor.experience} years
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Credentials */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Credentials
                  </h4>
                  <div className="flex items-center">
                    <a
                      href={selectedTutor.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center"
                    >
                      View Credentials
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-white font-medium">
                      Service Description
                    </h3>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedTutor.description}
                  </p>
                </div>
              </div>
            </div>

            {loading && <BarLoader width={"100%"} color="#36d7b7" />}

            <DialogFooter className="flex sm:justify-between">
              <Button
                variant="destructive"
                onClick={() =>
                  handleUpdateStatus(selectedTutor.id, "REJECTED")
                }
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() =>
                  handleUpdateStatus(selectedTutor.id, "VERIFIED")
                }
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
