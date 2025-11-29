export const extractOrderError = (error, fallback = "Something went wrong") => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
};

export const normalizeOrder = (order = {}) => {
    const normalized = { ...order };
    normalized.tags = Array.isArray(order.tags) ? order.tags : [];
    normalized.customer = order.customer || null;
    normalized.channel = order.channel || "Website";
    normalized.priority = order.priority || "Medium";
    normalized.status = order.status || "Pending";
    normalized.quantity =
        typeof order.quantity === "number"
            ? order.quantity
            : Number(order.quantity) || 1;
    normalized.clientName = order.clientName || order.customer?.name || "";
    normalized.clientEmail = order.clientEmail || order.customer?.email || "";
    normalized.projectName = order.projectName || "";
    normalized.serviceLine = order.serviceLine || "";
    normalized.dueDate = order.dueDate || "";
    return normalized;
};

export const normalizeOrderCollection = (collection = []) =>
    collection.map((item) => normalizeOrder(item));
