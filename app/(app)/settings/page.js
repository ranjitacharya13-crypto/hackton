"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Bell, ShieldCheck, Palette, Database, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { RoleBadge } from "@/components/security/role-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/components/providers/app-provider";
import { initials } from "@/lib/utils";

export default function SettingsPage() {
  const { roleConfig, pushToast } = useApp();
  const [prefs, setPrefs] = React.useState({
    emailReports: true,
    medicationReminders: true,
    accessAlerts: true,
    aiSuggestions: true,
    reducedMotion: false,
    compactCharts: false,
  });

  const toggle = (key, label) => (v) => {
    setPrefs((p) => ({ ...p, [key]: v }));
    pushToast({ kind: "info", title: "Preference saved", body: `${label} ${v ? "enabled" : "disabled"} (demo).` });
  };

  return (
    <div className="mx-auto max-w-[860px]">
      <PageHeader
        title="Settings"
        description="Profile, notifications, privacy and appearance — all preferences are frontend-only in this prototype."
        badges={<PermissionBadge level="PRIVATE" />}
      />

      <div className="space-y-4">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" aria-hidden />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-14 w-14">
                <AvatarFallback className={`${roleConfig.accent.dot} text-base text-white`}>
                  {initials(roleConfig.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" defaultValue={roleConfig.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="maya.chen@example.com" type="email" />
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-muted-foreground">Current role</p>
                <RoleBadge role={roleConfig.id} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" aria-hidden />
                Notifications
              </CardTitle>
              <CardDescription>Choose what Lumina Health can notify you about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                label="Weekly email health summary"
                desc="A digest of vitals, reports and activity"
                checked={prefs.emailReports}
                onChange={toggle("emailReports", "Email summaries")}
              />
              <SettingRow
                label="Medication reminders"
                desc="Refill due dates and missed doses"
                checked={prefs.medicationReminders}
                onChange={toggle("medicationReminders", "Medication reminders")}
              />
              <SettingRow
                label="Access alerts"
                desc="Instant alert when someone views your records"
                checked={prefs.accessAlerts}
                onChange={toggle("accessAlerts", "Access alerts")}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                Privacy & AI
              </CardTitle>
              <CardDescription>Control how intelligence features behave.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                label="AI suggestions"
                desc="Proactive prompts in your dashboard"
                checked={prefs.aiSuggestions}
                onChange={toggle("aiSuggestions", "AI suggestions")}
              />
              <SettingRow
                label="Include AI answers in audit log"
                desc="Recommended — keeps every insight traceable"
                checked
                disabled
              />
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs leading-relaxed text-emerald-800">
                Consent scopes are managed on the <span className="font-bold">Consent & Access</span> page. The AI
                never sees records outside those scopes — this demo simulates that enforcement in the interface.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" aria-hidden />
                Appearance & motion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                label="Reduce motion"
                desc="Minimize animations (your OS setting is always respected)"
                checked={prefs.reducedMotion}
                onChange={toggle("reducedMotion", "Reduce motion")}
              />
              <SettingRow
                label="Compact charts"
                desc="Smaller chart heights on dashboards"
                checked={prefs.compactCharts}
                onChange={toggle("compactCharts", "Compact charts")}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <Card className="border-rose-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <Database className="h-4 w-4" aria-hidden />
                Data controls
              </CardTitle>
              <CardDescription>Export or remove your demo data.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  pushToast({ kind: "success", title: "Export started", body: "Your data package will be emailed (demo)." })
                }
              >
                <Database className="h-4 w-4" aria-hidden />
                Export my data
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Delete demo data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete demo data?</DialogTitle>
                    <DialogDescription>
                      This is a frontend prototype — there is no stored data to delete. This dialog demonstrates the
                      real product&apos;s confirmation flow.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => pushToast({ kind: "warning", title: "Nothing to delete", body: "The prototype keeps all data in memory only." })}
                    >
                      Delete anyway
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SettingRow({ label, desc, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={label} />
    </div>
  );
}
