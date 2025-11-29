import { PersonaJourneySection } from "../shared/PersonaSections.jsx";

const customerJourneys = [
  {
    title: "Sign-in + MFA",
    window: "0-1 min",
    description:
      "Verify identity with one-tap email and optional SMS MFA before showing orders.",
  },
  {
    title: "Order review",
    window: "1-4 min",
    description:
      "Expose current order slate with scoped visibility on pricing and invoices only.",
  },
  {
    title: "Action center",
    window: "4-7 min",
    description:
      "Enable uploads, change requests, and approvals tied to the assigned account rep.",
  },
];

const CustomerCommonFormAdd = () => (
  <PersonaJourneySection
    eyebrow="Journey orchestration"
    title="Customer touchpoints"
    subtitle="Blueprint the steps each client follows inside the portal."
    journeys={customerJourneys}
  />
);

export default CustomerCommonFormAdd;
