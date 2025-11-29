import { PersonaChecklistSection } from "../shared/PersonaSections.jsx";

const checklist = [
  {
    title: "Capital approvals",
    description: "2FA required plus finance cosign for spends above ₹5L.",
    status: "active",
    statusLabel: "Active",
  },
  {
    title: "Incident authority",
    description: "Owners can override SLAs but every action is auto-logged.",
    status: "active",
    statusLabel: "Tracked",
  },
  {
    title: "Data rooms",
    description: "One-click revoke for temporary vendor access windows.",
    status: "planned",
    statusLabel: "Next sprint",
  },
];

const OwnerEdit = () => (
  <PersonaChecklistSection
    eyebrow="Executive controls"
    title="Safety checklist"
    subtitle="Non-negotiable guardrails before granting owner powers."
    items={checklist}
  />
);

export default OwnerEdit;
