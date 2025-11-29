export const formatAddressForDisplay = (address = {}) => {
    if (!address) return "";
    const segments = [
        address.line1,
        address.line2,
        address.landmark,
        [address.city, address.state].filter(Boolean).join(", "),
        address.pincode,
    ]
        .flat()
        .map((segment) => (typeof segment === "string" ? segment.trim() : ""))
        .filter(Boolean);

    return segments.join(", ");
};
