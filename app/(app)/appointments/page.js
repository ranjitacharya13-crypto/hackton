"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Video, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/components/providers/app-provider";
import { appointments } from "@/lib/data";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildSeptember2026() {
  // Sep 2026: 30 days, Sep 1 is a Tuesday (Mon-first grid)
  const firstWeekdayIdx = 1; // 0 = Monday
  const cells = [];
  for (let i = 0; i < firstWeekdayIdx; i++) cells.push(null);
  for (let day = 1; day <= 30; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AppointmentsPage() {
  const { pushToast } = useApp();
  const [bookOpen, setBookOpen] = React.useState(false);
  const cells = buildSeptember2026();
  const apptDays = { 14: "Cardiology", 22: "Laboratory" };
  const upcoming = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");
  const past = appointments.filter((a) => a.status === "Completed");

  const book = (e) => {
    e.preventDefault();
    setBookOpen(false);
    pushToast({
      kind: "success",
      title: "Appointment requested",
      body: "You'll get a confirmation once the clinic reviews the slot (demo).",
    });
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Your connected calendar — visits, lab draws and telehealth in one place."
        badges={<PermissionBadge level="PRIVATE" />}
      >
        <Dialog open={bookOpen} onOpenChange={setBookOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              Book appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book an appointment</DialogTitle>
              <DialogDescription>
                Frontend demo — submitting shows the confirmation flow without contacting any clinic.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={book} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="dept">Department</Label>
                  <Input id="dept" defaultValue="Cardiology" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="doctor">Clinician</Label>
                  <Input id="doctor" defaultValue="Dr. Amara Osei" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" defaultValue="2026-09-28" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" defaultValue="10:00" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBookOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Request booking</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Calendar */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">September 2026</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((d) => (
                <span key={d} className="pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                const isToday = day === 10;
                const hasAppt = day && apptDays[day];
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex h-11 flex-col items-center justify-center rounded-lg text-sm transition-colors",
                      day ? "hover:bg-secondary/70" : "",
                      isToday && "bg-primary/10 font-bold text-primary ring-1 ring-primary/30"
                    )}
                  >
                    {day ? (
                      <>
                        <span className="tabular-nums">{day}</span>
                        {hasAppt && (
                          <span
                            className="mt-0.5 flex gap-0.5"
                            title={`${hasAppt} appointment`}
                          >
                            <span className={cn("h-1 w-1 rounded-full", hasAppt === "Laboratory" ? "bg-violet-500" : "bg-teal-500")} aria-hidden />
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {upcoming.slice(0, 2).map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 text-xs">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", a.department === "Laboratory" ? "bg-violet-500" : "bg-teal-600")}>
                    {a.mode === "Video" ? <Video className="h-3.5 w-3.5" aria-hidden /> : <MapPin className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.title}</p>
                    <p className="text-muted-foreground">{a.date} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment cards */}
        <div>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="space-y-3">
                {upcoming.map((a, i) => (
                  <AppointmentCard key={a.id} appointment={a} index={i} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="space-y-3">
                {past.map((a, i) => (
                  <AppointmentCard key={a.id} appointment={a} index={i} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
