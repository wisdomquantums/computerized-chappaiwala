import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Service scope",
    content:
      "Computerized Chhappaiwala delivers design, print, and fulfillment solutions for agencies and businesses across India. Orders are logged through our portal, WhatsApp channel, or account managers, and each request receives a production ID for tracking.",
  },
  {
    heading: "Pricing & approvals",
    items: [
      "Quotes remain valid for 15 days unless specified otherwise.",
      "Production begins only after artwork approval and advance payment confirmation.",
      "Urgent orders attract rush fees that are shared upfront.",
    ],
  },
  {
    heading: "Liability",
    content:
      "We take pride in our QC standards, yet natural substrate variation or courier delays may occur. Our responsibility is limited to reprinting or refunding the affected line item after joint investigation.",
  },
  {
    heading: "Usage",
    items: [
      "Customers must own rights to the assets they submit.",
      "Sensitive or prohibited content is not accepted per Indian regulations.",
      "We may showcase anonymized work samples unless you opt out in writing.",
    ],
  },
];

const Terms = () => (
  <PolicyPage
    title="Terms & Conditions"
    intro="Everything you need to know about working with Computerized Chhappaiwala and how we keep every project predictable."
    sections={sections}
  />
);

export default Terms;
