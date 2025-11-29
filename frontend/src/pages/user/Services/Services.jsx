import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../../features/cart/cartSlice";
import { fetchServices } from "../../../features/services/servicesSlice";
import {
  fetchServicePage,
  servicePageDefaultContent,
} from "../../../features/servicePage/servicePageSlice";
import Reveal from "../../../components/ui/Reveal";
import Loader from "../../../components/ui/Loader";
import resolveAssetUrl from "../../../utils/assetUrl";
import PageSeo from "../../../components/seo/PageSeo";
import { SITE_URL, BRAND_NAME, LOGO_URL } from "../../../constants/seo";

const iconClass = "h-7 w-7 text-emerald-300";

const serviceIcons = {
  wedding: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M11 12c-1.7 0-3 1.3-3 3 0 4 8 9 8 9s8-5 8-9c0-1.7-1.3-3-3-3-1.4 0-2.6.9-3.1 2.1-.2.5-.8.5-1 0C13.6 12.9 12.4 12 11 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  cash: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <rect
        x="4"
        y="9"
        width="24"
        height="14"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
    </svg>
  ),
  letter: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <rect
        x="8"
        y="6"
        width="16"
        height="20"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="11"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="11"
        y1="16"
        x2="21"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="11"
        y1="20"
        x2="17"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  handbill: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M7 10h13l5 5-5 5H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 10v12" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <rect
        x="6"
        y="8"
        width="20"
        height="18"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 6v4M22 6v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="13"
        x2="26"
        y2="13"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="13" cy="18" r="1.2" fill="currentColor" />
      <circle cx="19" cy="18" r="1.2" fill="currentColor" />
      <circle cx="13" cy="22" r="1.2" fill="currentColor" />
      <circle cx="19" cy="22" r="1.2" fill="currentColor" />
    </svg>
  ),
  custom: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M6 10h20v12H6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 22v4h8v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="16" r="2" fill="currentColor" />
      <circle cx="20" cy="16" r="2" fill="currentColor" />
    </svg>
  ),
  default: (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <rect
        x="8"
        y="8"
        width="16"
        height="16"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
    </svg>
  ),
};

const curatedServices = [
  {
    id: "wedding-card",
    category: "Shaadi Card",
    title: "Wedding Card Printing",
    description:
      "Beautiful, customized wedding invitations printed on premium stock with foil, emboss, or laser-cut finishes to match your ceremony style.",
    iconKey: "wedding",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9356?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "₹18 / card",
    printCharge: "₹6 / color side",
    paperChargeValue: 18,
    printChargeValue: 6,
    unitLabel: "/ card",
    priceLabel: "From ₹24 / card",
    rating: 4.9,
    reviewCount: 182,
    basePrice: 24,
  },
  {
    id: "cash-memo",
    category: "Cash Memo",
    title: "Cash Memo Printing",
    description:
      "Professional cash memo and invoice books for retail counters, stitched or perforated for easy tear-off, and branded with your shop details.",
    iconKey: "cash",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1448932252197-d19750584e56?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "₹220 / pad",
    printCharge: "₹3 / page",
    paperChargeValue: 220,
    printChargeValue: 3,
    unitLabel: "/ pad",
    priceLabel: "From ₹220 / pad",
    rating: 4.7,
    reviewCount: 138,
    basePrice: 220,
  },
  {
    id: "letter-pad",
    category: "Letter Pad",
    title: "Letter Pad Printing",
    description:
      "High-quality letterheads for offices and organizations with crisp typography, watermark logos, and smooth writing experience.",
    iconKey: "letter",
    image:
      "https://images.unsplash.com/photo-1517840545245-b4def3cabcb4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517840545245-b4def3cabcb4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484887243710-766214654dfd?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "₹180 / 100 sheets",
    printCharge: "₹4 / sheet",
    paperChargeValue: 180,
    printChargeValue: 4,
    unitLabel: "/ set",
    priceLabel: "From ₹180 / set",
    rating: 4.8,
    reviewCount: 165,
    basePrice: 180,
  },
  {
    id: "hand-bill",
    category: "Hand Bill",
    title: "Hand Bill / Pamphlet Printing",
    description:
      "Affordable handbill and pamphlet printing for promotions, available in single or multi-color runs with express same-day delivery.",
    iconKey: "handbill",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "₹2.5 / sheet",
    printCharge: "₹1.5 / side",
    paperChargeValue: 2.5,
    printChargeValue: 1.5,
    unitLabel: "/ sheet",
    priceLabel: "From ₹4 / sheet",
    rating: 4.6,
    reviewCount: 94,
    basePrice: 4,
  },
  {
    id: "calendar",
    category: "Calendar",
    title: "Custom Calendar Printing",
    description:
      "Personalized wall and desk calendars that keep your brand visible all year with photo, festival, and planner layouts.",
    iconKey: "calendar",
    image:
      "https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "₹120 / set",
    printCharge: "₹12 / month",
    paperChargeValue: 120,
    printChargeValue: 12,
    unitLabel: "/ set",
    priceLabel: "From ₹120 / set",
    rating: 4.8,
    reviewCount: 121,
    basePrice: 120,
  },
  {
    id: "custom-printing",
    category: "Custom Printing",
    title: "Custom Printing Services",
    description:
      "From packaging sleeves to event collaterals, print anything you need with meticulous color matching and fast doorstep delivery.",
    iconKey: "custom",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    ],
    paperCharge: "On demand",
    printCharge: "From ₹3 / sq.in",
    paperChargeValue: null,
    printChargeValue: null,
    unitLabel: "",
    priceLabel: "Quote as per brief",
    rating: 4.95,
    reviewCount: 210,
    basePrice: 0,
  },
];

const ALL_CATEGORY = "All Services";

const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Printing services by Computerized Chhappaiwala",
  url: `${SITE_URL}/services`,
  description:
    "Wedding cards, cash memos, letterheads, calendars, and custom printing solutions fulfilled from Sitamarhi, Bihar.",
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
  },
  mainEntity: curatedServices.map((service) => ({
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.category,
    areaServed: "Sitamarhi, Bihar",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: service.basePrice || 0,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/services`,
    },
  })),
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return currencyFormatter.format(value);
};

const getFinalPriceLabel = (service) => {
  const { paperChargeValue, printChargeValue, unitLabel, priceLabel } = service;
  if (
    typeof paperChargeValue === "number" &&
    typeof printChargeValue === "number"
  ) {
    const sum = paperChargeValue + printChargeValue;
    const formattedSum = formatCurrency(sum);
    if (!formattedSum) return priceLabel;
    return unitLabel ? `${formattedSum} ${unitLabel}` : formattedSum;
  }
  return priceLabel;
};

const getPriceBreakdown = (service) => {
  const paper = formatCurrency(service.paperChargeValue);
  const print = formatCurrency(service.printChargeValue);
  if (paper && print) {
    return `${paper} paper + ${print} print`;
  }
  return "Custom quote based on specs";
};

// Small per-card component that manages a gallery carousel with autoplay
const ServiceCard = ({ service, autoplay = 3500, onBuyNow, onAddToCart }) => {
  const gallerySources = service.gallery?.length
    ? service.gallery
    : [service.image];
  const normalizedGallery = gallerySources
    .map((src) => resolveAssetUrl(src))
    .filter((src) => typeof src === "string" && src.length > 0);
  const fallbackImage = resolveAssetUrl(service.image);
  const gallery = normalizedGallery.length
    ? normalizedGallery
    : fallbackImage
    ? [fallbackImage]
    : [""];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const length = gallery.length;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (length <= 1) return undefined;
    if (paused) return undefined;

    intervalRef.current = setInterval(() => {
      setActive((s) => (s + 1) % length);
    }, autoplay);

    return () => clearInterval(intervalRef.current);
  }, [length, paused, autoplay]);

  const onThumbClick = (index) => setActive(index);
  const onMainClick = () => {
    if (length > 1) setActive((s) => (s + 1) % length);
  };

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleAddClick = () => onAddToCart?.(service, quantity);
  const handleBuyClick = () => onBuyNow?.(service, quantity);

  const ratingValue = service.rating ?? 4.8;
  const reviewCount = service.reviewCount ?? 100;
  const finalPriceLabel = getFinalPriceLabel(service);
  const priceBreakdown = getPriceBreakdown(service);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/40 shadow-[0_35px_90px_rgba(2,6,23,0.55)] backdrop-blur"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent opacity-0 blur-2xl transition group-hover:opacity-100" />
      <div className="relative flex flex-1 flex-col">
        <figure className="overflow-hidden">
          <button
            type="button"
            className="relative h-72 w-full cursor-pointer"
            onClick={onMainClick}
          >
            <img
              src={gallery[active]}
              alt={service.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white">
              {service.category}
            </span>
            <span className="absolute bottom-4 right-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-300 px-3 py-1 text-sm font-semibold text-slate-900">
              {service.priceLabel}
            </span>
          </button>
          {length > 1 && (
            <div className="grid grid-cols-5 overflow-hidden border-t border-white/10">
              {gallery.slice(0, 5).map((url, idx) => (
                <button
                  key={`${service.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => onThumbClick(idx)}
                  className={`relative h-20 overflow-hidden transition ${
                    idx === active
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${service.title} preview ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute inset-0 border-2 ${
                      idx === active
                        ? "border-emerald-400"
                        : "border-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </figure>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              {serviceIcons[service.iconKey] || serviceIcons.default}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Premium print
              </p>
              <h3 className="text-xl font-semibold text-white">
                {service.title}
              </h3>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            {service.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, index) => {
                const starIndex = index + 1;
                const isFilled = ratingValue >= starIndex - 0.2;
                return (
                  <svg
                    key={`star-${service.id}-${starIndex}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 ${
                      isFilled ? "text-amber-300" : "text-slate-600"
                    }`}
                  >
                    <path
                      d="m12 4 2.1 4.6 5 .7-3.7 3.6.9 5.1L12 15.9 7.7 18l.9-5.1-3.7-3.6 5-.7Z"
                      fill="currentColor"
                    />
                  </svg>
                );
              })}
            </div>
            <p className="text-sm text-slate-400">
              {ratingValue.toFixed(1)} · {reviewCount}+ reviews
            </p>
          </div>

          <div className="mt-auto space-y-5">
            <dl className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Paper charge
                </dt>
                <dd className="text-base font-semibold text-white">
                  {service.paperCharge}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Print charge
                </dt>
                <dd className="text-base font-semibold text-white">
                  {service.printCharge}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Support
                </dt>
                <dd className="text-base font-semibold text-white">
                  24-72 hrs
                </dd>
              </div>
            </dl>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-3xl font-semibold text-white">
                    {finalPriceLabel}
                  </p>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    {priceBreakdown}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                  <button
                    type="button"
                    className="px-4 py-2 text-lg"
                    aria-label="Decrease quantity"
                    onClick={decrementQuantity}
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2 text-lg"
                    aria-label="Increase quantity"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-400/60"
                  onClick={handleAddClick}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:opacity-90"
                  onClick={handleBuyClick}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { content: heroContent, stats: heroStatsFromApi } = useSelector(
    (state) => state.servicePage
  );
  const {
    list: serviceList,
    loading: servicesLoading,
    error: servicesError,
  } = useSelector((state) => state.services);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const seoKeywords = [
    "Sitamarhi printing services",
    "wedding card printing",
    "cash memo printers",
    "letterhead design",
    "Computerized Chhappaiwala services",
  ];
  const heroCopy = useMemo(() => {
    if (heroContent && Object.keys(heroContent).length) {
      return heroContent;
    }
    return servicePageDefaultContent;
  }, [heroContent]);

  const scrollToSelector = (selector) => {
    if (typeof document === "undefined" || !selector) return;
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTargetNavigation = (target, fallback) => {
    if (!target) {
      fallback?.();
      return;
    }
    if (target.startsWith("#")) {
      scrollToSelector(target);
      return;
    }
    if (target.startsWith("http")) {
      if (typeof window !== "undefined") {
        window.location.assign(target);
      }
      return;
    }
    navigate(target);
  };

  const handlePrimaryCta = () => {
    handleTargetNavigation(heroCopy.primaryCtaLink, () => {
      setActiveCategory(ALL_CATEGORY);
      scrollToSelector("#services-grid");
    });
  };

  const handleSecondaryCta = () => {
    handleTargetNavigation(heroCopy.secondaryCtaLink || "#services-grid", () =>
      scrollToSelector("#services-grid")
    );
  };

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchServicePage());
  }, [dispatch]);

  const usingFallbackCatalog =
    !servicesLoading && !servicesError && serviceList.length === 0;
  const services = useMemo(
    () => (usingFallbackCatalog ? curatedServices : serviceList),
    [usingFallbackCatalog, serviceList]
  );
  const showFallbackNotice = usingFallbackCatalog;
  const showErrorNotice = Boolean(servicesError && !serviceList.length);
  const isInitialLoading = servicesLoading && !serviceList.length;

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(services.map((service) => service.category))
    );
    return [ALL_CATEGORY, ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    let computed = services;

    if (activeCategory !== ALL_CATEGORY) {
      computed = computed.filter(
        (service) => service.category === activeCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      computed = computed.filter(
        (service) =>
          service.title.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          service.category.toLowerCase().includes(term)
      );
    }

    const sorted = [...computed];
    if (sortOrder === "low-high") {
      sorted.sort((a, b) => (a.basePrice ?? 0) - (b.basePrice ?? 0));
    } else if (sortOrder === "high-low") {
      sorted.sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
    }

    return sorted;
  }, [services, activeCategory, searchTerm, sortOrder]);

  const handleAddToCart = (service, quantity = 1, redirectToCart = false) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addItem({ ...service, quantity }));
    if (redirectToCart) {
      navigate("/cart");
    }
  };

  const handleBuyNow = (service, quantity = 1) => {
    handleAddToCart(service, quantity, true);
  };

  const fallbackHeroStats = useMemo(
    () => [
      {
        label: "Curated services",
        value: `${services.length}+`,
        detail: "Hand-vetted combos",
      },
      {
        label: "Categories",
        value: `${Math.max(categories.length - 1, 0)}`,
        detail: "Ready-to-print sets",
      },
      {
        label: "Avg. delivery",
        value: "24-72h",
        detail: "Pan Sitamarhi",
      },
    ],
    [services.length, categories.length]
  );

  const heroStats = useMemo(() => {
    if (heroStatsFromApi?.length) {
      return [...heroStatsFromApi].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );
    }
    return fallbackHeroStats;
  }, [heroStatsFromApi, fallbackHeroStats]);

  return (
    <>
      <PageSeo
        title="Printing Services in Sitamarhi"
        description="Browse wedding card, cash memo, letterhead, calendar, and custom printing packages fulfilled by Computerized Chhappaiwala with express delivery."
        path="/services"
        keywords={seoKeywords}
        structuredData={servicesStructuredData}
        type="CollectionPage"
      />
      <main className="bg-slate-950 text-slate-100">
        <Reveal
          as="section"
          className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-24 sm:px-6 floating-orb"
        >
          <div className="absolute inset-y-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
            <div className="space-y-6 lg:flex-1">
              <p className="inline-flex rounded-full border border-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300">
                {heroCopy.heroTagline}
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {heroCopy.heroTitle}
              </h1>
              <p className="text-base text-slate-300 sm:text-lg">
                {heroCopy.heroDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:opacity-90"
                  onClick={handlePrimaryCta}
                >
                  {heroCopy.primaryCtaText || "Explore catalog"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/70"
                  onClick={handleSecondaryCta}
                >
                  {heroCopy.secondaryCtaText || "Download rate card"}
                </button>
              </div>
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/15 bg-white/5 p-5 text-center shadow-[0_25px_80px_rgba(2,6,23,0.35)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-white sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-300">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="px-4 py-16 sm:px-6 lg:px-12">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/90 px-5 py-3 text-slate-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path
                    d="m21 21-4.35-4.35M5 11a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="search"
                  placeholder="Search service, use case, or paper stock"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="flex-1 border-none bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <label htmlFor="price-sort" className="text-slate-300">
                  Sort price
                </label>
                <select
                  id="price-sort"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="rounded-full border border-white/20 bg-slate-900/50 px-4 py-2 text-sm text-white focus:border-emerald-300/70 focus:outline-none"
                >
                  <option value="none">Custom order</option>
                  <option value="low-high">Low to High</option>
                  <option value="high-low">High to Low</option>
                </select>
              </div>
            </div>

            {showErrorNotice && (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                Unable to load the live catalog. {servicesError}
              </div>
            )}

            {showFallbackNotice && !showErrorNotice && (
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                Live catalog is empty right now, so we are showing the curated
                demo services until new entries are created in admin.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-transparent bg-white text-slate-900 shadow-[0_20px_50px_rgba(15,118,110,0.35)]"
                        : "border-white/10 bg-white/5 text-white hover:border-white/30"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                          : "bg-white/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              id="services-grid"
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {isInitialLoading ? (
                <div className="col-span-full">
                  <Loader />
                </div>
              ) : filteredServices.length ? (
                filteredServices.map((service, index) => (
                  <Reveal
                    as="div"
                    key={service.id || `${service.title}-${index}`}
                    delay={(index % 3) * 120}
                    className="h-full"
                  >
                    <ServiceCard
                      service={service}
                      onBuyNow={(item, qty) => handleBuyNow(item, qty)}
                      onAddToCart={(item, qty) =>
                        handleAddToCart(item, qty, false)
                      }
                    />
                  </Reveal>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                  <p className="text-lg font-semibold text-white">
                    No services found
                  </p>
                  <p className="text-sm text-white/80">
                    Try adjusting filters or use the search field to explore
                    more offerings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
};

export default Services;
