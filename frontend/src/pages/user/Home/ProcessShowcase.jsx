import { Link } from "react-router-dom";
import Reveal from "../../../components/ui/Reveal";

const workflowSteps = [
  {
    label: "01",
    title: "Share your brief",
    description:
      "Send references via WhatsApp or upload files from the Contact page. We reply with formats, paper stock, and timeline within hours.",
    cta: { label: "Contact team", to: "/contact" },
  },
  {
    label: "02",
    title: "Approve the digital proof",
    description:
      "Our design unit refines layout, monograms, and language. You review high-res proofs in browser or mobile before green-lighting production.",
    cta: { label: "View portfolio", to: "/portfolio" },
  },
  {
    label: "03",
    title: "Production & finishing",
    description:
      "Specialty inks, lamination, wiro binding, or laser-cutting happen in-house so deadlines stay predictable across bulk and custom runs.",
    cta: { label: "Explore services", to: "/services" },
  },
  {
    label: "04",
    title: "Dispatch & install",
    description:
      "Doorstep delivery across Sitamarhi plus on-ground installation for flex, hoardings, and storefront branding within committed slots.",
    cta: { label: "Track support", to: "/order" },
  },
];

const ProcessShowcase = () => {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="container-section">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
            Delivery workflow
          </p>
          <h2 className="text-4xl font-semibold">
            How Computerized Chhappaiwala takes you from idea to install
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Pulled from our Services and Contact pages, this four-step track
            keeps every order on-brand, on-budget, and on-time for Sitamarhi
            businesses.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {workflowSteps.map((step, index) => (
            <Reveal
              key={step.label}
              delay={(index % 2) * 120}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.45)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-300">
                  {step.label}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 text-sm font-semibold text-white/80">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300">{step.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-400">Step {index + 1} of 4</span>
                <Link
                  to={step.cta.to}
                  className="inline-flex items-center gap-2 text-emerald-300 transition hover:text-white"
                >
                  {step.cta.label}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
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
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessShowcase;
