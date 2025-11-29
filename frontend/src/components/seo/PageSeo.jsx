import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { BRAND_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../../constants/seo";

const sanitizePath = (path) => {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
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
  const hasBrand = title?.toLowerCase().includes(BRAND_NAME.toLowerCase());
  const fullTitle = hasBrand ? title : `${title} | ${BRAND_NAME}`;
  const canonical = sanitizePath(path);
  const ogImage = image?.startsWith("http") ? image : `${SITE_URL}${image}`;
  const keywordContent = keywords.filter(Boolean).join(", ");
  const ldJson = structuredData ? JSON.stringify(structuredData) : null;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={BRAND_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {ldJson && <script type="application/ld+json">{ldJson}</script>}
    </Helmet>
  );
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
