import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../configs/axios";
import Reveal from "../../../components/ui/Reveal";
import Testimonials from "./Testimonials";
import ProcessShowcase from "./ProcessShowcase";
import { HOME_CONTENT_REFRESH_EVENT } from "../../../constants/home";
import PageSeo from "../../../components/seo/PageSeo";
import { BRAND_NAME, SITE_URL, LOGO_URL } from "../../../constants/seo";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80",
    badge: "Offset Printing",
    title: "Large volume jobs with crystal-clear detail",
    description:
      "Premium offset presses, metallic inks, and bulk finishing built for retail-ready packaging and publications.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
    badge: "Digital Print Lab",
    title: "Launch campaigns overnight with zero compromise",
    description:
      "Vibrant short runs, variable data, and personalized collateral for ambitious service brands across Bihar.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1451471016731-e963a8588be8?auto=format&fit=crop&w=1800&q=80",
    badge: "Installation Crew",
    title: "From flex hoardings to illuminated storefronts",
    description:
      "Our on-ground team fabricates and installs with precision so your presence dominates every high street.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    badge: "Creative Studio",
    title: "Design, prototyping, and motion support in-house",
    description:
      "Strategy, copy, and art direction merge to give you scroll-stopping assets across print and digital.",
  },
];

const aboutStats = [
  { value: "500+", label: "Custom cards yearly" },
  { value: "1200+", label: "Orders fulfilled" },
  { value: "24h", label: "Average proof time" },
];

const capabilityHighlights = [
  {
    title: "End-to-end printing",
    description:
      "Wedding cards, flex, visiting cards, cash memos, calendars, and every custom brief under one roof.",
  },
  {
    title: "Reliable turnaround",
    description:
      "Express delivery windows plus QC at each stage keeps your launch on track.",
  },
  {
    title: "Transparent pricing",
    description:
      "Upfront estimates, packaged services, and support for retail, SMB, and government bids.",
  },
  {
    title: "Installation crew",
    description:
      "On-ground team for hoardings, in-store branding, and high-street storefront makeovers.",
  },
];

const servicePreview = [
  {
    category: "Shaadi Card",
    title: "Wedding Card Printing",
    description:
      "Foil, emboss, laser-cut, or bilingual layouts that match your ceremony’s energy with premium stocks.",
    price: "From ₹24 / card",
    badge: "Most Loved",
  },
  {
    category: "Retail Docs",
    title: "Cash Memo & Invoice Pads",
    description:
      "Triplicate, perforated, or carbonless memo books branded with your shop details and numbering.",
    price: "From ₹220 / pad",
    badge: "Fast Moving",
  },
  {
    category: "Stationery",
    title: "Letter Pad & Visiting Cards",
    description:
      "Crisp typography, watermark logos, and smooth writing experience for offices, schools, and hospitals.",
    price: "From ₹180 / set",
    badge: "Studio Pick",
  },
];

const portfolioHighlights = [
  {
    title: "Wedding Card Design",
    category: "Wedding Cards",
    description:
      "Layered matte finish with foil stamping, bilingual typography, and custom monogram sheath.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Minimal Visiting Card",
    category: "Visiting Cards",
    description:
      "Frosted PVC visiting cards with spot UV treatment and laser-rounded corners for durability.",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Event Flex Banner",
    category: "Banners / Flex",
    description:
      "10ft flex banner for a retail launch with eco-solvent inks and block-out backing.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
];

const contactChannels = [
  {
    title: "Call the Studio",
    detail: "+91 74889 86015",
    description:
      "Speak directly with Sonu or Vikash for urgent print jobs and revisions.",
    link: "tel:+917488986015",
  },
  {
    title: "WhatsApp Orders",
    detail: "+91 62035 04230",
    description:
      "Share references, get previews, and confirm delivery slots instantly.",
    link: "https://wa.me/916203504230",
  },
  {
    title: "Visit Sitamarhi HQ",
    detail: "Hospital Road, Bihar 843302",
    description:
      "Walk into the production floor to proof materials or explore paper libraries.",
    link: "https://maps.app.goo.gl/6y7oNCDVEkR92i9n7",
  },
];

const ctaBannerDefault = {
  badge: "Ready to collaborate?",
  title: "Let’s combine the best of strategy, design, and print logistics",
  description:
    "Book a discovery call, send over artwork, or invite us to audit your current workflows. Home now mirrors About, Services, Portfolio, and Contact sections so you can act faster.",
  linkLabel: "Talk to the team",
  linkUrl: "/contact",
  secondaryLabel: "See more work",
  secondaryUrl: "/portfolio",
};

const defaultHomeContent = {
  hero: heroSlides,
  stats: aboutStats,
  capabilities: capabilityHighlights,
  services: servicePreview,
  portfolio: portfolioHighlights,
  contacts: contactChannels,
  cta: ctaBannerDefault,
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${BRAND_NAME} Printing Studio`,
  url: `${SITE_URL}/`,
  description:
    "Sitamarhi-based printing studio offering wedding cards, stationery, flex banners, and on-ground installation support.",
  headline: "Design, print, and install with one expert team",
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
  },
  about: servicePreview.map((service) => service.title),
  hasPart: [
    {
      "@type": "WebPage",
      name: "About Computerized Chhappaiwala",
      url: `${SITE_URL}/about`,
    },
    {
      "@type": "WebPage",
      name: "Printing Services",
      url: `${SITE_URL}/services`,
    },
    {
      "@type": "WebPage",
      name: "Portfolio",
      url: `${SITE_URL}/portfolio`,
    },
    {
      "@type": "ContactPage",
      name: "Contact Computerized Chhappaiwala",
      url: `${SITE_URL}/contact`,
    },
  ],
  potentialAction: {
    "@type": "ContactAction",
    target: `${SITE_URL}/contact`,
    name: "Submit print inquiry",
  },
};

const normalizeArray = (list) => (Array.isArray(list) ? list : []);

const mergeSectionsWithFallbacks = (sections = {}) => ({
  hero: sections.hero?.length ? sections.hero : defaultHomeContent.hero,
  stats: sections.stats?.length ? sections.stats : defaultHomeContent.stats,
  capabilities: sections.capabilities?.length
    ? sections.capabilities
    : defaultHomeContent.capabilities,
  services: sections.services?.length
    ? sections.services
    : defaultHomeContent.services,
  portfolio: sections.portfolio?.length
    ? sections.portfolio
    : defaultHomeContent.portfolio,
  contacts: sections.contacts?.length
    ? sections.contacts
    : defaultHomeContent.contacts,
  cta: sections.cta || defaultHomeContent.cta,
});

const mapHomeSections = (sections = {}) => {
  const hero = normalizeArray(sections.hero)
    .map((item) => ({
      image: item.image || item.metadata?.image || "",
      badge: item.badge || "",
      title: item.title || "",
      description: item.description || "",
    }))
    .filter((slide) => slide.title && slide.image);

  const stats = normalizeArray(sections.stats)
    .map((item) => ({
      value: item.value || "",
      label: item.title || "",
      description: item.description || "",
    }))
    .filter((stat) => stat.value && stat.label);

  const capabilities = normalizeArray(sections.capability)
    .map((item) => ({
      title: item.title || "",
      description: item.description || "",
    }))
    .filter((entry) => entry.title && entry.description);

  const services = normalizeArray(sections.service)
    .map((item) => ({
      badge: item.badge || "",
      category: item.detail || item.subtitle || "",
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      linkLabel: item.linkLabel || "",
      linkUrl: item.linkUrl || "",
    }))
    .filter((entry) => entry.title && entry.category);

  const portfolio = normalizeArray(sections.portfolio)
    .map((item) => ({
      title: item.title || "",
      category: item.badge || item.detail || "",
      description: item.description || "",
      image: item.image || "",
    }))
    .filter((entry) => entry.title && entry.image);

  const contacts = normalizeArray(sections.contact)
    .map((item) => ({
      title: item.title || "",
      detail: item.detail || "",
      description: item.description || "",
      link: item.linkUrl || item.linkLabel || "",
    }))
    .filter((entry) => entry.title && entry.detail);

  const ctaSource = normalizeArray(sections.cta)[0];
  const cta = ctaSource
    ? {
        badge: ctaSource.badge || ctaBannerDefault.badge,
        title: ctaSource.title || ctaBannerDefault.title,
        description: ctaSource.description || ctaBannerDefault.description,
        linkLabel: ctaSource.linkLabel || ctaBannerDefault.linkLabel,
        linkUrl: ctaSource.linkUrl || ctaBannerDefault.linkUrl,
        secondaryLabel:
          ctaSource.secondaryLabel || ctaBannerDefault.secondaryLabel,
        secondaryUrl: ctaSource.secondaryUrl || ctaBannerDefault.secondaryUrl,
      }
    : null;

  return {
    hero,
    stats,
    capabilities,
    services,
    portfolio,
    contacts,
    cta,
  };
};

const Home = () => {
  const seoKeywords = [
    "Sitamarhi printing press",
    "wedding card printers",
    "flex banner design",
    "letterhead printing Bihar",
    "Computerized Chhappaiwala",
  ];
  const [homeSections, setHomeSections] = useState(defaultHomeContent);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchHomeSections = useCallback(async () => {
    const { data } = await api.get("/home/content");
    if (!data?.sections) return null;
    return mapHomeSections(data.sections);
  }, []);

  const applySections = useCallback((sections) => {
    setHomeSections(mergeSectionsWithFallbacks(sections || {}));
  }, []);

  const refreshHomeSections = useCallback(async () => {
    setSectionsLoading(true);
    setSectionsError(null);
    try {
      const mapped = await fetchHomeSections();
      if (!isMountedRef.current) return;
      applySections(mapped);
    } catch (err) {
      if (!isMountedRef.current) return;
      setSectionsError(err.message || "Unable to load home content.");
      applySections(null);
    } finally {
      if (isMountedRef.current) {
        setSectionsLoading(false);
      }
    }
  }, [applySections, fetchHomeSections]);

  useEffect(() => {
    refreshHomeSections();
  }, [refreshHomeSections]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleRefreshEvent = () => refreshHomeSections();
    window.addEventListener(HOME_CONTENT_REFRESH_EVENT, handleRefreshEvent);
    return () => {
      window.removeEventListener(
        HOME_CONTENT_REFRESH_EVENT,
        handleRefreshEvent
      );
    };
  }, [refreshHomeSections]);

  const slides = useMemo(
    () => (homeSections.hero || heroSlides).slice(0, 10),
    [homeSections.hero]
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const ctaContent = homeSections.cta || ctaBannerDefault;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setCurrentSlide((prev) => (prev >= slides.length ? 0 : prev));
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const handlePrevious = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <>
      <PageSeo
        title="Computerized Chhappaiwala – Printing & Design Studio in Sitamarhi"
        description="Full-service Sitamarhi print studio for wedding cards, stationery, flex banners, and end-to-end installation support. Explore services, portfolio, and instant booking options."
        path="/"
        keywords={seoKeywords}
        structuredData={homeStructuredData}
      />
      <div>
        {sectionsError && (
          <div className="max-w-4xl px-6 py-4 mx-auto mb-6 text-sm border rounded-3xl border-rose-200 bg-rose-50 text-rose-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p>
                We couldn&apos;t fetch the latest homepage content. Showing
                preset content for now.
              </p>
              <button
                type="button"
                onClick={refreshHomeSections}
                disabled={sectionsLoading}
                className="px-4 py-2 text-xs font-semibold tracking-widest uppercase transition border rounded-full border-rose-300 text-rose-700 hover:border-rose-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <section className="relative min-h-[600px] overflow-hidden bg-slate-950 text-white floating-orb">
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <img
                key={slide.title}
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-900/40" />
          </div>

          <Reveal
            as="div"
            className="relative flex flex-col justify-center h-full max-w-6xl px-6 py-16 mx-auto lg:px-10"
            once={false}
          >
            {slides.length > 0 && (
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
                {slides[currentSlide]?.badge}
              </div>
            )}
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {slides[currentSlide]?.title}
            </h1>
            <p className="max-w-2xl mt-6 text-base text-slate-200 sm:text-lg">
              {slides[currentSlide]?.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/contact"
                className="px-6 py-3 text-sm font-semibold bg-white rounded-full text-slate-900"
              >
                Start a Project
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/30"
              >
                Explore Services
              </Link>
            </div>
          </Reveal>

          <div className="absolute inset-x-0 flex items-center justify-center gap-6 px-6 pointer-events-none bottom-8">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center justify-center text-white transition border rounded-full pointer-events-auto h-11 w-11 border-white/30 bg-white/10 hover:border-white hover:bg-white/20"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
              >
                <path
                  d="m15 18-6-6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex gap-2 pointer-events-auto">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-10 bg-white"
                      : "w-5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center text-white transition border rounded-full pointer-events-auto h-11 w-11 border-white/30 bg-white/10 hover:border-white hover:bg-white/20"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
              >
                <path
                  d="m9 6 6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        <Reveal as="section" className="text-white bg-slate-950">
          <div className="container-section grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Inspired by our About studio
              </p>
              <h2 className="text-4xl font-semibold text-white">
                Precision printing studio for Sitamarhi and beyond
              </h2>
              <p className="text-base text-slate-300">
                Borrowing from our About page, here’s a snapshot of what keeps
                Computerized Chhappaiwala trusted—seasoned operators, a
                design-first mindset, and relentless QC before anything leaves
                the floor.
              </p>
              <div className="flex flex-wrap gap-4">
                {homeSections.stats.map((stat, index) => (
                  <Reveal
                    as="div"
                    key={stat.label}
                    delay={index * 120}
                    className="min-w-[160px] rounded-2xl border border-white/10 bg-white/5 px-6 py-4"
                  >
                    <p className="text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      {stat.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {homeSections.capabilities.map((item, index) => (
                <Reveal
                  as="article"
                  key={item.title}
                  delay={index * 120}
                  className="p-5 border rounded-3xl border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/80"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="container-section">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">
              Services snapshot
            </p>
            <h2 className="section-title">
              Borrowed from our detailed Services page
            </h2>
            <p className="self-center max-w-3xl section-subtitle">
              Explore a few of the 40+ offerings listed on the Services screen.
              Each preview links to deeper configuration, add-to-cart, or
              custom-brief flows.
            </p>
          </div>
          <div className="grid gap-6 mt-10 md:grid-cols-3">
            {homeSections.services.map((service, index) => (
              <Reveal
                as="div"
                key={service.title}
                delay={(index % 3) * 120}
                className="flex flex-col h-full p-6 bg-white border shadow-lg rounded-3xl border-slate-100/40 shadow-slate-900/5"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  <span>{service.category}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.65rem] text-emerald-700">
                    {service.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="flex-1 mt-3 text-sm text-slate-600">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-6">
                  <p className="text-base font-semibold text-slate-900">
                    {service.price}
                  </p>
                  <Link
                    to="/services"
                    className="text-sm font-semibold transition text-brand hover:text-brand-light"
                  >
                    View details →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              to="/services"
              className="px-6 py-3 text-sm font-semibold text-white rounded-full bg-slate-900"
            >
              Browse all services
            </Link>
            <Link
              to="/order"
              className="px-6 py-3 text-sm font-semibold border rounded-full border-slate-300 text-slate-900"
            >
              Start a custom brief
            </Link>
          </div>
        </Reveal>

        <ProcessShowcase />

        <Reveal as="section" className="py-20 text-white bg-slate-950">
          <div className="container-section">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Portfolio highlights
              </p>
              <h2 className="text-4xl font-semibold">
                Fresh from the Portfolio gallery
              </h2>
              <p className="text-base text-slate-300">
                Pulled from our Portfolio page—tap through curated work spanning
                invitations, retail collateral, and experience branding.
              </p>
            </div>
            <div className="grid gap-6 mt-12 lg:grid-cols-3">
              {homeSections.portfolio.map((project, index) => (
                <Reveal
                  as="div"
                  key={project.title}
                  delay={(index % 3) * 120}
                  className="relative overflow-hidden border group rounded-3xl border-white/10 bg-slate-900"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full transition duration-500 h-72 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/90">
                      {project.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/30"
              >
                View complete portfolio
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="container-section">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">
                Contact experience
              </p>
              <h2 className="section-title">
                Elements inspired by the Contact Us screen
              </h2>
              <p className="section-subtitle">
                Same-day responses, on-site visits, WhatsApp proofs, and a
                detailed contact section ensure you always know where your job
                stands.
              </p>
              <div className="space-y-4">
                {homeSections.contacts.map((channel, index) => (
                  <Reveal
                    as="a"
                    key={channel.title}
                    href={channel.link || "#"}
                    target={
                      channel.link?.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      channel.link?.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                    delay={index * 120}
                    className="block px-5 py-4 transition border rounded-3xl border-slate-200 hover:-translate-y-1 hover:border-brand hover:shadow-xl"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {channel.title}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {channel.detail}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {channel.description}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal
              as="div"
              className="h-full p-0 border shadow-lg card-surface rounded-3xl border-slate-200"
            >
              <iframe
                title="Computerized Chhappaiwala Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.652211730433!2d85.50191767508334!3d26.59587477687115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed0b7b5bb0cddf%3A0x81e294ba1bf4ae33!2sComputerized%20Chhappaiwala!5e0!3m2!1sen!2sin!4v1707800000000!5m2!1sen!2sin"
                className="w-full h-full rounded-3xl"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Reveal>
          </div>
        </Reveal>

        <Reveal>
          <Testimonials />
        </Reveal>

        <Reveal
          as="section"
          className="py-16 text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700"
        >
          <div className="flex flex-col items-center text-center container-section">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              {ctaContent.badge}
            </p>
            <h2 className="text-3xl font-semibold">{ctaContent.title}</h2>
            <p className="max-w-3xl mt-4 text-base text-white/80">
              {ctaContent.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {ctaContent.linkLabel &&
                ctaContent.linkUrl &&
                (ctaContent.linkUrl.startsWith("http") ? (
                  <a
                    href={ctaContent.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 text-sm font-semibold bg-white rounded-full text-emerald-700"
                  >
                    {ctaContent.linkLabel}
                  </a>
                ) : (
                  <Link
                    to={ctaContent.linkUrl}
                    className="px-6 py-3 text-sm font-semibold bg-white rounded-full text-emerald-700"
                  >
                    {ctaContent.linkLabel}
                  </Link>
                ))}
              {ctaContent.secondaryLabel &&
                ctaContent.secondaryUrl &&
                (ctaContent.secondaryUrl.startsWith("http") ? (
                  <a
                    href={ctaContent.secondaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/70"
                  >
                    {ctaContent.secondaryLabel}
                  </a>
                ) : (
                  <Link
                    to={ctaContent.secondaryUrl}
                    className="px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/70"
                  >
                    {ctaContent.secondaryLabel}
                  </Link>
                ))}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};

export default Home;
