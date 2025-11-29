import { PersonaHighlightsSection } from "../shared/PersonaSections.jsx";

const customerHighlights = [
  {
    label: "Portal sessions",
    value: "2.4k",
    trend: "+12% vs last week",
    hint: "Active clients visiting the workspace",
  },
  {
    label: "Realtime approvals",
    value: "318",
    trend: "+4.3%",
    hint: "Orders auto-cleared after SLA rules",
  },
  {
    label: "Escalations",
    value: "7 open",
    trend: "-18%",
    hint: "Critical tickets pending action",
  },
];

const CustomerAdd = () => (
  <PersonaHighlightsSection
    eyebrow="Customer signals"
    title="Experience health at a glance"
    subtitle="Monitor the live guardrails driving your customer workspace."
    items={customerHighlights}
  />
);

export default CustomerAdd;
