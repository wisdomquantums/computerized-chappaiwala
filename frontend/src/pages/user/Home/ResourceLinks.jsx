import { Link } from "react-router-dom";
import Reveal from "../../../components/ui/Reveal";

const resources = [
  {
    title: "Policy Center",
    description:
      "Read Terms, Privacy, Refund, and Shipping guidelines that govern every project, straight from our system pages.",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
      { label: "Refund", to: "/refund" },
      { label: "Shipping", to: "/shipping" },
    ],
  },
  {
    title: "Admin & employee portal",
    description:
      "Secure dashboards for your internal team. Managers can review orders, roles, and service catalogs once logged in.",
    links: [
      { label: "Admin login", to: "/admin/login" },
      { label: "Register", to: "/register" },
    ],
  },
  {
    title: "User support quick links",
    description:
      "Straight from the Contact file—call, WhatsApp, or drop by the Sitamarhi HQ whenever a brief needs human attention.",
    links: [
      { label: "Call studio", to: "tel:+917488986015" },
      { label: "WhatsApp", to: "https://wa.me/916203504230", external: true },
      { label: "Visit us", to: "/contact" },
    ],
  },
];

const ResourceLinks = () => {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="container-section">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
            Resources & governance
          </p>
          <h2 className="text-4xl font-semibold">
            Important hubs pulled from across the site
          </h2>
          <p className="mt-3 text-base text-slate-300">
            No more hunting through nav menus—these quick panels surface policy,
            admin, and support touch points already active on other pages.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Reveal
              key={resource.title}
              delay={index * 120}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6"
            >
              <h3 className="text-2xl font-semibold text-white">
                {resource.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300 flex-1">
                {resource.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {resource.links.map((link) => {
                  const baseClass =
                    "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold";
                  if (link.to.startsWith("http") || link.external) {
                    return (
                      <a
                        key={link.label}
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className={`${baseClass} text-white transition hover:border-emerald-300/80`}
                      >
                        {link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    );
                  }

                  if (link.to.startsWith("tel:")) {
                    return (
                      <a
                        key={link.label}
                        href={link.to}
                        className={`${baseClass} text-white transition hover:border-emerald-300/80`}
                      >
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`${baseClass} text-white transition hover:border-emerald-300/80`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceLinks;
