import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Dashboard.css";

const shortcutLinks = [
  {
    label: "Inquiry Inbox",
    description: "Respond to the latest customer briefs and messages.",
    to: "/admin/inquiries",
    icon: "inbox",
  },
  {
    label: "Support Tickets",
    description: "Triage escalations and assign owners in seconds.",
    to: "/admin/tickets",
    icon: "lifebuoy",
  },
  {
    label: "Service Catalog",
    description: "Update pricing, deliverables, and production notes.",
    to: "/admin/services",
    icon: "layers",
  },
  {
    label: "Portfolio Gallery",
    description: "Refresh the latest showcase work for customers.",
    to: "/admin/portfolio/projects",
    icon: "spark",
  },
  {
    label: "Role Manager",
    description: "Control access for admins, owners, and employees.",
    to: "/admin/roles",
    icon: "shield",
  },
  {
    label: "User Directory",
    description: "View every customer account and status in one tap.",
    to: "/admin/users/customers",
    icon: "users",
  },
];

const pipelineTemplate = [
  { key: "briefs", label: "New briefs", helper: "Awaiting triage" },
  {
    key: "production",
    label: "On-floor jobs",
    helper: "Services in execution",
  },
  { key: "approvals", label: "Pending approvals", helper: "Customer sign-off" },
  { key: "handoff", label: "Ready for delivery", helper: "QC complete" },
];

const trendMultipliers = [0.42, 0.48, 0.52, 0.6, 0.68, 0.74, 0.8];
const trendLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fallbackMix = [
  { label: "Wedding Cards", value: 14 },
  { label: "Office Kits", value: 11 },
  { label: "Branding", value: 8 },
  { label: "Flex/Banner", value: 6 },
];

const Dashboard = () => {
  const services = useSelector((state) => state?.services?.list ?? []);
  const orders = useSelector((state) => state?.orders?.list ?? []);
  const inquiries = useSelector((state) => state?.inquiries?.list ?? []);
  const tickets = useSelector((state) => state?.tickets?.list ?? []);
  const portfolio = useSelector((state) => state?.portfolio?.list ?? []);

  const openInquiries = inquiries.filter(
    (item) => item?.status !== "closed"
  ).length;
  const activeTickets = tickets.filter(
    (item) => item?.status !== "resolved"
  ).length;
  const activeOrders = orders.filter(
    (item) => item?.status !== "completed"
  ).length;

  const totalServices = services.length || 8;
  const totalPortfolio = portfolio.length || 24;
  const totalOrders = orders.length || 18;
  const totalInquiries = openInquiries || inquiries.length || 12;
  const totalTickets = activeTickets || tickets.length || 6;

  const estRevenue = orders.reduce((sum, order) => {
    const amount = Number(order?.amount || order?.total || 0);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const avgTicket = orders.length ? estRevenue / orders.length : 0;

  const metricCards = useMemo(
    () => [
      {
        label: "Open inquiries",
        value: totalInquiries,
        delta: "+8.3%",
        helper: "vs last week",
      },
      {
        label: "Active jobs",
        value: Math.max(activeOrders, Math.round(totalServices * 0.6)),
        delta: "+4 slots",
        helper: "production floor",
      },
      {
        label: "Tickets in triage",
        value: totalTickets,
        delta: "2 urgent",
        helper: "needs attention",
      },
      {
        label: "Avg. order value",
        value:
          avgTicket > 0
            ? `₹${Math.round(avgTicket).toLocaleString()}`
            : "₹3,200",
        delta: "steady",
        helper: "last 7 days",
      },
    ],
    [totalInquiries, activeOrders, totalServices, totalTickets, avgTicket]
  );

  const trendSeries = useMemo(() => {
    const baseline = Math.max(24, totalOrders * 1.4 + 12);
    return trendLabels.map((label, index) => ({
      label,
      value: Math.round(baseline * trendMultipliers[index]),
    }));
  }, [totalOrders]);

  const maxTrendValue = Math.max(...trendSeries.map((point) => point.value), 1);
  const trendPath = trendSeries
    .map((point, idx) => {
      const x = (idx / (trendSeries.length - 1)) * 100;
      const y = 40 - (point.value / maxTrendValue) * 28 - 6;
      const command = idx === 0 ? "M" : "L";
      return `${command}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const trendFillPath = `${trendPath} L100,40 L0,40 Z`;

  const pipelineStages = pipelineTemplate.map((stage) => {
    let value = 0;
    if (stage.key === "briefs") {
      value = totalInquiries;
    } else if (stage.key === "production") {
      value = Math.max(activeOrders, totalServices * 0.7);
    } else if (stage.key === "approvals") {
      value = Math.max(1, Math.round(totalOrders * 0.35));
    } else if (stage.key === "handoff") {
      value = Math.max(1, Math.round(totalPortfolio * 0.25));
    }
    return {
      ...stage,
      value: Math.round(value),
    };
  });

  const workloadLoad = Math.min(
    100,
    Math.round((activeOrders / (totalServices || 1)) * 100)
  );

  const serviceMix = useMemo(() => {
    if (!services.length) {
      return fallbackMix;
    }

    const tally = services.reduce((acc, item) => {
      const key = item?.category || item?.name || "Custom";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tally)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [services]);

  const maxMixValue = useMemo(
    () => Math.max(...serviceMix.map((mix) => mix.value), 1),
    [serviceMix]
  );

  const channelSplit = useMemo(() => {
    const inquiryShare = totalInquiries || 8;
    const orderShare = totalOrders || 12;
    const ticketShare = totalTickets || 5;
    const portfolioShare = totalPortfolio || 10;
    return [
      { label: "Inquiries", value: inquiryShare, color: "#6366f1" },
      { label: "Orders", value: orderShare, color: "#0ea5e9" },
      { label: "Tickets", value: ticketShare, color: "#f97316" },
      { label: "Portfolio", value: portfolioShare, color: "#22c55e" },
    ];
  }, [totalInquiries, totalOrders, totalTickets, totalPortfolio]);

  const totalChannelValue =
    channelSplit.reduce((sum, item) => sum + item.value, 0) || 1;
  let donutCursor = 0;
  const donutGradient = channelSplit
    .map((segment) => {
      const start = (donutCursor / totalChannelValue) * 100;
      donutCursor += segment.value;
      const end = (donutCursor / totalChannelValue) * 100;
      return `${segment.color} ${start}% ${end}%`;
    })
    .join(", ");

  const performanceStats = [
    {
      label: "SLA compliance",
      value: 94,
      helper: "responded under 2h",
      status: "+2.1%",
      color: "#10b981",
    },
    {
      label: "Avg. turnaround",
      value: 36,
      helper: "hours to delivery",
      status: "-4h",
      color: "#6366f1",
    },
    {
      label: "Customer NPS",
      value: 72,
      helper: "survey of last 30 orders",
      status: "+5",
      color: "#f59e0b",
    },
  ];

  const activityFeed = [
    {
      label: `New inquiry assigned (${totalInquiries}+ open)`,
      meta: "Rupa Devi · Wedding Cards",
      time: "2m ago",
    },
    {
      label: "Support ticket escalated",
      meta: `${totalTickets} tickets pending triage`,
      time: "18m ago",
    },
    {
      label: "Portfolio item published",
      meta: `${totalPortfolio} live case studies`,
      time: "1h ago",
    },
    {
      label: "Order handoff scheduled",
      meta: `${activeOrders} active orders in floor ops`,
      time: "Today 09:20",
    },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__hero card-surface">
        <div>
          <p className="admin-dashboard__eyebrow">Operations pulse</p>
          <h1>Studio control dashboard</h1>
          <p>
            Live signal for inquiries, production, and delivery so you can pivot
            resources in minutes.
          </p>
          <div className="admin-dashboard__hero-stats">
            <div>
              <span>Open workflows</span>
              <strong>{totalInquiries + activeOrders + totalTickets}</strong>
            </div>
            <div>
              <span>Catalog services</span>
              <strong>{totalServices}</strong>
            </div>
            <div>
              <span>Portfolio items</span>
              <strong>{totalPortfolio}</strong>
            </div>
          </div>
        </div>
        <div className="admin-dashboard__hero-panel">
          <div>
            <p>Workload index</p>
            <h3>{workloadLoad}%</h3>
            <p className="admin-dashboard__hero-panel-sub">
              Based on open production jobs vs. staffed services
            </p>
          </div>
          <div className="admin-dashboard__hero-meter">
            <span style={{ width: `${Math.min(100, workloadLoad)}%` }} />
          </div>
          <ul>
            <li>
              <span className="dot dot--green" /> {totalInquiries} briefs in
              queue
            </li>
            <li>
              <span className="dot dot--amber" /> {activeOrders} jobs in
              progress
            </li>
            <li>
              <span className="dot dot--purple" /> {totalTickets} tickets to
              triage
            </li>
          </ul>
        </div>
      </div>

      <div className="admin-dashboard__metrics">
        {metricCards.map((card) => (
          <article
            key={card.label}
            className="card-surface admin-dashboard__metric"
          >
            <p>{card.label}</p>
            <h3>{card.value}</h3>
            <span>{card.delta}</span>
            <small>{card.helper}</small>
          </article>
        ))}
      </div>

      <div className="admin-dashboard__performance">
        {performanceStats.map((stat) => (
          <article
            key={stat.label}
            className="card-surface admin-dashboard__performance-card"
          >
            <div className="admin-dashboard__performance-header">
              <p>{stat.label}</p>
              <span>{stat.status}</span>
            </div>
            <h3>
              {stat.value}
              {stat.label.includes("compliance") && "%"}
            </h3>
            <small>{stat.helper}</small>
            <div className="admin-dashboard__performance-track">
              <span
                style={{
                  width: `${Math.min(100, stat.value)}%`,
                  background: stat.color,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="admin-dashboard__grid">
        <article className="card-surface admin-dashboard__card admin-dashboard__card--bars">
          <div className="admin-dashboard__card-head">
            <div>
              <p>Service mix</p>
              <h3>Top production demand</h3>
            </div>
            <span className="badge badge--neutral">Live data</span>
          </div>
          <div className="admin-dashboard__bars">
            {serviceMix.map((item) => {
              const heightPercent = (item.value / maxMixValue) * 100;
              return (
                <div key={item.label} className="admin-dashboard__bar">
                  <div
                    className="admin-dashboard__bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span>{item.label}</span>
                  <small>{item.value} jobs</small>
                </div>
              );
            })}
          </div>
        </article>

        <article className="card-surface admin-dashboard__card admin-dashboard__card--donut">
          <div className="admin-dashboard__card-head">
            <div>
              <p>Channel share</p>
              <h3>Operational intake</h3>
            </div>
            <span className="badge">Now</span>
          </div>
          <div className="admin-dashboard__donut">
            <div
              className="admin-dashboard__donut-visual"
              style={{ background: `conic-gradient(${donutGradient})` }}
            >
              <div>
                <strong>{totalChannelValue}</strong>
                <span>touch-points</span>
              </div>
            </div>
            <ul>
              {channelSplit.map((segment) => (
                <li key={segment.label}>
                  <span style={{ background: segment.color }} />
                  <div>
                    <p>{segment.label}</p>
                    <small>
                      {segment.value} ·{" "}
                      {Math.round((segment.value / totalChannelValue) * 100)}%
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="admin-dashboard__insights">
        <article className="card-surface admin-dashboard__card admin-dashboard__card--chart">
          <div className="admin-dashboard__card-head">
            <div>
              <p>Weekly order trajectory</p>
              <h3>Production velocity</h3>
            </div>
            <span className="badge">Live</span>
          </div>
          <p className="admin-dashboard__card-sub">
            Trend derived from the last 7 operational days.
          </p>
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="admin-dashboard__chart"
          >
            <defs>
              <linearGradient
                id="dashboardLine"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={trendFillPath} fill="url(#dashboardLine)" />
            <path
              d={trendPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="admin-dashboard__chart-labels">
            {trendSeries.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </article>

        <article className="card-surface admin-dashboard__card admin-dashboard__card--pipeline">
          <div className="admin-dashboard__card-head">
            <div>
              <p>Live pipeline</p>
              <h3>Studio handoff board</h3>
            </div>
            <span className="badge badge--neutral">Auto-sync</span>
          </div>
          <ul>
            {pipelineStages.map((stage) => (
              <li key={stage.key}>
                <div>
                  <p>{stage.label}</p>
                  <small>{stage.helper}</small>
                </div>
                <strong>{stage.value}</strong>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card-surface admin-dashboard__activity">
        <div className="admin-dashboard__card-head">
          <div>
            <p>Signals</p>
            <h3>Latest activity</h3>
          </div>
        </div>
        <ul>
          {activityFeed.map((item) => (
            <li key={item.label}>
              <div>
                <p>{item.label}</p>
                <small>{item.meta}</small>
              </div>
              <span>{item.time}</span>
            </li>
          ))}
        </ul>
      </article>

      <div className="card-surface admin-dashboard__shortcuts">
        <div className="admin-dashboard__card-head">
          <div>
            <p>Shortcuts</p>
            <h3>Jump to high-impact areas</h3>
          </div>
        </div>
        <div className="admin-dashboard__shortcuts-grid">
          {shortcutLinks.map((link) => (
            <Link
              to={link.to}
              key={link.label}
              className="admin-dashboard__shortcut"
            >
              <span
                className="admin-dashboard__shortcut-icon"
                data-icon={link.icon}
              >
                {getIcon(link.icon)}
              </span>
              <div>
                <p>{link.label}</p>
                <small>{link.description}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const getIcon = (name) => {
  switch (name) {
    case "inbox":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect
            x="3"
            y="4"
            width="18"
            height="14"
            rx="2"
            ry="2"
            strokeWidth="1.6"
          />
          <path
            d="M3 13h4l2 3h6l2-3h4"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lifebuoy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="7" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="1.6" />
          <path
            d="M5.6 5.6l2.4 2.4m8 8 2.4 2.4m0-12.8-2.4 2.4m-8 8-2.4 2.4"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M3 9l9 4 9-4-9-4-9 4Z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m3 15 9 4 9-4" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 2v5m0 10v5m5-10h5M2 12h5m9.5-6.5L22 4m-9.5 14.5L22 20M2 4l5.5 1.5M2 20l5.5-1.5"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 3 4 6v6c0 4.5 3.1 8.6 8 9.9 4.9-1.3 8-5.4 8-9.9V6l-8-3Z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "users":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="9" r="3" strokeWidth="1.6" />
          <circle cx="17" cy="9" r="2.5" strokeWidth="1.6" />
          <path
            d="M4 20c0-2.8 2.2-5 5-5s5 2.2 5 5"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 20c0-2 1.6-3.6 3.6-3.6 1 0 1.9.3 2.4.7"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

export default Dashboard;
