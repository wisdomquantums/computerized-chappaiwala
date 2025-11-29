import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Eligibility",
    content:
      "Refunds apply when delivered goods deviate from approved proofs, arrive damaged, or miss agreed timelines without prior notice. Custom work with client-supplied files is evaluated on a case-by-case basis.",
  },
  {
    heading: "Process",
    items: [
      "Raise a ticket within 3 days of delivery with photos and order ID.",
      "Our QA pod reviews the issue inside 48 business hours.",
      "We either reprint the affected quantity or trigger a refund to the original payment method.",
    ],
  },
  {
    heading: "Exclusions",
    items: [
      "Color differences caused by uncalibrated displays or non-standard substrates.",
      "User typos or design changes requested after approval.",
      "Delays created by courier partners during force majeure situations.",
    ],
  },
  {
    heading: "Contact",
    content:
      "Write to support@computerizedchhappaiwala.com or WhatsApp +91 70044 00011 for fast escalation.",
  },
];

const Refund = () => (
  <PolicyPage
    title="Refund Policy"
    intro="If something is off, we fix it. Review how we evaluate claims and keep every project fair for both teams."
    sections={sections}
  />
);

export default Refund;
