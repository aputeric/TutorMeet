<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-white">
        Appointment Details
      </DialogTitle>
      <DialogDescription>
        {appointment.status === "SCHEDULED"
          ? "Manage your upcoming appointment"
          : "View appointment information"}
      </DialogDescription>
    </DialogHeader>

    {/* Two-column layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Other Party Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {otherPartyLabel}
          </h4>
          <div className="flex items-center">
            <div className="h-5 w-5 text-emerald-400 mr-2">{otherPartyIcon}</div>
            <div>
              <p className="text-white font-medium">
                {userRole === "TUTOR"
                  ? otherParty.name
                  : `Tr. ${otherParty.name}`}
              </p>
              {userRole === "TUTOR" && (
                <p className="text-muted-foreground text-sm">
                  {otherParty.email}
                </p>
              )}
              {userRole === "STUDENT" && (
                <p className="text-muted-foreground text-sm">
                  {otherParty.specialty}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Time */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Scheduled Time
          </h4>
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
              <p className="text-white">
                {formatDateTime(appointment.startTime)}
              </p>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-emerald-400 mr-2" />
              <p className="text-white">
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.endTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <Badge
            variant="outline"
            className={
              appointment.status === "COMPLETED"
                ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                : appointment.status === "CANCELLED"
                ? "bg-red-900/20 border-red-900/30 text-red-400"
                : "bg-amber-900/20 border-amber-900/30 text-amber-400"
            }
          >
            {appointment.status}
          </Badge>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        {/* Student Description */}
        {appointment.studentDescription && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {userRole === "TUTOR"
                ? "Student Description"
                : "Your Description"}
            </h4>
            <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20">
              <p className="text-white whitespace-pre-line">
                {appointment.studentDescription}
              </p>
            </div>
          </div>
        )}

        {/* Join Video Call Button */}
        {appointment.status === "SCHEDULED" && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Video Consultation
            </h4>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={
                !isAppointmentActive() || action === "video" || tokenLoading
              }
              onClick={handleJoinVideoCall}
            >
              {tokenLoading || action === "video" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Video Call...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  {isAppointmentActive()
                    ? "Join Video Call"
                    : "Available 30 minutes before appointment"}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Tutor Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Tutor Notes
            </h4>
            {userRole === "TUTOR" &&
              action !== "notes" &&
              appointment.status !== "CANCELLED" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAction("notes")}
                  className="h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  {appointment.notes ? "Edit" : "Add"}
                </Button>
              )}
          </div>

          {userRole === "TUTOR" && action === "notes" ? (
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here..."
                className="bg-background border-emerald-900/20 min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAction(null);
                    setNotes(appointment.notes || "");
                  }}
                  disabled={notesLoading}
                  className="border-emerald-900/30"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={notesLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {notesLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20 min-h-[80px]">
              {appointment.notes ? (
                <p className="text-white whitespace-pre-line">
                  {appointment.notes}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No notes added yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Footer */}
    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
      <div className="flex gap-2">
        {canMarkCompleted() && (
          <Button
            onClick={handleMarkCompleted}
            disabled={completeLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {completeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
        )}
        {appointment.status === "SCHEDULED" && (
          <Button
            variant="outline"
            onClick={handleCancelAppointment}
            disabled={cancelLoading}
            className="border-red-900/30 text-red-400 hover:bg-red-900/10 mt-3 sm:mt-0"
          >
            {cancelLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Cancel Appointment
              </>
            )}
          </Button>
        )}
      </div>
      <Button
        onClick={() => setOpen(false)}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
