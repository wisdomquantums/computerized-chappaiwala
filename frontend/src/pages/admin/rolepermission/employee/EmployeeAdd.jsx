import { PersonaHighlightsSection } from "../shared/PersonaSections.jsx";

const employeeHighlights = [
  {
    label: "Ops pods",
    value: "38 active",
    trend: "+2 pods",
    hint: "Teams running this role configuration",
  },
  {
    label: "Automation coverage",
    value: "76%",
    trend: "+6%",
    hint: "Tasks handled without human review",
  },
  {
    label: "Policy violations",
    value: "3 this week",
    trend: "-25%",
    hint: "Flagged attempts outside playbook",
  },
];

const EmployeeAdd = () => (
  <PersonaHighlightsSection
    eyebrow="Ops signal"
    title="Team performance overview"
    subtitle="Understand how the employee role performs in production."
    items={employeeHighlights}
  />
);

export default EmployeeAdd;
