import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader";
import Reveal from "../../../components/ui/Reveal";
import {
  fetchPortfolio,
  fetchPortfolioPage,
} from "../../../features/portfolio/portfolioSlice";
import resolveAssetUrl from "../../../utils/assetUrl";

const galleryFallbackImages = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
];

const fallbackHero = {
  tagline: "Our Work / Portfolio",
  title: "See our latest printing and design work",
  description:
    "Handpicked print samples across wedding cards, visiting cards, stationery, and flex installations crafted in Sitamarhi.",
};

const fallbackTrustHighlights = [
  "High-Quality Print Samples",
  "Modern Design Work",
  "Trusted by Local Customers",
  "Many Years of Experience",
];

const fallbackContentIdeas = [
  "Wedding card samples",
  "Cash memo & invoice pads",
  "Visiting and business cards",
  "Calendar & planner layouts",
  "Flex / banner installations",
  "Shop floor & production shots",
];

const ALL_CATEGORY = "All Collections";
const MIN_GALLERY_IMAGES = 1;
const MAX_GALLERY_IMAGES = 7;

const isExternalLink = (url = "") => /^https?:\/\//i.test(url);

const coerceImageValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    return (
      value.url || value.path || value.src || value.href || value.image || ""
    );
  }
  return "";
};

const parseGalleryField = (value) => {
  if (Array.isArray(value)) {
    return value.map(coerceImageValue).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(coerceImageValue).filter(Boolean);
      }
    } catch {
      // fall through to treating it as a single URL string
    }
    return [value.trim()];
  }
  return [];
};

const buildGallery = (images = []) => {
  const normalized = images
    .map(coerceImageValue)
    .filter(Boolean)
    .map((image) => resolveAssetUrl(image))
    .filter(Boolean);
  const sanitized = Array.from(new Set(normalized));
  if (!sanitized.length) {
    return [galleryFallbackImages[0]];
  }
  if (sanitized.length < MIN_GALLERY_IMAGES) {
    return sanitized;
  }
  return sanitized.slice(0, MAX_GALLERY_IMAGES);
};

const getSortableTimestamp = (value) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getAverageShots = (projects) => {
  if (!projects.length) return 0;
  const total = projects.reduce(
    (sum, project) => sum + (project.images?.length || 0),
    0
  );
  return Math.max(Math.round(total / projects.length), 1);
};

const PortfolioCard = ({
  project,
  onViewGallery,
  primaryCta,
  secondaryCta,
}) => {
  const gallery = project.images?.length
    ? project.images
    : galleryFallbackImages;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = gallery.length;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (length <= 1 || paused) return undefined;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [length, paused]);

  const handleMainClick = () => {
    if (length > 1) {
      setActive((prev) => (prev + 1) % length);
    } else {
      onViewGallery(project, 0);
    }
  };

  const shotsLabel =
    project.images.length > 1
      ? `${project.images.length} shots`
      : "Single shot";

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/40 shadow-[0_35px_90px_rgba(2,6,23,0.55)] backdrop-blur"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="absolute inset-0 transition opacity-0 pointer-events-none rounded-3xl bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent blur-2xl group-hover:opacity-100" />
      <div className="relative flex flex-col flex-1">
        <figure className="overflow-hidden">
          <button
            type="button"
            className="relative w-full cursor-pointer h-72"
            onClick={handleMainClick}
          >
            <img
              src={gallery[active]}
              alt={project.title}
              loading="lazy"
              className="object-cover w-full h-full"
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white">
              {project.category}
            </span>
            <span className="absolute px-3 py-1 text-sm font-semibold rounded-full bottom-4 right-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900">
              {shotsLabel}
            </span>
          </button>
          {length > 1 && (
            <div className="grid grid-cols-5 overflow-hidden border-t border-white/10">
              {gallery.slice(0, 5).map((url, idx) => (
                <button
                  key={`${project.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`relative h-20 overflow-hidden transition ${
                    idx === active
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${project.title} preview ${idx + 1}`}
                    loading="lazy"
                    className="object-cover w-full h-full"
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

        <div className="flex flex-col flex-1 gap-6 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Documented work
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              {project.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {project.description}
          </p>

          <dl className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Shots captured
              </dt>
              <dd className="text-base font-semibold text-white">
                {project.images.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Category
              </dt>
              <dd className="text-base font-semibold text-white">
                {project.category}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Status
              </dt>
              <dd className="text-base font-semibold text-white">
                {project.statusLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-auto space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-400/60"
                onClick={() => onViewGallery(project, active)}
              >
                View Gallery
              </button>
              {primaryCta?.link && (
                <a
                  href={primaryCta.link}
                  {...(primaryCta.props || {})}
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:opacity-90"
                >
                  {primaryCta.label}
                </a>
              )}
            </div>
            {secondaryCta?.link && (
              <a
                href={secondaryCta.link}
                {...(secondaryCta.props || {})}
                className="block rounded-full border border-white/20 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:border-emerald-300/70"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const Portfolio = () => {
  const dispatch = useDispatch();
  const {
    list,
    loading,
    error,
    pageContent,
    trustHighlights,
    contentIdeas,
    pageLoading,
    pageError,
  } = useSelector((state) => state.portfolio);

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioPage());
  }, [dispatch]);

  const preparedProjects = useMemo(() => {
    if (!Array.isArray(list) || !list.length) {
      return [];
    }

    return list.map((project, index) => {
      const normalizedImages = Array.isArray(project.images)
        ? project.images
        : [];
      const gallerySources = parseGalleryField(project.gallery);
      const rawImages = [
        ...normalizedImages,
        ...gallerySources,
        project.image,
        project.photo,
      ];
      const timestamp =
        getSortableTimestamp(
          project.updatedAt ||
            project.createdAt ||
            project.date ||
            project.publishedAt ||
            project.modifiedAt
        ) ?? null;

      return {
        id: project.id || `${project.category || "portfolio"}-${index + 1}`,
        title: project.title || project.name || "Custom Print Package",
        category: project.category || "Custom",
        description:
          project.description ||
          "Bespoke printing and finishing work delivered by the Computerized Chhappaiwala studio.",
        images: buildGallery(rawImages),
        client: project.client || project.customerName || project.brand || "",
        referenceCode:
          project.reference ||
          project.referenceId ||
          project.slug ||
          project.code ||
          "",
        statusLabel:
          project.status ||
          project.projectStatus ||
          project.stage ||
          "Delivered project",
        sortTimestamp: timestamp,
        originalIndex: index,
      };
    });
  }, [list]);

  const categories = useMemo(() => {
    if (!preparedProjects.length) {
      return [ALL_CATEGORY];
    }
    const unique = new Set(preparedProjects.map((project) => project.category));
    return [ALL_CATEGORY, ...unique];
  }, [preparedProjects]);

  const averageShots = useMemo(
    () => getAverageShots(preparedProjects),
    [preparedProjects]
  );

  const filteredProjects = useMemo(() => {
    let computed = preparedProjects;

    if (activeCategory !== ALL_CATEGORY) {
      computed = computed.filter(
        (project) => project.category === activeCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      computed = computed.filter((project) => {
        const haystack = [
          project.title,
          project.description,
          project.category,
          project.client,
          project.referenceCode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    const sorted = [...computed];
    if (sortOrder === "atoz") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "ztoa") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      sorted.sort((a, b) => {
        const stampA = a.sortTimestamp;
        const stampB = b.sortTimestamp;
        if (stampA && stampB) {
          return sortOrder === "oldest" ? stampA - stampB : stampB - stampA;
        }
        if (stampA && !stampB) {
          return -1;
        }
        if (!stampA && stampB) {
          return 1;
        }
        return sortOrder === "oldest"
          ? a.originalIndex - b.originalIndex
          : b.originalIndex - a.originalIndex;
      });
    }

    return sorted;
  }, [preparedProjects, activeCategory, searchTerm, sortOrder]);

  const heroSection = {
    tagline: pageContent?.heroTagline || fallbackHero.tagline,
    title: pageContent?.heroTitle || fallbackHero.title,
    description: pageContent?.heroDescription || fallbackHero.description,
  };

  const trustSectionTitle =
    pageContent?.trustTitle || "Why you should view our work";
  const trustSectionDescription =
    pageContent?.trustDescription ||
    "Every sample below is printed, finished, and QC-checked inside Computerized Chhappaiwala.";

  const ideasSectionTitle =
    pageContent?.ideasTitle || "Content ideas to keep your portfolio fresh";
  const ideasSectionDescription =
    pageContent?.ideasDescription ||
    "Rotate these buckets each month to highlight recent printing success stories.";

  const ctaEyebrow = pageContent?.ctaEyebrow || "Need similar designs?";
  const ctaTitle =
    pageContent?.ctaTitle || "Want similar design for your business or event?";
  const ctaDescription =
    pageContent?.ctaDescription ||
    "Share your requirement for wedding cards, corporate kits, or large-format flex. We craft and deliver with the same precision.";
  const primaryCtaLabel = pageContent?.primaryCtaLabel || "Contact Us";
  const primaryCtaLink = pageContent?.primaryCtaLink || "/contact";
  const secondaryCtaLabel = pageContent?.secondaryCtaLabel || "WhatsApp Now";
  const secondaryCtaLink =
    pageContent?.secondaryCtaLink || "https://wa.me/919999999999";

  const primaryLinkProps = isExternalLink(primaryCtaLink)
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  const secondaryLinkProps = isExternalLink(secondaryCtaLink)
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  const currentTrustHighlights =
    trustHighlights?.length > 0
      ? trustHighlights
      : fallbackTrustHighlights.map((title, index) => ({
          id: `trust-${index}`,
          title,
        }));

  const currentContentIdeas =
    contentIdeas?.length > 0
      ? contentIdeas
      : fallbackContentIdeas.map((title, index) => ({
          id: `idea-${index}`,
          title,
        }));

  const heroStats = useMemo(
    () => [
      {
        label: "Documented work",
        value: `${preparedProjects.length || 0}+`,
        detail: "Captured in Sitamarhi",
      },
      {
        label: "Categories",
        value: `${Math.max(categories.length - 1, 0)}`,
        detail: "Print verticals",
      },
      {
        label: "Avg. gallery",
        value: `${averageShots || 1}`,
        detail: "Shots / project",
      },
    ],
    [preparedProjects.length, categories.length, averageShots]
  );

  const primaryCtaConfig = {
    label: primaryCtaLabel,
    link: primaryCtaLink,
    props: primaryLinkProps,
  };

  const secondaryCtaConfig = {
    label: secondaryCtaLabel,
    link: secondaryCtaLink,
    props: secondaryLinkProps,
  };

  const handleViewGallery = (project, imageIndex = 0) => {
    if (!project) return;
    const safeIndex = Math.max(
      0,
      Math.min(imageIndex, (project.images?.length || 1) - 1)
    );
    setSelectedProject(project);
    setSelectedImageIndex(safeIndex);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setSelectedImageIndex(0);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) closeModal();
  };

  const modalGallery = selectedProject?.images || [];

  const showEmptyState = !loading && !filteredProjects.length;
  const isInitialLoading = loading && !preparedProjects.length;

  return (
    <main className="bg-slate-950 text-slate-100">
      <Reveal
        as="section"
        className="relative px-4 py-24 overflow-hidden isolate bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 sm:px-6 floating-orb"
      >
        <div className="absolute inset-y-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col max-w-6xl gap-10 mx-auto lg:flex-row lg:items-center">
          <div className="space-y-6 lg:flex-1">
            <p className="inline-flex rounded-full border border-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300">
              {heroSection.tagline}
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {heroSection.title}
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              {heroSection.description}
            </p>
            {(pageLoading || pageError) && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/80">
                {pageLoading
                  ? "Refreshing live content..."
                  : "Could not fetch latest copy. Showing defaults."}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={primaryCtaLink}
                {...primaryLinkProps}
                className="px-6 py-3 text-sm font-semibold transition rounded-full shadow-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-emerald-500/30 hover:opacity-90"
              >
                {primaryCtaLabel || "Discuss a brief"}
              </a>
              <a
                href={secondaryCtaLink}
                {...secondaryLinkProps}
                className="px-6 py-3 text-sm font-semibold text-white transition border rounded-full border-white/25 hover:border-emerald-300/70"
              >
                {secondaryCtaLabel || "Share on WhatsApp"}
              </a>
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
            <div className="flex items-center flex-1 gap-3 px-5 py-3 border rounded-full border-white/10 bg-white/90 text-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
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
                placeholder="Search project, finish, or category"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="flex-1 text-sm bg-transparent border-none text-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <label htmlFor="portfolio-sort" className="text-slate-300">
                Sort projects
              </label>
              <select
                id="portfolio-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="px-4 py-2 text-sm text-white border rounded-full border-white/20 bg-slate-900/50 focus:border-emerald-300/70 focus:outline-none"
              >
                <option value="recent">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="atoz">A to Z</option>
                <option value="ztoa">Z to A</option>
              </select>
            </div>
          </div>

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

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isInitialLoading ? (
              <div className="col-span-full">
                <Loader />
              </div>
            ) : showEmptyState ? (
              <div className="p-10 text-center border col-span-full rounded-3xl border-white/10 bg-white/5">
                <p className="text-lg font-semibold text-white">No projects</p>
                <p className="text-sm text-white/80">
                  Try a different category or clear the search keyword to see
                  the entire archive.
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <Reveal as="div" key={project.id} delay={(index % 3) * 120}>
                  <PortfolioCard
                    project={project}
                    onViewGallery={handleViewGallery}
                    primaryCta={primaryCtaConfig}
                    secondaryCta={secondaryCtaConfig}
                  />
                </Reveal>
              ))
            )}
          </div>

          {error && (
            <div className="px-4 py-3 text-sm border rounded-3xl border-rose-500/30 bg-rose-500/10 text-rose-100">
              {error}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="px-4 pb-12 sm:px-6 lg:px-10">
        <div className="w-full p-8 border rounded-3xl border-white/10 bg-white/5">
          <h2 className="text-2xl font-semibold text-white">
            {trustSectionTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {trustSectionDescription}
          </p>
          <div className="grid gap-4 mt-6 sm:grid-cols-2">
            {currentTrustHighlights.map((point, index) => (
              <Reveal
                as="div"
                key={point.id || point.title || index}
                delay={index * 120}
                className="flex items-center gap-3 p-4 border rounded-2xl border-white/10 bg-slate-900/60"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-400/10 text-emerald-300">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {point.title || `Highlight ${index + 1}`}
                  </p>
                  {point.description && (
                    <p className="text-xs text-slate-400">
                      {point.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="px-4 pb-12 sm:px-6 lg:px-10">
        <div className="w-full p-8 border rounded-3xl border-white/10 bg-slate-900/70">
          <h3 className="text-2xl font-semibold text-white">
            {ideasSectionTitle}
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            {ideasSectionDescription}
          </p>
          <div className="grid gap-3 mt-6 sm:grid-cols-2">
            {currentContentIdeas.map((idea, index) => (
              <Reveal
                as="div"
                key={idea.id || idea.title || index}
                delay={index * 100}
                className="px-4 py-3 text-sm border rounded-2xl border-white/5 bg-white/5 text-white/90"
              >
                {idea.title || `Idea ${index + 1}`}
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="w-full p-10 text-center border rounded-3xl border-white/10 bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-800">
            {ctaEyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold">{ctaTitle}</h2>
          <p className="mt-3 text-base text-slate-900/80">{ctaDescription}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href={primaryCtaLink}
              {...primaryLinkProps}
              className="px-6 py-3 text-sm font-semibold text-white rounded-full shadow-lg bg-slate-900"
            >
              {primaryCtaLabel}
            </a>
            <a
              href={secondaryCtaLink}
              {...secondaryLinkProps}
              className="px-6 py-3 text-sm font-semibold border rounded-full border-slate-900 text-slate-900"
            >
              {secondaryCtaLabel}
            </a>
          </div>
        </div>
      </Reveal>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl mx-4 overflow-hidden border rounded-3xl border-white/10 bg-slate-950">
            <img
              src={modalGallery[selectedImageIndex]}
              alt={selectedProject.title}
              className="object-cover w-full h-96"
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                    {selectedProject.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-white transition border rounded-full border-white/20 hover:border-emerald-300/60"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mt-6 sm:grid-cols-5">
                {modalGallery.map((image, index) => (
                  <button
                    key={`${selectedProject.id}-modal-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-20 overflow-hidden rounded-xl border p-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                      index === selectedImageIndex
                        ? "border-emerald-300"
                        : "border-white/10"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedProject.title} preview ${index + 1}`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Portfolio;
