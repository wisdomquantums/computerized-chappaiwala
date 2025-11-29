import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Coverage",
    content:
      "We ship pan-India using Bluedart, Delhivery, DTDC, and regional partners. Same-city drops within Sitamarhi and Patna are handled by our verified riders for faster turnarounds.",
  },
  {
    heading: "Timelines",
    items: [
      "Standard production: 3-5 business days once artwork is approved.",
      "Express print: 24-48 hours for eligible SKUs (rush fee applies).",
      "Transit: 1-4 days depending on pin code and courier serviceability.",
    ],
  },
  {
    heading: "Tracking",
    items: [
      "Order dashboard shows live status stages from prepress to dispatch.",
      "Tracking IDs are auto-emailed and shared on WhatsApp.",
      "Account managers proactively alert you if weather or logistics cause delays.",
    ],
  },
  {
    heading: "Charges",
    content:
      "Local deliveries over ₹10,000 are complimentary. Outstation freight is calculated at checkout based on weight, dimensions, and destination tier.",
  },
];

const Shipping = () => (
  <PolicyPage
    title="Shipping Policy"
    intro="Know how we pack, dispatch, and keep every shipment traceable until it reaches your doorstep."
    sections={sections}
  />
);

export default Shipping;
