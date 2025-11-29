import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Reveal from "../../../components/ui/Reveal";
import { fetchContactPage } from "../../../features/contact/contactSlice";
import api from "../../../configs/axios";
import PageSeo from "../../../components/seo/PageSeo";
import { BRAND_NAME, SITE_URL, LOGO_URL } from "../../../constants/seo";

const iconMap = {
  location: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  ),
  phone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M22 16.92V19a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 12 19.79 19.79 0 0 1 0 3.69 2 2 0 0 1 2 1.5h2.09a2 2 0 0 1 2 1.72 12.64 12.64 0 0 0 .7 2.77 2 2 0 0 1-.45 2.11L5.1 9.5a16 16 0 0 0 9.4 9.4l1.4-1.24a2 2 0 0 1 2.11-.45 12.64 12.64 0 0 0 2.77.7 2 2 0 0 1 1.72 2.01Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  whatsapp: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="currentColor"
    >
      <path d="M20.1 3.9A11.45 11.45 0 0 0 12 .5 11.45 11.45 0 0 0 3.9 3.9C.7 7.1.3 12 .8 15.7L0 23.5l8-.8a11.8 11.8 0 0 0 4 .7h.4a11.36 11.36 0 0 0 7.8-3.2c3.2-3.2 4.6-8.1 2.1-12.3Zm-8.1 17.3h-.3a9.57 9.57 0 0 1-3.5-.7l-.5-.2-4.7.5.5-4.7-.2-.5A9.2 9.2 0 0 1 3 7.2 9.59 9.59 0 0 1 12 2.1a9.37 9.37 0 0 1 6.8 2.9c4.2 4.2 2.8 10.5-.9 14.2a9.21 9.21 0 0 1-6.9 2.4Zm5.3-6.9c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.1-.3.2-.6.1a7.61 7.61 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.4 0-.6.1-.7s.3-.3.4-.5a.65.65 0 0 0 .1-.6 11.4 11.4 0 0 0-.7-1.3c-.2-.4-.5-.4-.7-.4h-.6a1.08 1.08 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.92 5.92 0 0 0 1.3 3.1 13.39 13.39 0 0 0 5.2 4.7 17.79 17.79 0 0 0 1.8.7 4.33 4.33 0 0 0 2 .1 3.17 3.17 0 0 0 2.1-1.5 2.53 2.53 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  ),
  email: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const fallbackContactCards = [
  {
    title: "Visit our studio",
    icon: "location",
    lines: [
      "Computerized Chhappaiwala",
      "Hospital Road, Sitamarhi",
      "Bihar – 843302",
    ],
  },
  {
    title: "Call us directly",
    icon: "phone",
    lines: ["9801305451", "7488986015", "6203504230"],
    action: { type: "tel", href: "tel:+919801305451", label: "Call" },
  },
  {
    title: "WhatsApp support",
    icon: "whatsapp",
    lines: ["Instant proofs", "Order tracking", "Artwork approvals"],
    action: {
      type: "link",
      href: "https://wa.me/917488986015",
      label: "Chat now",
    },
  },
  {
    title: "Email",
    icon: "email",
    lines: ["info@chhappaiwala.com", "support@chhappaiwala.com"],
    action: {
      type: "mailto",
      href: "mailto:info@chhappaiwala.com",
      label: "Mail",
    },
  },
];

const fallbackContent = {
  heroEyebrow: "Contact Us",
  heroTitle: "We’re here to help you with your printing needs",
  heroDescription:
    "Reach out for wedding cards, commercial stationery, bulk flex printing, or any custom requirement.",
  messageTitle: "Send us a message",
  messageDescription:
    "Share project details, delivery timelines, or upload requirements.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57082.52256518845!2d85.47341119530944!3d26.595358656832904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ecf1ccd55e26b5%3A0xf26bcff995fd35cf!2sComputerized%20Chhapaiwala!5e0!3m2!1sen!2sin!4v1764356743220!5m2!1sen!2sin",
  openingEyebrow: "Opening Hours",
  openingTitle: "Mon–Sun: 9:00 AM – 9:00 PM",
  openingDescription:
    "No holiday. Drop in anytime with your brief or call ahead.",
  formWhatsappLabel: "WhatsApp Direct Chat",
  formWhatsappLink: "https://wa.me/919801305451",
  ctaEyebrow: "Need fast and reliable printing?",
  ctaTitle: "Need fast and reliable printing? Contact us today!",
  ctaDescription:
    "Wedding suites, corporate stationery, flex banners, and more—crafted with premium stock and fast turnarounds.",
  primaryCtaLabel: "Call Now",
  primaryCtaLink: "tel:+919801305451",
  secondaryCtaLabel: "WhatsApp",
  secondaryCtaLink: "https://wa.me/919801305451",
};

const DEFAULT_INQUIRY_EMAIL = "computerizedchhappaiwala@gmail.com";
const SERVICE_OPTIONS = [
  "Wedding Card",
  "Cashmemo",
  "LetterPad",
  "Handbill",
  "Calendar",
  "Custom Design",
  "Other",
];

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  service: SERVICE_OPTIONS[0],
  description: "",
};

const ContactUs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cards, pageContent } = useSelector((state) => state.contact);
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inquiryEmail =
    import.meta.env.VITE_INQUIRY_EMAIL || DEFAULT_INQUIRY_EMAIL;

  useEffect(() => {
    dispatch(fetchContactPage());
  }, [dispatch]);

  const liveContent = { ...fallbackContent, ...(pageContent || {}) };
  const liveCards = cards?.length ? cards : fallbackContactCards;

  const contactKeywords = [
    "contact Computerized Chhappaiwala",
    "Sitamarhi printing contact",
    "wedding card support",
    "flex printing phone",
  ];

  const contactPoints = liveCards
    .map((card) => {
      const numbers = (card.lines || []).filter((line) =>
        /[0-9]{6,}/.test(line)
      );
      const emails = (card.lines || []).filter((line) => line.includes("@"));
      if (!numbers.length && !emails.length) return null;
      const base = {
        "@type": "ContactPoint",
        contactType: card.title,
        areaServed: "Sitamarhi, Bihar",
        availableLanguage: ["en", "hi"],
      };
      if (numbers.length) {
        return { ...base, telephone: numbers[0] };
      }
      return { ...base, email: emails[0] };
    })
    .filter(Boolean);

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: liveContent.heroTitle,
    description: liveContent.heroDescription,
    url: `${SITE_URL}/contact`,
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
      logo: LOGO_URL,
    },
    mainEntity: {
      "@type": "Organization",
      name: BRAND_NAME,
      contactPoint: contactPoints,
      sameAs: [liveContent.formWhatsappLink].filter(Boolean),
    },
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status) setStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) return;

    const { name, email, phone, description } = formData;
    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setStatus({ type: "error", message: "Fill out all required fields." });
      return;
    }

    setSubmitting(true);
    api
      .post("/inquiries", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        description: formData.description.trim(),
        sourcePage: location.pathname,
        metadata: { inquiryEmail },
      })
      .then(() => {
        setStatus({
          type: "success",
          message: "Thanks! Your inquiry reached the CCW team.",
        });
        setFormData(initialFormState);
      })
      .catch((error) => {
        setStatus({
          type: "error",
          message: error.message || "Unable to submit inquiry right now.",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <PageSeo
        title="Contact Computerized Chhappaiwala"
        description="Call, WhatsApp, or visit the Sitamarhi printing studio to brief wedding cards, stationery, flex, and corporate branding jobs."
        path="/contact"
        keywords={contactKeywords}
        structuredData={contactStructuredData}
        type="ContactPage"
      />
      <main className="bg-slate-950 text-slate-100">
        <Reveal
          as="section"
          className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-20 text-center sm:px-6 floating-orb"
        >
          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-emerald-500/30 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-400/30 blur-[140px]" />
          </div>
          <div className="relative mx-auto max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300">
              {liveContent.heroEyebrow}
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {liveContent.heroTitle}
            </h1>
            <p className="text-base text-slate-300">
              {liveContent.heroDescription}
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="px-4 py-16 sm:px-6 lg:px-10">
          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
            {liveCards.map((card, index) => {
              const actionAvailable = card.actionLabel && card.actionHref;
              const actionType = card.actionType || "link";
              const isExternal =
                actionType === "link" || actionType === "whatsapp";
              const cardAction = actionAvailable
                ? {
                    href: card.actionHref,
                    target: isExternal ? "_blank" : undefined,
                    rel: isExternal ? "noreferrer" : undefined,
                  }
                : null;

              return (
                <Reveal
                  as="article"
                  key={card.id || card.title || index}
                  delay={index * 120}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur"
                >
                  <div className="flex items-center gap-3 text-emerald-300">
                    <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                      {iconMap[card.iconKey || card.icon] || iconMap.location}
                    </span>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                      {card.eyebrow || "Contact"}
                    </p>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {card.title}
                  </h2>
                  <ul className="mt-3 space-y-1 text-sm text-slate-200">
                    {(card.lines || []).map((line, lineIndex) => (
                      <li key={`${card.title}-${lineIndex}`}>{line}</li>
                    ))}
                  </ul>
                  {actionAvailable && cardAction && (
                    <a
                      href={cardAction.href}
                      target={cardAction.target}
                      rel={cardAction.rel}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-emerald-300/70"
                    >
                      {card.actionLabel}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          d="M5 12h14M13 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )}
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <Reveal as="section" className="px-4 pb-16 sm:px-6 lg:px-10">
          <div className="grid w-full gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <Reveal
              as="div"
              className="order-2 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(2,6,23,0.45)] lg:order-1 lg:min-h-[580px] lg:p-10"
            >
              <h2 className="text-2xl font-semibold text-white">
                {liveContent.messageTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {liveContent.messageDescription}
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label
                    className="space-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-400"
                    htmlFor="contact-name"
                  >
                    Name
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/70 focus:outline-none"
                      required
                    />
                  </label>
                  <label
                    className="space-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-400"
                    htmlFor="contact-email"
                  >
                    Email
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/70 focus:outline-none"
                      required
                    />
                  </label>
                  <label
                    className="space-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-400"
                    htmlFor="contact-phone"
                  >
                    Mobile Number
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="91XXXXXXXXXX"
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/70 focus:outline-none"
                      required
                    />
                  </label>
                  <label
                    className="space-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-400"
                    htmlFor="contact-service"
                  >
                    Services
                    <div className="relative">
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                      >
                        {SERVICE_OPTIONS.map((service) => (
                          <option
                            key={service}
                            value={service}
                            className="text-slate-900"
                          >
                            {service}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
                        ⌄
                      </span>
                    </div>
                  </label>
                </div>
                <label
                  className="space-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-400"
                  htmlFor="contact-description"
                >
                  Description
                  <textarea
                    id="contact-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Share print sizes, quantities, finishing, or delivery timelines"
                    className="w-full rounded-3xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/70 focus:outline-none"
                    required
                  />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                  <a
                    href={liveContent.formWhatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-emerald-400/70"
                  >
                    {liveContent.formWhatsappLabel}
                  </a>
                </div>
              </form>
              {status && (
                <p
                  className={`mt-3 text-xs font-semibold ${
                    status.type === "success"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </Reveal>
            <Reveal
              as="div"
              className="order-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(2,6,23,0.45)] lg:order-2"
            >
              <iframe
                title="Computerized Chhappaiwala on Google Maps"
                src={liveContent.mapEmbedUrl}
                width="100%"
                height="400"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
            </Reveal>
          </div>
        </Reveal>

        <Reveal as="section" className="px-4 pb-12 sm:px-6 lg:px-10">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              {liveContent.openingEyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {liveContent.openingTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {liveContent.openingDescription}
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="px-4 pb-20 sm:px-6 lg:px-10">
          <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400 to-cyan-400 p-10 text-center text-slate-900">
            <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-800">
              {liveContent.ctaEyebrow}
            </h4>
            <h2 className="mt-3 text-3xl font-semibold">
              {liveContent.ctaTitle}
            </h2>
            <p className="mt-3 text-base text-slate-900/80">
              {liveContent.ctaDescription}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={liveContent.primaryCtaLink}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg"
              >
                {liveContent.primaryCtaLabel}
              </a>
              <a
                href={liveContent.secondaryCtaLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {liveContent.secondaryCtaLabel}
              </a>
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
};

export default ContactUs;
