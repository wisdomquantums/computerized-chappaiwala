import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../configs/axios";
import "./InquiryForm.css";

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

const InquiryForm = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname?.startsWith("/admin");
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const autoOpenRef = useRef(false);

  const inquiryEmail = useMemo(
    () => import.meta.env.VITE_INQUIRY_EMAIL || DEFAULT_INQUIRY_EMAIL,
    []
  );

  const syncModalState = useCallback(() => {
    if (isAdminRoute) {
      if (isOpen) {
        setIsOpen(false);
      }
      autoOpenRef.current = false;
      return;
    }

    if (location.pathname === "/") {
      if (!autoOpenRef.current) {
        autoOpenRef.current = true;
        setIsOpen(true);
      }
      return;
    }

    if (isOpen) {
      setIsOpen(false);
    }
    autoOpenRef.current = false;
  }, [isAdminRoute, location.pathname, isOpen]);

  useEffect(() => {
    if (typeof requestAnimationFrame === "undefined") {
      return undefined;
    }
    const frameId = requestAnimationFrame(syncModalState);
    return () => cancelAnimationFrame(frameId);
  }, [syncModalState]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

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

  if (isAdminRoute) {
    return null;
  }

  const formContent = (
    <div className="inquiry-modal__content space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Quick Inquiry
          </span>
          <h3 className="text-2xl font-semibold text-white">
            Tell us about your job
          </h3>
          <p className="text-sm text-slate-300">
            Share a couple of details and our team will respond with pricing and
            timelines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="self-end rounded-full bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white sm:self-auto"
          aria-label="Close inquiry form"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="inquiry-form space-y-5">
        <div className="inquiry-form__grid">
          <label
            className="space-y-1 text-xs font-semibold text-slate-300"
            htmlFor="inquiry-name"
          >
            Name
            <input
              id="inquiry-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              placeholder="Your full name"
              required
            />
          </label>
          <label
            className="space-y-1 text-xs font-semibold text-slate-300"
            htmlFor="inquiry-email"
          >
            Email
            <input
              id="inquiry-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              placeholder="you@example.com"
              required
            />
          </label>
          <label
            className="space-y-1 text-xs font-semibold text-slate-300"
            htmlFor="inquiry-phone"
          >
            Mobile Number
            <input
              id="inquiry-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              placeholder="91XXXXXXXXXX"
              required
            />
          </label>
          <label
            className="space-y-1 text-xs font-semibold text-slate-300"
            htmlFor="inquiry-service"
          >
            Services
            <div className="relative">
              <select
                id="inquiry-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
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
          className="space-y-1 text-xs font-semibold text-slate-300"
          htmlFor="inquiry-description"
        >
          Description
          <textarea
            id="inquiry-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Share print sizes, quantities, finishing, or delivery timelines"
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>

      {status && (
        <p
          className={`mt-3 text-xs font-semibold ${
            status.type === "success" ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-[60] rounded-full bg-slate-900/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 shadow-xl transition hover:bg-slate-800"
        >
          Inquiry
        </button>
      )}
      {isOpen && (
        <div className="inquiry-modal" role="presentation">
          <div
            className="inquiry-modal__backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick inquiry form"
            className="inquiry-modal__panel relative z-10 w-full max-w-md rounded-t-[32px] border border-emerald-500/30 bg-slate-950/95 text-slate-50 shadow-2xl sm:max-w-2xl sm:rounded-[32px]"
          >
            <div className="inquiry-modal__scroll" tabIndex={0}>
              {formContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiryForm;
