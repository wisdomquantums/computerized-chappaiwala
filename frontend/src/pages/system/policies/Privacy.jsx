import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Data we collect",
    items: [
      "Account basics: name, phone, email, business profile.",
      "Order inputs: artwork, copy, addresses, billing details.",
      "Usage analytics: device data that helps us improve speed and security.",
    ],
  },
  {
    heading: "How we use it",
    content:
      "Information powers order routing, proof collaboration, invoicing, and proactive support. We never sell data. Trusted logistics and payment partners receive only what they need to complete your request.",
  },
  {
    heading: "Storage & security",
    items: [
      "Artwork libraries sit inside encrypted storage with role-based access.",
      "We retain order data for 24 months for compliance, unless you request deletion earlier.",
      "Backups are maintained within India to align with local data directives.",
    ],
  },
  {
    heading: "Your controls",
    items: [
      "Request exports or deletions by emailing privacy@computerizedchhappaiwala.com.",
      "Update contact information anytime inside your account settings.",
      "Withdraw marketing consent via the unsubscribe link in emails.",
    ],
  },
];

const Privacy = () => (
  <PolicyPage
    title="Privacy Policy"
    intro="We only collect the details required to deliver precision printing and timely support. Here is the fine print."
    sections={sections}
  />
);

export default Privacy;
