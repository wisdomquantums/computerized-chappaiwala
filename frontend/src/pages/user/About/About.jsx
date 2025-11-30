import { useState } from "react";
import Reveal from "../../../components/ui/Reveal";
import useAboutSection from "../../../hooks/useAboutSection";
import PageSeo from "../../../components/seo/PageSeo";
import { BRAND_NAME, SITE_URL, LOGO_URL } from "../../../constants/seo";
import "./About.css";

const fallbackHero = {
  tagline: "About Computerized Chhappaiwala",
  title: "Trusted printing and design services in Sitamarhi",
  description:
    "Comprehensive print production, from concept sketches to doorstep delivery for ambitious brands, households, and government projects.",
};

const fallbackHeroStats = [
  { title: "Custom cards yearly", value: "500+", detail: "Hero stat" },
  { title: "Orders fulfilled", value: "1200+", detail: "Hero stat" },
  { title: "Average proof time", value: "24h", detail: "Hero stat" },
];

const fallbackWhoSection = {
  tagline: "Who We Are",
  title: "Precision printing studio crafting memories & business essentials",
  description:
    "Computerized Chhappaiwala is a experienced printing and computer work service based in Sitamarhi, Bihar. We specialize in high-quality wedding cards, letter pads, cash memos, calendars, and customized printing solutions for individuals and businesses.",
  primaryImage:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60",
};

const fallbackHighlights = [
  {
    title: "End-to-end printing",
    description:
      "Wedding cards, letter pads, cash memos, calendars, flex & more",
  },
  {
    title: "Reliable turnaround",
    description: "Express delivery with QC checkpoints at every stage",
  },
  {
    title: "Transparent pricing",
    description:
      "No hidden fees. Best-in-class pricing for Sitamarhi businesses",
  },
];

const fallbackFounder = {
  tagline: "Founder & Owner",
  title: "Mr. Kamlesh Tiwari",
  description:
    "With years of experience in printing and design, Mr. Kamlesh Tiwari built a strong reputation across Sitamarhi for delivering reliable, high-quality, and timely services.",
  primaryImage:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60",
};

const fallbackFounderHighlights = [
  { description: "15+ years in print production" },
  { description: "Trusted partner for SMBs & government bids" },
  { description: "Championing affordable premium printing" },
];

const fallbackTeamSection = {
  tagline: "Team",
  title: "Meet the people behind the presses",
  description:
    "Each team member ensures that every order is precise, on-time, and delightful.",
};

const fallbackTeamMembersData = [
  {
    title: "Mr. Sonu Tiwari",
    subtitle: "Printing Operator",
    description:
      "Expert in managing printing machines and ensuring high-quality print output.",
    value: "+91 9801305451",
    detail: "Core Specialist",
    mediaUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60",
    meta: {
      quote: "Quality work and customer satisfaction is my first priority.",
    },
  },
  {
    title: "Mr. Vikash Tiwari",
    subtitle: "Design Specialist",
    description:
      "Responsible for creative design and layout work for cards and business materials.",
    value: "+91 7488986015",
    detail: "Design Lead",
    mediaUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60",
    meta: { quote: "Good design creates a lasting impression." },
  },
  {
    title: "Mr. Mukul Tiwari",
    subtitle: "Customer Support Executive",
    description:
      "Handles customer queries, order management, and timely delivery.",
    value: "+91 6203504230",
    detail: "Support Lead",
    mediaUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60",
    meta: { quote: "Happy customers are our real success." },
  },
];

const fallbackTeamPhoto =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=60";

const EmployeeCard = ({ member }) => {
  const [flipped, setFlipped] = useState(false);
  const toggleFlip = () => setFlipped((prev) => !prev);

  const name = member.title || member.name || "Team member";
  const role = member.subtitle || member.role || member.detail || "Team member";
  const quote = member.meta?.quote || member.quote || "Passionate about print.";
  const contact = member.value || member.phone || "--";
  const description =
    member.description ||
    member.meta?.description ||
    "Driving quality for every order.";
  const badge = member.detail || "Core Specialist";
  const photo = member.mediaUrl || member.photo || fallbackTeamPhoto;

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={toggleFlip}
      className="about-team-card group relative w-full cursor-pointer rounded-3xl focus:outline-none"
      style={{ perspective: "1200px" }}
    >
      <div
        className={`about-team-card__inner relative rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        } group-hover:[transform:rotateY(180deg)]`}
      >
        <div className="about-team-card__face absolute inset-0 flex h-full flex-col rounded-3xl bg-white/95 p-6 text-left shadow-xl ring-1 ring-white/40 backdrop-blur [backface-visibility:hidden]">
          <div
            className="mb-5 w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-200"
            style={{ aspectRatio: "6 / 7" }}
          >
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">
              {role}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            <span className="h-1 w-6 rounded-full bg-emerald-400" />
            {badge || "Team"}
          </div>
        </div>

        <div className="about-team-card__face absolute inset-0 flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 p-6 text-left text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-base font-medium text-emerald-300">{quote}</p>
          <div className="space-y-2 text-sm text-slate-200">
            <p className="uppercase tracking-[0.35em] text-xs text-slate-400">
              Contact
            </p>
            <p className="text-2xl font-semibold">{contact}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

const About = () => {
  const hero = useAboutSection("about-hero");
  const who = useAboutSection("about-who");
  const founder = useAboutSection("about-founder");
  const team = useAboutSection("about-team");

  const heroSection = hero.section || fallbackHero;
  const heroStats = hero.items?.length ? hero.items : fallbackHeroStats;

  const whoSection = who.section || fallbackWhoSection;
  const whoHighlights = who.items?.length ? who.items : fallbackHighlights;

  const founderSection = founder.section || fallbackFounder;
  const founderHighlights = founder.items?.length
    ? founder.items
    : fallbackFounderHighlights;

  const teamSection = team.section || fallbackTeamSection;
  const currentTeamMembers = team.items?.length
    ? team.items
    : fallbackTeamMembersData;

  const loading =
    hero.loading || who.loading || founder.loading || team.loading;
  const errorMessage = hero.error || who.error || founder.error || team.error;

  const heroPrimaryCtaLabel = heroSection.primaryCtaLabel || "Talk to our team";
  const heroPrimaryCtaLink = heroSection.primaryCtaLink || "/contact";
  const heroSecondaryCtaLabel =
    heroSection.secondaryCtaLabel || "View services";
  const heroSecondaryCtaLink = heroSection.secondaryCtaLink || "/services";

  const aboutKeywords = [
    "about Computerized Chhappaiwala",
    "Sitamarhi printing team",
    "Kamlesh Tiwari",
    "printing experts Bihar",
  ];

  const teamMembersSchema = currentTeamMembers.slice(0, 4).map((member) => ({
    "@type": "Person",
    name: member.title || member.name,
    jobTitle: member.subtitle || member.role || "Team Member",
    telephone: member.value || member.phone,
  }));

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: heroSection.title,
    url: `${SITE_URL}/about`,
    description: heroSection.description,
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
      logo: LOGO_URL,
    },
    mainEntity: {
      "@type": "Organization",
      name: BRAND_NAME,
      description: whoSection.description,
      slogan: heroSection.tagline,
      areaServed: "Sitamarhi, Bihar",
      founder: {
        "@type": "Person",
        name: founderSection.title,
        description: founderSection.description,
      },
      employee: teamMembersSchema,
    },
  };

  return (
    <>
      <PageSeo
        title="About Computerized Chhappaiwala"
        description="Learn about the Sitamarhi print studio team delivering wedding cards, stationery, and premium branding assets under the leadership of Mr. Kamlesh Tiwari."
        path="/about"
        keywords={aboutKeywords}
        structuredData={aboutStructuredData}
        type="AboutPage"
      />
      <main className="bg-slate-950 text-slate-100">
        {loading && (
          <div className="flex items-center justify-center gap-3 border-b border-white/5 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            Syncing latest studio details...
          </div>
        )}
        {errorMessage && (
          <div className="border-b border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <Reveal
          as="section"
          className="about-hero relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-24 sm:px-6 floating-orb"
        >
          <div className="absolute inset-y-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="about-hero__wrapper relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
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
              <div className="about-hero__cta flex flex-wrap gap-3">
                <a
                  href={heroPrimaryCtaLink}
                  className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:opacity-90 sm:w-auto"
                >
                  {heroPrimaryCtaLabel}
                </a>
                <a
                  href={heroSecondaryCtaLink}
                  className="w-full rounded-full border border-white/25 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-emerald-300/70 sm:w-auto"
                >
                  {heroSecondaryCtaLabel}
                </a>
              </div>
            </div>
            <div className="about-hero__stats grid flex-1 gap-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.id || `${stat.title}-${stat.value}`}
                  className="about-hero__stat-card rounded-3xl border border-white/15 bg-white/5 p-5 text-center shadow-[0_25px_80px_rgba(2,6,23,0.35)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                    {stat.title || stat.label || "Metric"}
                  </p>
                  <p className="text-3xl font-semibold text-white sm:text-4xl">
                    {stat.value || "--"}
                  </p>
                  <p className="text-sm text-slate-300">
                    {stat.detail ||
                      stat.description ||
                      stat.subtitle ||
                      "Studio highlight"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal
          as="section"
          className="about-split grid w-full gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_20px_80px_rgba(15,23,42,0.55)]">
            <img
              src={
                whoSection.primaryImage ||
                "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60"
              }
              alt={whoSection.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-sm text-slate-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Live production floor – Sitamarhi HQ
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
              {whoSection.tagline}
            </p>
            <h2 className="text-4xl font-semibold text-white">
              {whoSection.title}
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              {whoSection.description}
            </p>
            <div className="about-grid grid gap-4">
              {whoHighlights.map((item) => (
                <article
                  key={item.id || item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {item.description || item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="w-full px-4 pb-16 sm:px-6 lg:px-8">
          <div className="about-founder__layout grid gap-12 rounded-[44px] bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-[0_45px_150px_rgba(15,23,42,0.8)] sm:p-10 lg:grid-cols-[420px_auto]">
            <div className="about-founder__portrait mx-auto flex h-72 w-72 items-center justify-center overflow-hidden rounded-[48px] border-[6px] border-emerald-400/50 bg-slate-900 sm:h-80 sm:w-80">
              <img
                src={
                  founderSection.primaryImage ||
                  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60"
                }
                alt={founderSection.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="about-founder__copy space-y-6 text-left">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
                {founderSection.tagline}
              </p>
              <div className="space-y-4">
                <h3 className="text-4xl font-semibold text-white lg:text-5xl">
                  {founderSection.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-300">
                  {founderSection.description}
                </p>
              </div>
              <ul className="about-grid grid gap-4 text-sm text-slate-200">
                {founderHighlights.map((highlight) => (
                  <li
                    key={highlight.id || highlight.description}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 p-4"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    {highlight.description || highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="w-full px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
              {teamSection.tagline}
            </p>
            <h3 className="text-4xl font-semibold text-white">
              {teamSection.title}
            </h3>
            <p className="text-slate-300">{teamSection.description}</p>
          </div>
          <div className="about-team__grid mt-12 grid gap-8">
            {currentTeamMembers.map((member, index) => (
              <Reveal
                as="div"
                key={member.id || member.title}
                delay={index * 120}
                className="h-full"
              >
                <EmployeeCard member={member} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </main>
    </>
  );
};

export default About;
