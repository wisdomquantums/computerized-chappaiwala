import { PersonaChecklistSection } from "../shared/PersonaSections.jsx";

const checklist = [
  {
    title: "Production data",
    description:
      "Read-only by default. Grant write access only to shift leads.",
    status: "active",
    statusLabel: "Locked",
  },
  {
    title: "Escalation macro",
    description: "Employees can trigger macros but not edit scripts.",
    status: "active",
    statusLabel: "Healthy",
  },
  {
    title: "Sandbox refresh",
    description: "Automated weekly refresh for experimentation outside prod.",
    status: "planned",
    statusLabel: "Planned",
  },
];

const EmployeeEdit = () => (
  <PersonaChecklistSection
    eyebrow="Operational safety"
    title="Controls for employee pods"
    subtitle="Keep frontline workflows predictable with clear guardrails."
    items={checklist}
  />
);

export default EmployeeEdit;
