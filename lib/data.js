import { mulberry32 } from "./utils";

export const TODAY = new Date("2026-09-10T09:00:00");

/* ------------------------------------------------------------------ */
/* Deterministic series generation (same on server & client)          */
/* ------------------------------------------------------------------ */

function dayLabel(offsetFromToday) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - offsetFromToday);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function pointLabel(offsetFromToday, stepDays) {
  if (stepDays >= 28) {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - offsetFromToday);
    return d.toLocaleDateString(undefined, { month: "short" });
  }
  return dayLabel(offsetFromToday * stepDays);
}

function genSeries({ points, base, variance, trend = 0, seed, round = 0, min = null, max = null, stepDays = 1 }) {
  const rnd = mulberry32(seed);
  const out = [];
  let v = base;
  for (let i = points - 1; i >= 0; i--) {
    v += (rnd() - 0.5) * variance + trend;
    let value = v;
    if (min !== null) value = Math.max(min, value);
    if (max !== null) value = Math.min(max, value);
    const factor = 10 ** round;
    out.push({
      label: pointLabel(i, stepDays),
      value: Math.round(value * factor) / factor,
    });
  }
  return out;
}

function genBPSeries({ points, seed, stepDays = 1 }) {
  const rnd = mulberry32(seed);
  const out = [];
  let sys = 114;
  for (let i = points - 1; i >= 0; i--) {
    sys += (rnd() - 0.48) * 3.2;
    const sysV = Math.round(Math.max(106, Math.min(128, sys)));
    out.push({
      label: pointLabel(i, stepDays),
      systolic: sysV,
      diastolic: Math.round(sysV * 0.64 + (rnd() - 0.5) * 4),
    });
  }
  return out;
}

export const VITAL_RANGES = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 12, // sampled monthly
};

export function getVitalSeries(metric, range = "30D") {
  const points = VITAL_RANGES[range] || 30;
  const stepDays = range === "1Y" ? 30 : range === "90D" ? 1 : 1;
  const seedBase = metric.length * 977 + points * 131;
  switch (metric) {
    case "bloodPressure":
      return genBPSeries({ points, seed: seedBase + 7, stepDays });
    case "glucose":
      return genSeries({ points, base: 96, variance: 7, trend: -0.06, seed: seedBase + 11, min: 78, max: 132, stepDays });
    case "heartRate":
      return genSeries({ points, base: 72, variance: 5, trend: 0, seed: seedBase + 17, min: 58, max: 92, stepDays });
    case "weight":
      return genSeries({ points, base: 68.8, variance: 0.5, trend: -0.015, seed: seedBase + 23, round: 1, min: 66, max: 72, stepDays });
    case "sleep":
      return genSeries({ points, base: 7.1, variance: 1.1, trend: 0.004, seed: seedBase + 31, round: 1, min: 4.5, max: 9.5, stepDays });
    case "activity":
      return genSeries({ points, base: 8200, variance: 2600, trend: 18, seed: seedBase + 37, min: 2400, max: 14500, stepDays });
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/* Health metric cards                                                 */
/* ------------------------------------------------------------------ */

export const healthMetrics = [
  {
    id: "heartRate",
    label: "Heart Rate",
    value: 72,
    unit: "bpm",
    previous: 68,
    trend: "up",
    status: "normal",
    updated: "25 min ago",
    icon: "heart",
    sparkSeed: 101,
  },
  {
    id: "bloodPressure",
    label: "Blood Pressure",
    value: "118/76",
    unit: "mmHg",
    previous: "114/74",
    trend: "up",
    status: "normal",
    updated: "1 h ago",
    icon: "gauge",
    sparkSeed: 102,
  },
  {
    id: "glucose",
    label: "Blood Glucose",
    value: 94,
    unit: "mg/dL",
    previous: 99,
    trend: "down",
    status: "good",
    updated: "2 h ago",
    icon: "droplet",
    sparkSeed: 103,
  },
  {
    id: "weight",
    label: "Weight",
    value: 68.4,
    unit: "kg",
    previous: 68.9,
    trend: "down",
    status: "good",
    updated: "Yesterday",
    icon: "scale",
    sparkSeed: 104,
  },
  {
    id: "sleep",
    label: "Sleep",
    value: "7h 20m",
    unit: "",
    previous: "6h 45m",
    trend: "up",
    status: "good",
    updated: "Last night",
    icon: "moon",
    sparkSeed: 105,
  },
  {
    id: "activity",
    label: "Activity",
    value: "8,432",
    unit: "steps",
    previous: "7,118",
    trend: "up",
    status: "good",
    updated: "Today",
    icon: "footprints",
    sparkSeed: 106,
  },
];

/* ------------------------------------------------------------------ */
/* Patients (doctor / nurse views)                                     */
/* ------------------------------------------------------------------ */

export const patients = [
  { id: "p1", name: "Maya Chen", age: 32, condition: "Hypertension follow-up", lastVisit: "Aug 28, 2026", risk: "moderate", room: "—", trend: "improving", nextAppt: "Sep 14, 10:30" },
  { id: "p2", name: "Jonah Whitfield", age: 58, condition: "Type 2 diabetes review", lastVisit: "Sep 02, 2026", risk: "high", room: "3-12", trend: "attention", nextAppt: "Sep 11, 09:00" },
  { id: "p3", name: "Elena Rodrigues", age: 44, condition: "Post-operative cardiac", lastVisit: "Sep 07, 2026", risk: "high", room: "3-04", trend: "stable", nextAppt: "Sep 12, 14:15" },
  { id: "p4", name: "Samuel Adeyemi", age: 36, condition: "Arrhythmia monitoring", lastVisit: "Aug 21, 2026", risk: "low", room: "—", trend: "stable", nextAppt: "Sep 18, 11:45" },
  { id: "p5", name: "Ingrid Halvorsen", age: 67, condition: "Cholesterol management", lastVisit: "Sep 05, 2026", risk: "moderate", room: "3-09", trend: "improving", nextAppt: "Sep 16, 13:00" },
  { id: "p6", name: "Tomas Novak", age: 51, condition: "Hypertension, new consult", lastVisit: "Sep 09, 2026", risk: "moderate", room: "3-15", trend: "attention", nextAppt: "Sep 10, 15:30" },
];

/* ------------------------------------------------------------------ */
/* Health records                                                      */
/* ------------------------------------------------------------------ */

export const healthRecords = [
  {
    id: "rec-01", type: "lab", title: "Complete Blood Count", date: "Jun 12, 2026",
    provider: "CityLab Diagnostics", status: "Final", access: "CONSENTED",
    summary: "All values within normal range. Hemoglobin 13.8 g/dL.", reportId: "r1",
  },
  {
    id: "rec-02", type: "report", title: "Lipid Panel", date: "Aug 03, 2026",
    provider: "CityLab Diagnostics", status: "Final", access: "CONSENTED",
    summary: "LDL reduced to 112 mg/dL following therapy adjustment.", reportId: "r2",
  },
  {
    id: "rec-03", type: "visit", title: "Cardiology Consultation", date: "Aug 28, 2026",
    provider: "Dr. Amara Osei · Lumina Cardiology", status: "Final", access: "PRIVATE",
    summary: "Follow-up on blood pressure trend. Continue current therapy.",
  },
  {
    id: "rec-04", type: "prescription", title: "Atorvastatin 10 mg — renewed", date: "Aug 28, 2026",
    provider: "Dr. Amara Osei", status: "Active", access: "CONSENTED",
    summary: "Once nightly, 90-day supply. Refill due Nov 26, 2026.",
  },
  {
    id: "rec-05", type: "vitals", title: "Vitals Snapshot — September", date: "Sep 01, 2026",
    provider: "Connected wearable", status: "Synced", access: "PRIVATE",
    summary: "Resting HR 72 bpm · BP 118/76 · SpO₂ 98%.",
  },
  {
    id: "rec-06", type: "report", title: "Annual Physical Summary", date: "May 20, 2026",
    provider: "Lumina Primary Care", status: "Final", access: "PRIVATE",
    summary: "Overall good health. Recommended lipid re-check in Q3.",
  },
  {
    id: "rec-07", type: "lab", title: "HbA1c", date: "Jun 12, 2026",
    provider: "CityLab Diagnostics", status: "Final", access: "CONSENTED",
    summary: "HbA1c 5.4% — within non-diabetic range.",
  },
  {
    id: "rec-08", type: "prescription", title: "Metformin 500 mg — started", date: "Jun 04, 2026",
    provider: "Dr. R. Alvarez", status: "Active", access: "CONSENTED",
    summary: "Twice daily with meals. 6-month course.",
  },
  {
    id: "rec-09", type: "visit", title: "General Check-up", date: "Jul 15, 2026",
    provider: "Lumina Primary Care", status: "Final", access: "PRIVATE",
    summary: "Routine visit. Discussed sleep hygiene and activity goals.",
  },
  {
    id: "rec-10", type: "lab", title: "Thyroid Panel (TSH, T4)", date: "Mar 22, 2026",
    provider: "CityLab Diagnostics", status: "Final", access: "ROLE RESTRICTED",
    summary: "TSH 2.1 mIU/L — normal thyroid function.",
  },
  {
    id: "rec-11", type: "vitals", title: "Vitals Snapshot — June", date: "Jun 01, 2026",
    provider: "Connected wearable", status: "Synced", access: "PRIVATE",
    summary: "Resting HR 70 bpm · BP 112/72 · SpO₂ 98%.",
  },
  {
    id: "rec-12", type: "report", title: "Cardiology Consult Report", date: "Aug 28, 2026",
    provider: "Dr. Amara Osei", status: "Final", access: "CONSENTED",
    summary: "Stable ECG, mild upward BP trend. Re-check in 6 weeks.", reportId: "r4",
  },
];

export const RECORD_TYPE_META = {
  report: { label: "Report", color: "bg-sky-50 text-sky-700 border-sky-200" },
  prescription: { label: "Prescription", color: "bg-amber-50 text-amber-700 border-amber-200" },
  lab: { label: "Lab Result", color: "bg-violet-50 text-violet-700 border-violet-200" },
  visit: { label: "Visit", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  vitals: { label: "Vitals", color: "bg-teal-50 text-teal-700 border-teal-200" },
};

/* ------------------------------------------------------------------ */
/* Reports (detailed viewer)                                           */
/* ------------------------------------------------------------------ */

export const reports = [
  {
    id: "r1",
    title: "Complete Blood Count",
    date: "Jun 12, 2026",
    provider: "CityLab Diagnostics",
    orderedBy: "Dr. R. Alvarez",
    status: "Final",
    access: "CONSENTED",
    summary:
      "Complete blood count within normal limits. No indicators of anemia or infection at time of draw.",
    extracted: [
      { label: "Hemoglobin", value: "13.8 g/dL", flag: "Normal" },
      { label: "WBC", value: "6.2 ×10³/µL", flag: "Normal" },
      { label: "Platelets", value: "254 ×10³/µL", flag: "Normal" },
      { label: "Hematocrit", value: "41.2%", flag: "Normal" },
    ],
    tags: ["Hematology", "Routine", "Fasting"],
    highlights: [
      "Specimen collected Jun 12, 2026 at 08:20 (fasting).",
      "All 14 measured parameters fall inside reference ranges.",
      "No flags raised by the laboratory information system.",
    ],
  },
  {
    id: "r2",
    title: "Lipid Panel",
    date: "Aug 03, 2026",
    provider: "CityLab Diagnostics",
    orderedBy: "Dr. Amara Osei",
    status: "Final",
    access: "CONSENTED",
    summary:
      "Lipid profile shows improvement since starting therapy. LDL down from 138 to 112 mg/dL.",
    extracted: [
      { label: "Total Cholesterol", value: "186 mg/dL", flag: "Normal" },
      { label: "LDL", value: "112 mg/dL", flag: "Borderline" },
      { label: "HDL", value: "58 mg/dL", flag: "Normal" },
      { label: "Triglycerides", value: "121 mg/dL", flag: "Normal" },
    ],
    tags: ["Cardiology", "Cholesterol", "Fasting"],
    highlights: [
      "19% LDL reduction compared with the May 2026 baseline.",
      "HDL stable; triglycerides within target range.",
      "Cardiologist notes: continue current statin dose.",
    ],
  },
  {
    id: "r3",
    title: "Annual Physical Summary",
    date: "May 20, 2026",
    provider: "Lumina Primary Care",
    orderedBy: "Dr. R. Alvarez",
    status: "Final",
    access: "PRIVATE",
    summary:
      "Annual physical examination. Overall good health with mild blood pressure elevation noted for monitoring.",
    extracted: [
      { label: "Blood Pressure", value: "124/79 mmHg", flag: "Elevated" },
      { label: "BMI", value: "23.1", flag: "Normal" },
      { label: "Resting HR", value: "70 bpm", flag: "Normal" },
      { label: "SpO₂", value: "98%", flag: "Normal" },
    ],
    tags: ["Primary Care", "Annual", "Preventive"],
    highlights: [
      "Discussed sleep hygiene, hydration and weekly activity goals.",
      "Ordered lipid panel and CBC for Q3 re-check.",
      "No acute findings. Follow-up scheduled with cardiology.",
    ],
  },
  {
    id: "r4",
    title: "Cardiology Consult Report",
    date: "Aug 28, 2026",
    provider: "Dr. Amara Osei · Lumina Cardiology",
    orderedBy: "Referral — Primary Care",
    status: "Final",
    access: "CONSENTED",
    summary:
      "Follow-up consultation for mild hypertension. ECG stable. Continue current therapy and re-check in 6 weeks.",
    extracted: [
      { label: "ECG", value: "Normal sinus rhythm", flag: "Normal" },
      { label: "BP (visit)", value: "118/76 mmHg", flag: "Normal" },
      { label: "Trend", value: "Mild upward since June", flag: "Watch" },
      { label: "Plan", value: "Re-check in 6 weeks", flag: "—" },
    ],
    tags: ["Cardiology", "Hypertension", "Follow-up"],
    highlights: [
      "Resting ECG within normal limits; no arrhythmia observed.",
      "Home monitoring trend shows mild systolic increase since June.",
      "Continue Atorvastatin 10 mg; lifestyle measures reinforced.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Medications                                                         */
/* ------------------------------------------------------------------ */

export const medications = [
  {
    id: "m1", name: "Atorvastatin", dosage: "10 mg", frequency: "Once nightly",
    start: "Jun 04, 2026", end: null, status: "active", prescriber: "Dr. Amara Osei",
    adherence: 96, refill: "Nov 26, 2026", purpose: "Cholesterol",
  },
  {
    id: "m2", name: "Metformin", dosage: "500 mg", frequency: "Twice daily with meals",
    start: "Jun 04, 2026", end: null, status: "active", prescriber: "Dr. R. Alvarez",
    adherence: 91, refill: "Oct 02, 2026", purpose: "Glucose control",
  },
  {
    id: "m3", name: "Vitamin D3", dosage: "2000 IU", frequency: "Once daily",
    start: "Mar 10, 2026", end: null, status: "active", prescriber: "Dr. R. Alvarez",
    adherence: 88, refill: "Sep 24, 2026", purpose: "Supplement",
  },
  {
    id: "m4", name: "Lisinopril", dosage: "5 mg", frequency: "Once morning",
    start: "Jun 20, 2026", end: "Aug 15, 2026", status: "paused", prescriber: "Dr. Amara Osei",
    adherence: 82, refill: "—", purpose: "Blood pressure",
  },
  {
    id: "m5", name: "Amoxicillin", dosage: "500 mg", frequency: "3× daily, 7 days",
    start: "Apr 02, 2026", end: "Apr 09, 2026", status: "completed", prescriber: "Dr. R. Alvarez",
    adherence: 100, refill: "—", purpose: "Infection",
  },
];

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */

export const appointments = [
  { id: "a1", title: "Cardiology follow-up", doctor: "Dr. Amara Osei", department: "Cardiology", date: "Sep 14, 2026", day: 14, month: "Sep", time: "10:30", status: "Confirmed", mode: "In-person", location: "Lumina Heart Center, Suite 204" },
  { id: "a2", title: "Blood work — lipid re-check", doctor: "Sara Kim", department: "Laboratory", date: "Sep 22, 2026", day: 22, month: "Sep", time: "08:15", status: "Scheduled", mode: "In-person", location: "CityLab Diagnostics, Floor 1" },
  { id: "a3", title: "Dental cleaning", doctor: "Dr. L. Moreau", department: "Dental", date: "Oct 02, 2026", day: 2, month: "Oct", time: "15:00", status: "Scheduled", mode: "In-person", location: "Lumina Dental" },
  { id: "a4", title: "Cardiology consultation", doctor: "Dr. Amara Osei", department: "Cardiology", date: "Aug 28, 2026", day: 28, month: "Aug", time: "11:00", status: "Completed", mode: "In-person", location: "Lumina Heart Center, Suite 204" },
  { id: "a5", title: "Laboratory visit — CBC", doctor: "Sara Kim", department: "Laboratory", date: "Aug 10, 2026", day: 10, month: "Aug", time: "08:30", status: "Completed", mode: "In-person", location: "CityLab Diagnostics" },
  { id: "a6", title: "General check-up", doctor: "Dr. R. Alvarez", department: "Primary Care", date: "Jul 15, 2026", day: 15, month: "Jul", time: "09:45", status: "Completed", mode: "Video", location: "Telehealth" },
];

/* ------------------------------------------------------------------ */
/* Consent                                                             */
/* ------------------------------------------------------------------ */

export const initialConsents = [
  {
    id: "doctor", title: "Doctor", who: "Dr. Amara Osei · Cardiology",
    status: "granted", scope: "Access Granted", detail: "Full clinical record access for ongoing care.",
    scopeItems: ["Health records", "Lab results", "Vitals", "Medications"],
    grantedAt: "Mar 02, 2026", lastAccess: "Today, 09:31",
  },
  {
    id: "pharmacy", title: "Pharmacy", who: "Lumina Pharmacy",
    status: "limited", scope: "Medication Only", detail: "Prescriptions and dispensing history only.",
    scopeItems: ["Medications", "Prescriptions"],
    grantedAt: "Jun 04, 2026", lastAccess: "Sep 08, 16:12",
  },
  {
    id: "laboratory", title: "Laboratory", who: "CityLab Diagnostics",
    status: "limited", scope: "Reports Only", detail: "Laboratory can read and attach its own reports.",
    scopeItems: ["Lab reports"],
    grantedAt: "Jan 18, 2026", lastAccess: "Sep 06, 11:05",
  },
  {
    id: "research", title: "Research", who: "Anonymized research pool",
    status: "denied", scope: "No Access", detail: "No records are shared with research programs.",
    scopeItems: [],
    grantedAt: null, lastAccess: "Never",
  },
];

export const consentTimeline = [
  { id: "c1", date: "Jan 18, 2026", event: "Granted report access to CityLab Diagnostics", type: "granted" },
  { id: "c2", date: "Mar 02, 2026", event: "Granted full access to Dr. Amara Osei (Cardiology)", type: "granted" },
  { id: "c3", date: "Jun 04, 2026", event: "Granted medication-only access to Lumina Pharmacy", type: "limited" },
  { id: "c4", date: "Jul 30, 2026", event: "Declined anonymized research sharing", type: "denied" },
  { id: "c5", date: "Today, 09:45", event: "Reviewed consent settings during demo walkthrough", type: "reviewed" },
];

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

export const initialAuditLogs = [
  { id: "au1", time: "09:31", date: "Today", role: "doctor", actor: "Dr. Amara Osei", action: "viewed", resource: "Blood Test — Aug 2026", status: "success", category: "view" },
  { id: "au2", time: "09:40", date: "Today", role: "patient", actor: "Health Intelligence", action: "AI summarized authorized records", resource: "3 records · consented scope", status: "success", category: "ai" },
  { id: "au3", time: "09:45", date: "Today", role: "patient", actor: "Maya Chen", action: "granted medication access", resource: "Consent · Pharmacy", status: "success", category: "consent" },
  { id: "au4", time: "09:51", date: "Today", role: "pharmacist", actor: "Omar Haddad", action: "viewed", resource: "Medication history", status: "success", category: "view" },
  { id: "au5", time: "08:58", date: "Today", role: "nurse", actor: "Liam Torres", action: "recorded vitals", resource: "Vitals · Elena Rodrigues", status: "success", category: "update" },
  { id: "au6", time: "08:37", date: "Today", role: "laboratory", actor: "Sara Kim", action: "verified", resource: "Lipid Panel report", status: "success", category: "update" },
  { id: "au7", time: "17:22", date: "Sep 09", role: "doctor", actor: "Dr. K. Romero", action: "requested access", resource: "Thyroid Panel", status: "denied", category: "consent" },
  { id: "au8", time: "16:04", date: "Sep 09", role: "admin", actor: "Priya Nair", action: "reviewed access requests", resource: "Access queue", status: "success", category: "view" },
  { id: "au9", time: "14:49", date: "Sep 09", role: "pharmacist", actor: "Omar Haddad", action: "dispensed", resource: "Atorvastatin 10 mg · 90d", status: "success", category: "update" },
  { id: "au10", time: "11:12", date: "Sep 09", role: "patient", actor: "Maya Chen", action: "signed in", resource: "Personal Health Space", status: "success", category: "auth" },
  { id: "au11", time: "10:20", date: "Sep 08", role: "laboratory", actor: "Sara Kim", action: "uploaded", resource: "HbA1c result", status: "success", category: "update" },
  { id: "au12", time: "09:05", date: "Sep 08", role: "admin", actor: "System", action: "rotated session keys", resource: "Security policy", status: "success", category: "auth" },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const initialNotifications = [
  { id: "n1", title: "New lab result ready", body: "Your lipid panel from CityLab is now available.", time: "2 h ago", kind: "lab", unread: true },
  { id: "n2", title: "Access request", body: "Dr. K. Romero requested access to a restricted record. Request denied by policy.", time: "Yesterday", kind: "consent", unread: true },
  { id: "n3", title: "Refill reminder", body: "Vitamin D3 refill is due on Sep 24.", time: "Yesterday", kind: "medication", unread: false },
  { id: "n4", title: "AI summary generated", body: "Health Intelligence summarized 3 authorized records.", time: "Sep 08", kind: "ai", unread: false },
];

/* ------------------------------------------------------------------ */
/* Nurse / Lab / Pharmacy / Admin datasets                             */
/* ------------------------------------------------------------------ */

export const nurseTasks = [
  { id: "t1", label: "Record BP + HR — Jonah Whitfield (3-12)", due: "Before 11:00", done: false, priority: "high" },
  { id: "t2", label: "Fasting glucose check — Elena Rodrigues (3-04)", due: "Before 10:00", done: true, priority: "medium" },
  { id: "t3", label: "Post-op wound observation — Elena Rodrigues (3-04)", due: "14:00", done: false, priority: "high" },
  { id: "t4", label: "Update intake chart — Tomas Novak (3-15)", due: "16:00", done: false, priority: "low" },
];

export const nurseAlerts = [
  { id: "al1", patient: "Jonah Whitfield", note: "BP above threshold twice this morning", level: "high" },
  { id: "al2", patient: "Elena Rodrigues", note: "Low-grade fever recorded at 06:00", level: "medium" },
];

export const observations = [
  { id: "o1", patient: "Elena Rodrigues", note: "Resting comfortably after dressing change. Pain 2/10.", time: "08:40" },
  { id: "o2", patient: "Ingrid Halvorsen", note: "Reported improved sleep with new schedule.", time: "08:10" },
  { id: "o3", patient: "Jonah Whitfield", note: "Mild dizziness on standing — monitoring.", time: "07:55" },
];

export const labQueue = [
  { id: "lq1", test: "Lipid Panel — re-check", patient: "Maya Chen", collected: "08:15", priority: "routine", status: "Processing" },
  { id: "lq2", test: "CBC + Differential", patient: "Tomas Novak", collected: "08:40", priority: "urgent", status: "Pending" },
  { id: "lq3", test: "HbA1c", patient: "Jonah Whitfield", collected: "09:05", priority: "routine", status: "Pending" },
  { id: "lq4", test: "Electrolytes", patient: "Elena Rodrigues", collected: "09:20", priority: "urgent", status: "Pending" },
];

export const labResults = [
  { id: "lr1", test: "Troponin I", patient: "Elena Rodrigues", value: "0.02 ng/mL", flag: "Normal", time: "08:52", verified: true },
  { id: "lr2", test: "Potassium", patient: "Ingrid Halvorsen", value: "4.1 mmol/L", flag: "Normal", time: "08:31", verified: true },
  { id: "lr3", test: "CRP", patient: "Jonah Whitfield", value: "6.8 mg/L", flag: "High", time: "08:12", verified: false },
  { id: "lr4", test: "Creatinine", patient: "Tomas Novak", value: "0.9 mg/dL", flag: "Normal", time: "Yesterday", verified: true },
];

export const prescriptionsQueue = [
  { id: "pq1", medication: "Atorvastatin 10 mg", patient: "Maya Chen", prescriber: "Dr. Amara Osei", quantity: "90 tabs", status: "Ready", written: "Sep 08, 2026" },
  { id: "pq2", medication: "Metformin 500 mg", patient: "Maya Chen", prescriber: "Dr. R. Alvarez", quantity: "60 tabs", status: "Dispensing", written: "Sep 09, 2026" },
  { id: "pq3", medication: "Amlodipine 5 mg", patient: "Tomas Novak", prescriber: "Dr. Amara Osei", quantity: "30 tabs", status: "Pending review", written: "Sep 09, 2026" },
  { id: "pq4", medication: "Levothyroxine 50 µg", patient: "Ingrid Halvorsen", prescriber: "Dr. K. Romero", quantity: "90 tabs", status: "Ready", written: "Sep 07, 2026" },
];

export const medicationChanges = [
  { id: "mc1", text: "Atorvastatin renewed for 90 days by Dr. Amara Osei", date: "Sep 08, 2026", kind: "renewal" },
  { id: "mc2", text: "Lisinopril paused — BP normalized, per cardiology", date: "Aug 15, 2026", kind: "pause" },
  { id: "mc3", text: "Metformin dose confirmed at 500 mg twice daily", date: "Jul 22, 2026", kind: "confirm" },
];

export const adminUsers = [
  { id: "u1", name: "Maya Chen", role: "patient", email: "maya.chen@example.com", status: "Active", lastActive: "2 min ago" },
  { id: "u2", name: "Dr. Amara Osei", role: "doctor", email: "a.osei@lumina.health", status: "Active", lastActive: "14 min ago" },
  { id: "u3", name: "Liam Torres", role: "nurse", email: "l.torres@lumina.health", status: "Active", lastActive: "32 min ago" },
  { id: "u4", name: "Sara Kim", role: "laboratory", email: "s.kim@citylab.example", status: "Active", lastActive: "1 h ago" },
  { id: "u5", name: "Omar Haddad", role: "pharmacist", email: "o.haddad@lumina.health", status: "Active", lastActive: "3 h ago" },
  { id: "u6", name: "Dr. K. Romero", role: "doctor", email: "k.romero@lumina.health", status: "Invited", lastActive: "—" },
];

export const accessRequests = [
  { id: "ar1", requester: "Dr. K. Romero", role: "doctor", resource: "Thyroid Panel — Maya Chen", reason: "Endocrinology consult", requested: "Sep 09, 2026", risk: "restricted" },
  { id: "ar2", requester: "Research Pool #12", role: "research", resource: "Anonymized vitals cohort", reason: "Sleep study cohort", requested: "Sep 08, 2026", risk: "denied-by-consent" },
  { id: "ar3", requester: "Sara Kim", role: "laboratory", resource: "Upload permissions — HbA1c", reason: "Routine processing", requested: "Sep 08, 2026", risk: "standard" },
];

export const securityEvents = [
  { id: "se1", event: "Denied access: role not in consent scope", actor: "Dr. K. Romero", time: "Sep 09, 17:22", severity: "high" },
  { id: "se2", event: "Session keys rotated (policy)", actor: "System", time: "Sep 08, 09:05", severity: "info" },
  { id: "se3", event: "Consent updated: medication access", actor: "Maya Chen", time: "Today, 09:45", severity: "medium" },
  { id: "se4", event: "New device sign-in approved", actor: "Liam Torres", time: "Sep 07, 12:18", severity: "info" },
];

export function genAdminSeries() {
  const rnd = mulberry32(88);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d, i) => ({
    day: d,
    signins: Math.round(120 + rnd() * 160 + (i % 2) * 30),
    requests: Math.round(8 + rnd() * 22),
  }));
}

export function genRoleDistribution() {
  return [
    { role: "Patients", value: 1284, color: "#0d9488" },
    { role: "Doctors", value: 96, color: "#6366f1" },
    { role: "Nurses", value: 143, color: "#10b981" },
    { role: "Laboratory", value: 38, color: "#8b5cf6" },
    { role: "Pharmacy", value: 27, color: "#f59e0b" },
  ];
}
