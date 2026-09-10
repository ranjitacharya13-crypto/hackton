/**
 * Mock AI engine — pure frontend simulation.
 * Produces structured responses (answer, sources, context, safety, pipeline)
 * based on the active role and simple keyword matching. No real model involved.
 */

const PIPELINE = [
  { id: "permission", label: "Permission Check", detail: "Verified your role and the consent scope for this request." },
  { id: "retrieval", label: "Records Retrieved", detail: "Selected authorized records likely relevant to the question." },
  { id: "rag", label: "RAG Context", detail: "Retrieves the relevant information from the available records." },
  { id: "hrm", label: "HRM Reasoning", detail: "Provides the reasoning layer for the retrieved information." },
  { id: "insight", label: "AI Insight", detail: "Composed a role-appropriate, evidence-linked answer." },
];

const SOURCES = {
  vitals: [
    { type: "Vitals", label: "Vitals — Sep 2026", date: "01 Sep 2026", relevance: 88 },
    { type: "Vitals", label: "Vitals — Jun 2026", date: "01 Jun 2026", relevance: 76 },
  ],
  blood: [
    { type: "Blood Test", label: "Blood Test — August", date: "03 Aug 2026", relevance: 92 },
    { type: "Blood Test", label: "Blood Test — June", date: "12 Jun 2026", relevance: 94 },
  ],
  meds: [
    { type: "Medication", label: "Atorvastatin 10 mg", date: "04 Jun 2026", relevance: 81 },
    { type: "Medication", label: "Metformin 500 mg", date: "04 Jun 2026", relevance: 74 },
  ],
  visit: [
    { type: "Visit", label: "Cardiology Consult", date: "28 Aug 2026", relevance: 90 },
    { type: "Visit", label: "Annual Physical", date: "20 May 2026", relevance: 68 },
  ],
};

function pickSources(keys) {
  const seen = new Set();
  const out = [];
  keys.forEach((k) => {
    (SOURCES[k] || []).forEach((s) => {
      if (!seen.has(s.label)) {
        seen.add(s.label);
        out.push(s);
      }
    });
  });
  return out.sort((a, b) => b.relevance - a.relevance);
}

const SAFETY_PATIENT =
  "This is an informational summary generated from your authorized records. It is not a medical diagnosis — please discuss any concerns with your care team.";
const SAFETY_CLINICAL =
  "Conceptual demonstration output. Values are drawn from authorized mock records and must be verified against source documents before clinical decisions.";

function respondPatient(prompt) {
  const p = prompt.toLowerCase();
  if (/(change|changed|recent|trend)/.test(p)) {
    return {
      answer:
        "Your available records show an upward change between the earlier and latest recorded values. Systolic blood pressure has moved from around 112 mmHg in June to 118 mmHg in September, while your resting heart rate stayed stable near 72 bpm. Glucose readings improved slightly after the June medication review, and your weight is down about 0.5 kg.",
      sources: pickSources(["blood", "vitals"]),
      context: "Compared June–September records you authorized for personal insights.",
      safety: SAFETY_PATIENT,
      recordsUsed: 5,
    };
  }
  if (/(summar|latest report|report)/.test(p)) {
    return {
      answer:
        "Your latest report is the Lipid Panel from Aug 3, 2026. LDL cholesterol improved to 112 mg/dL (down from 138 in May), HDL is stable at 58 mg/dL, and triglycerides are within range. The cardiology note recommends continuing your current statin dose and re-checking in 6 weeks.",
      sources: pickSources(["blood", "visit"]),
      context: "Summary built from the Aug 2026 lipid panel and the related cardiology consult note.",
      safety: SAFETY_PATIENT,
      recordsUsed: 3,
    };
  }
  if (/(medic|prescription|drug|pill)/.test(p)) {
    return {
      answer:
        "You have three active medications: Atorvastatin 10 mg nightly (cholesterol, 96% adherence), Metformin 500 mg twice daily (glucose control), and Vitamin D3 2000 IU daily. Lisinopril was paused on Aug 15 after your blood pressure normalized, and an Amoxicillin course was completed in April.",
      sources: pickSources(["meds", "visit"]),
      context: "Medication timeline assembled from prescriptions active since March 2026.",
      safety: SAFETY_PATIENT,
      recordsUsed: 4,
    };
  }
  if (/(vital|compare|bp|blood pressure|glucose|heart rate)/.test(p)) {
    return {
      answer:
        "Across the last 30 days your vitals are mostly stable: blood pressure averages 118/76 mmHg with a mild upward systolic trend, resting heart rate averages 72 bpm, glucose averages 94 mg/dL (improving), and sleep averages 7.2 hours per night. Activity is trending up at ~8,400 steps per day.",
      sources: pickSources(["vitals", "blood"]),
      context: "Aggregated wearable syncs and spot measurements from Jun–Sep 2026.",
      safety: SAFETY_PATIENT,
      recordsUsed: 6,
    };
  }
  if (/(appointment|schedule|visit)/.test(p)) {
    return {
      answer:
        "Your next appointment is a cardiology follow-up with Dr. Amara Osei on Sep 14 at 10:30, followed by a lipid re-check blood draw on Sep 22 at 08:15. Your last completed visit was the cardiology consultation on Aug 28.",
      sources: pickSources(["visit"]),
      context: "Drawn from your authorized appointment calendar.",
      safety: SAFETY_PATIENT,
      recordsUsed: 2,
    };
  }
  return {
    answer:
      "I can help you explore your authorized health records. Try asking what changed recently, for a summary of your latest report, your medication history, or a comparison of recent vitals. Every answer shows which records were used and the consent scope applied.",
    sources: pickSources(["vitals"]),
    context: "General orientation — no specific records were retrieved yet.",
    safety: SAFETY_PATIENT,
    recordsUsed: 0,
  };
}

function respondDoctor(prompt) {
  const p = prompt.toLowerCase();
  if (/(summar|history)/.test(p)) {
    return {
      answer:
        "Patient Maya C., 32 — hypertension follow-up. Since the last visit: systolic BP trending mildly upward (112 → 118 mmHg over 12 weeks), resting HR stable at 72 bpm. Lipid panel (Aug 3) shows LDL down 19% to 112 mg/dL on Atorvastatin 10 mg. Lisinopril paused Aug 15 after normalization. ECG at Aug 28 consult: normal sinus rhythm. Plan: re-check in 6 weeks.",
      sources: pickSources(["visit", "blood", "meds"]),
      context: "Consented clinical scope for Maya C. — records from May–Sep 2026.",
      safety: SAFETY_CLINICAL,
      recordsUsed: 7,
    };
  }
  if (/(change|since the last visit)/.test(p)) {
    return {
      answer:
        "Since the Aug 28 visit for Maya C.: home BP average is 118/76 mmHg (vs 116/74 at visit), adherence remains high (Atorvastatin 96%, Metformin 91%). No new reports have been filed. The Sep 22 lipid re-check is still pending and will be the next material data point.",
      sources: pickSources(["vitals", "meds", "blood"]),
      context: "Changes computed against the Aug 28 cardiology baseline.",
      safety: SAFETY_CLINICAL,
      recordsUsed: 5,
    };
  }
  if (/(report|relevant)/.test(p)) {
    return {
      answer:
        "Relevant reports for this patient: Lipid Panel (Aug 3, 2026 — LDL 112 mg/dL, borderline flag), Complete Blood Count (Jun 12, 2026 — all normal), and the Cardiology Consult Report (Aug 28, 2026 — stable ECG, mild upward BP trend noted). The CBC and thyroid panel are older than 90 days.",
      sources: pickSources(["blood", "visit"]),
      context: "Ranked by recency and relevance to the active care plan.",
      safety: SAFETY_CLINICAL,
      recordsUsed: 4,
    };
  }
  return {
    answer:
      "Clinical Intelligence can summarize a patient's recent history, surface what changed since the last visit, or retrieve the most relevant reports — always within the consented scope for that patient.",
    sources: pickSources(["visit"]),
    context: "General orientation for the clinical workspace.",
    safety: SAFETY_CLINICAL,
    recordsUsed: 0,
  };
}

function respondNurse() {
  return {
    answer:
      "Today's priority list: Jonah Whitfield (3-12) needs BP + HR recording before 11:00 — two readings exceeded threshold this morning. Elena Rodrigues (3-04) has a post-op wound observation at 14:00 and a low-grade fever recorded at 06:00. All other assigned vitals are on schedule.",
    sources: pickSources(["vitals"]),
    context: "Assigned ward list and this morning's recorded observations.",
    safety: SAFETY_CLINICAL,
    recordsUsed: 3,
  };
}

function respondLaboratory() {
  return {
    answer:
      "Recent report changes: the Lipid Panel for Maya C. was verified on Sep 8 after instrument QC passed. HbA1c results were uploaded Sep 8 and verified. One CRP result (Jonah W., 6.8 mg/L) is flagged high and awaits verification. No reports were amended after verification in the last 7 days.",
    sources: pickSources(["blood"]),
    context: "Laboratory information system events from the last 7 days.",
    safety: SAFETY_CLINICAL,
    recordsUsed: 4,
  };
}

function respondPharmacist() {
  return {
    answer:
      "Recent medication changes: Atorvastatin 10 mg was renewed for 90 days on Sep 8 (Dr. Osei); Lisinopril 5 mg was paused on Aug 15 after blood pressure normalized; Metformin dose was confirmed at 500 mg twice daily on Jul 22. Current dispensing queue has 2 items ready and 1 pending review.",
    sources: pickSources(["meds"]),
    context: "Medication scope only — full clinical records are not visible to this role.",
    safety: SAFETY_CLINICAL,
    recordsUsed: 3,
  };
}

function respondAdmin() {
  return {
    answer:
      "Recent system activity: 1,428 sign-ins this week (+6% vs last week). 3 access requests are pending — 1 was auto-denied because the requested record falls outside the patient's consent scope (Thyroid Panel). No anomalous bulk-access patterns detected. Session keys were rotated on schedule Sep 8.",
    sources: [
      { type: "System", label: "Access events — 7 days", date: "09 Sep 2026", relevance: 91 },
      { type: "System", label: "Security policy log", date: "08 Sep 2026", relevance: 77 },
    ],
    context: "Anonymized aggregates — patient content is never exposed to this role.",
    safety: "System Intelligence shows operational patterns only. Individual health content is never accessible to administrators.",
    recordsUsed: 2,
  };
}

export function getMockResponse(roleId, prompt) {
  let base;
  switch (roleId) {
    case "doctor":
      base = respondDoctor(prompt);
      break;
    case "nurse":
      base = respondNurse(prompt);
      break;
    case "laboratory":
      base = respondLaboratory();
      break;
    case "pharmacist":
      base = respondPharmacist();
      break;
    case "admin":
      base = respondAdmin();
      break;
    default:
      base = respondPatient(prompt);
  }
  return { ...base, pipeline: PIPELINE };
}

export const THINKING_STAGES = [
  "Checking consent scope…",
  "Retrieving authorized records…",
  "Building context (RAG)…",
  "Reasoning (HRM)…",
  "Composing insight…",
];
