import { PersonaJourneySection } from "../shared/PersonaSections.jsx";

const employeeJourneys = [
  {
    title: "Shift handoff",
    window: "Start of day",
    description:
      "Validate device, VPN status, and queued tasks before unlocking tooling.",
  },
  {
    title: "Work execution",
    window: "During shift",
    description:
      "Scoped access to active requests, service catalog, and queue automations based on pod.",
  },
  {
    title: "Wrap + coaching",
    window: "End of day",
    description:
      "Snapshot productivity, QA samples, and collect coaching inputs.",
  },
];

const EmployeeCommonFormAdd = () => (
  <PersonaJourneySection
    eyebrow="Employee lifecycle"
    title="Shift checkpoints"
    subtitle="Hard stops to keep production-grade quality in motion."
    journeys={employeeJourneys}
  />
);

export default EmployeeCommonFormAdd;
