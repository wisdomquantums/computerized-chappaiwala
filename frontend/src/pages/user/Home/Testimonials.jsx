import { useEffect, useMemo, useState } from "react";

const testimonials = [
  {
    name: "Anjali & Ritesh",
    role: "Wedding clients",
    highlight: "Foil + laser-cut invites delivered in 4 days",
    quote:
      "They handled design, printing, and doorstep delivery without a single follow-up. Colors were exactly what we approved on WhatsApp.",
  },
  {
    name: "Mahavir Electronics",
    role: "Retail chain",
    highlight: "2,500 cash memo pads every quarter",
    quote:
      "Invoices arrive numbered, perforated, and bundled per store. Pricing is predictable, and urgent top-ups reach within 24 hours.",
  },
  {
    name: "Drishti Coaching",
    role: "Education brand",
    highlight: "Campaign flex + student kits",
    quote:
      "From coaches’ IDs to 12-foot banners, the team coordinated proofs late night and installed before our launch morning.",
  },
  {
    name: "Sitamarhi Diagnostics",
    role: "Healthcare center",
    highlight: "Patient files + signage refresh",
    quote:
      "Letter pads, envelopes, and waiting room displays arrived labeled per department. They even updated our QR appointment posters overnight.",
  },
  {
    name: "Arya Agro",
    role: "Agri supplier",
    highlight: "Festival calendar giveaways",
    quote:
      "Calendars with crop tips were packed by district and shipped with zero breakage. Repeat orders are now a single WhatsApp message away.",
  },
  {
    name: "Miracle Bakers",
    role: "Retail cafe",
    highlight: "Menu boards + loyalty cards",
    quote:
      "They redesigned our menu, printed waterproof boards, and synced loyalty cards with QR tracking. Footfall spiked the same week.",
  },
];

const chunkTestimonials = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const Testimonials = () => {
  const slides = useMemo(() => chunkTestimonials(testimonials, 3), []);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const visibleTestimonials = slides[activeSlide] || [];

  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="container-section">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
            Voices from Sitamarhi
          </p>
          <h2 className="text-4xl font-semibold">Testimonials</h2>
          <p className="text-base text-slate-300">
            A quick peek into the feedback shared on our Contact page, WhatsApp
            chats, and Portfolio handovers.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {visibleTestimonials.map((client) => (
            <article
              key={client.name}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.45)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                {client.role}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {client.name}
              </h3>
              <p className="mt-2 text-sm text-emerald-200">
                {client.highlight}
              </p>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-slate-200">
                “{client.quote}”
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/50">
                <span className="h-1 w-10 rounded-full bg-emerald-400" />
                Verified client
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={`testimonial-dot-${index}`}
              type="button"
              aria-label={`Go to testimonial slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide ? "w-10 bg-white" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
