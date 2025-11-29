const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const isAbsoluteUrl = (value = "") => {
    if (!value) return false;
    return /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("data:");
};

export const resolveAssetUrl = (value) => {
    if (!value) return value;
    if (isAbsoluteUrl(value)) return value;
    const normalizedPath = value.startsWith("/") ? value : `/${value}`;
    return `${ASSET_BASE_URL}${normalizedPath}`;
};

export const getAssetBaseUrl = () => ASSET_BASE_URL;

export default resolveAssetUrl;
