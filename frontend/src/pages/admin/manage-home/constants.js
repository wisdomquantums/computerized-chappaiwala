export const HOME_SECTION_KEYS = {
    HERO: "hero",
    STATS: "stats",
    CAPABILITY: "capability",
    SERVICE: "service",
    PORTFOLIO: "portfolio",
    CONTACT: "contact",
    CTA: "cta",
};

export const HOME_SECTION_ORDER = [
    HOME_SECTION_KEYS.HERO,
    HOME_SECTION_KEYS.STATS,
    HOME_SECTION_KEYS.CAPABILITY,
    HOME_SECTION_KEYS.SERVICE,
    HOME_SECTION_KEYS.PORTFOLIO,
    HOME_SECTION_KEYS.CONTACT,
    HOME_SECTION_KEYS.CTA,
];

export const sectionCopy = {
    [HOME_SECTION_KEYS.HERO]: {
        label: "Hero Slides",
        meta: "Homepage hero",
        description:
            "Control every slide on the homepage hero carousel including badge, heading, description, and background.",
        empty: "No hero slides configured yet.",
        fields: [
            { name: "badge", label: "Badge", placeholder: "Offset Printing" },
            {
                name: "title",
                label: "Title",
                placeholder: "Large volume jobs with crystal-clear detail",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Premium offset presses...",
                required: true,
            },
            {
                name: "image",
                label: "Background image",
                type: "image",
                placeholder: "https://",
                required: true,
            },
        ],
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "badge", label: "Badge" },
            { key: "description", label: "Description", truncate: true },
            { key: "image", label: "Background", type: "image" },
        ],
    },
    [HOME_SECTION_KEYS.STATS]: {
        label: "About Stats",
        meta: "About snapshot",
        description: "Short metrics inspired by the About page.",
        empty: "No stats configured yet.",
        fields: [
            { name: "value", label: "Value", placeholder: "500+", required: true },
            {
                name: "title",
                label: "Label",
                placeholder: "Custom cards yearly",
                required: true,
            },
            {
                name: "description",
                label: "Helper text",
                placeholder: "Optional sub-copy",
            },
        ],
        tableColumns: [
            { key: "value", label: "Value" },
            { key: "title", label: "Label" },
            { key: "description", label: "Helper" },
        ],
    },
    [HOME_SECTION_KEYS.CAPABILITY]: {
        label: "Capabilities",
        meta: "Capability cards",
        description: "Highlights that explain what the studio excels at.",
        empty: "No capability highlights yet.",
        fields: [
            {
                name: "title",
                label: "Title",
                placeholder: "End-to-end printing",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Wedding cards, flex...",
                required: true,
            },
        ],
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "description", label: "Description", truncate: true },
        ],
    },
    [HOME_SECTION_KEYS.SERVICE]: {
        label: "Service Preview",
        meta: "Services snapshot",
        description:
            "Cards that tease the Services page (category, title, price, and CTA).",
        empty: "No service preview cards yet.",
        fields: [
            {
                name: "badge",
                label: "Badge",
                placeholder: "Most Loved",
            },
            {
                name: "detail",
                label: "Category",
                placeholder: "Shaadi Card",
                required: true,
            },
            {
                name: "title",
                label: "Title",
                placeholder: "Wedding Card Printing",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Foil, emboss, laser-cut...",
                required: true,
            },
            {
                name: "price",
                label: "Price label",
                placeholder: "From ₹24 / card",
            },
            { name: "linkLabel", label: "CTA label", placeholder: "View details" },
            { name: "linkUrl", label: "CTA link", placeholder: "/services" },
        ],
        tableColumns: [
            { key: "title", label: "Service" },
            { key: "detail", label: "Category" },
            { key: "price", label: "Price" },
            { key: "badge", label: "Badge" },
        ],
    },
    [HOME_SECTION_KEYS.PORTFOLIO]: {
        label: "Portfolio Highlights",
        meta: "Portfolio spotlight",
        description: "Entries pulled into the homepage from the portfolio library.",
        empty: "No portfolio highlight cards yet.",
        fields: [
            {
                name: "badge",
                label: "Category",
                placeholder: "Wedding Cards",
                required: true,
            },
            {
                name: "title",
                label: "Title",
                placeholder: "Wedding Card Design",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Layered matte finish...",
                required: true,
            },
            {
                name: "image",
                label: "Cover image",
                type: "image",
                placeholder: "https://",
                required: true,
            },
        ],
        tableColumns: [
            { key: "title", label: "Project" },
            { key: "badge", label: "Category" },
            { key: "description", label: "Description", truncate: true },
            { key: "image", label: "Image", type: "image" },
        ],
    },
    [HOME_SECTION_KEYS.CONTACT]: {
        label: "Contact Channels",
        meta: "Contact teaser",
        description:
            "Call, WhatsApp, and visit cards mirrored from the Contact Us page.",
        empty: "No contact channels saved yet.",
        fields: [
            {
                name: "title",
                label: "Eyebrow",
                placeholder: "Call the Studio",
                required: true,
            },
            {
                name: "detail",
                label: "Detail",
                placeholder: "+91 74889 86015",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Speak directly with...",
                required: true,
            },
            { name: "linkUrl", label: "Link", placeholder: "tel:+9174..." },
        ],
        tableColumns: [
            { key: "title", label: "Channel" },
            { key: "detail", label: "Detail" },
            { key: "description", label: "Description", truncate: true },
            { key: "linkUrl", label: "Link" },
        ],
    },
    [HOME_SECTION_KEYS.CTA]: {
        label: "CTA Banner",
        meta: "Final CTA",
        description:
            "Control the closing CTA (eyebrow, title, description, and dual buttons).",
        empty: "CTA banner not configured yet.",
        fields: [
            { name: "badge", label: "Eyebrow", placeholder: "Ready to collaborate?" },
            {
                name: "title",
                label: "Title",
                placeholder: "Let’s combine the best of...",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Book a discovery call...",
                required: true,
            },
            { name: "linkLabel", label: "Primary CTA label", placeholder: "Talk to the team" },
            { name: "linkUrl", label: "Primary CTA link", placeholder: "/contact" },
            { name: "secondaryLabel", label: "Secondary CTA label", placeholder: "See more work" },
            { name: "secondaryUrl", label: "Secondary CTA link", placeholder: "/portfolio" },
        ],
        tableColumns: [
            { key: "title", label: "Headline" },
            { key: "badge", label: "Eyebrow" },
            { key: "linkLabel", label: "Primary CTA" },
            { key: "secondaryLabel", label: "Secondary CTA" },
        ],
    },
};
