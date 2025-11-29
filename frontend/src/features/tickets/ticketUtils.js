export const TICKET_STATUS_OPTIONS = [
    "Open",
    "Acknowledged",
    "In progress",
    "Waiting on customer",
    "Resolved",
    "Closed",
];

export const TICKET_PRIORITY_OPTIONS = [
    "Low",
    "Normal",
    "High",
    "Urgent",
];

export const TICKET_CATEGORY_OPTIONS = [
    "Order issue",
    "Delivery",
    "Billing",
    "Product quality",
    "Account",
    "Other",
];

export const normalizeTicket = (ticket) => {
    if (!ticket) return null;
    return {
        ...ticket,
        attachments: Array.isArray(ticket.attachments)
            ? ticket.attachments
            : [],
        status: ticket.status || "Open",
        priority: ticket.priority || "Normal",
        category: ticket.category || "Order issue",
    };
};

export const normalizeTicketCollection = (tickets) =>
    Array.isArray(tickets)
        ? tickets.map((ticket) => normalizeTicket(ticket)).filter(Boolean)
        : [];

export const ticketStatusTone = (status = "open") => {
    const key = status.toLowerCase();
    if (key.includes("resolved") || key.includes("closed")) return "resolved";
    if (key.includes("progress")) return "progress";
    if (key.includes("wait")) return "waiting";
    return "open";
};
