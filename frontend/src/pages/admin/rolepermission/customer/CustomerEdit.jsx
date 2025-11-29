import { PersonaChecklistSection } from "../shared/PersonaSections.jsx";

const checklist = [
  {
    title: "Sensitive files",
    description:
      "Restrict CAD and pricing attachments to verified contacts only.",
    status: "active",
    statusLabel: "Enforced",
  },
  {
    title: "Support escalations",
    description: "Auto-route severity-1 tickets to the account pod lead.",
    status: "active",
    statusLabel: "Synced",
  },
  {
    title: "Invoice visibility",
    description:
      "Mask in-flight invoices until finance publishes final version.",
    status: "paused",
    statusLabel: "Paused",
  },
];

const CustomerEdit = () => (
  <PersonaChecklistSection
    eyebrow="Safeguards"
    title="Customer-facing controls"
    subtitle="Quick audit of must-have guardrails before rolling out changes."
    items={checklist}
  />
);

export default CustomerEdit;
