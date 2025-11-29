import { useEffect } from "react";
import PropTypes from "prop-types";
import { BRAND_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../../constants/seo";

const sanitizePath = (path) => {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

const upsertMetaTag = (attribute, value, content) => {
  if (typeof document === "undefined") return;
  const selector = `meta[${attribute}="${value}"]`;
  let tag = document.head.querySelector(selector);

  if (!content) {
    if (tag) {
      tag.parentNode.removeChild(tag);
    }
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertLinkTag = (rel, href) => {
  if (typeof document === "undefined" || !href) return;
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const PageSeo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  keywords = [],
  structuredData = null,
  robots = "index,follow",
}) => {
  const hasBrand = title
    ?.toLowerCase()
    .includes(BRAND_NAME.toLowerCase());
  const fullTitle = hasBrand ? title : `${title} | ${BRAND_NAME}`;
  const canonical = sanitizePath(path);
  const ogImage = image?.startsWith("http") ? image : `${SITE_URL}${image}`;
  const keywordContent = keywords.filter(Boolean).join(", ");
  const ldJson = structuredData ? JSON.stringify(structuredData) : null;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = fullTitle;
    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", robots);
    upsertMetaTag("name", "keywords", keywordContent);

    upsertMetaTag("property", "og:title", fullTitle);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:type", type);
    upsertMetaTag("property", "og:url", canonical);
    upsertMetaTag("property", "og:image", ogImage);
    upsertMetaTag("property", "og:site_name", BRAND_NAME);

    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", fullTitle);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", ogImage);

    upsertLinkTag("canonical", canonical);
  }, [
    fullTitle,
    description,
    robots,
    keywordContent,
    canonical,
    ogImage,
    type,
  ]);

  useEffect(() => {
    if (!ldJson || typeof document === "undefined") return undefined;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.pageSeo = canonical;
    script.text = ldJson;
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [ldJson, canonical]);

  return null;
};

PageSeo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  robots: PropTypes.string,
};

export default PageSeo;
