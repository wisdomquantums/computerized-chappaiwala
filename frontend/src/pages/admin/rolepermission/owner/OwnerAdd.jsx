import { PersonaHighlightsSection } from "../shared/PersonaSections.jsx";

const ownerHighlights = [
  {
    label: "Strategic programs",
    value: "12 live",
    trend: "+3",
    hint: "Multi-quarter initiatives owners oversee",
  },
  {
    label: "Budget runway",
    value: "9.4 months",
    trend: "+0.6",
    hint: "Modeled with current burn",
  },
  {
    label: "Executive reviews",
    value: "4 scheduled",
    trend: "next 14d",
    hint: "Boards + steering moments on calendar",
  },
];

const OwnerAdd = () => (
  <PersonaHighlightsSection
    eyebrow="Leadership cockpit"
    title="Owner metrics"
    subtitle="Signal stack for executives before approving changes."
    items={ownerHighlights}
  />
);

export default OwnerAdd;
