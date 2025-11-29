import { PersonaJourneySection } from "../shared/PersonaSections.jsx";

const ownerJourneys = [
  {
    title: "Signal review",
    window: "Mondays",
    description: "Digest portfolio health, NPS, and cash trending dashboards.",
  },
  {
    title: "Decision wall",
    window: "Mid-week",
    description:
      "Approve capital requests, unblock roles, and adjust guardrails for pods.",
  },
  {
    title: "Board prep",
    window: "Fridays",
    description: "Package executive-ready updates with risk + mitigation.",
  },
];

const OwnerCommonFormAdd = () => (
  <PersonaJourneySection
    eyebrow="Leadership rhythm"
    title="Owner rituals"
    subtitle="Design the feedback loops execs rely on each week."
    journeys={ownerJourneys}
  />
);

export default OwnerCommonFormAdd;
