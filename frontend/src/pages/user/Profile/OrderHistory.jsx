import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../../../components/ui/Reveal";
import Loader from "../../../components/ui/Loader";
import { fetchCustomerOrders } from "../../../features/orders/customerOrdersSlice";

const STATUS_STEPS = [
  "Pending",
  "In progress",
  "Waiting on client",
  "QA",
  "Completed",
  "Archived",
];

const STATUS_SUBTEXT = {
  Pending: "We received your request and logged the brief.",
  "In progress": "Our team is actively building your order.",
  "Waiting on client": "We need a quick input from you to move ahead.",
  QA: "The delivery is undergoing internal quality assurance.",
  Completed: "The project is delivered. Reach out for any tweaks.",
  Archived: "Closed for now. Reactivate anytime from support.",
};

const PRIORITY_BADGE = {
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-cyan-50 text-cyan-600",
  High: "bg-amber-50 text-amber-600",
  Critical: "bg-rose-50 text-rose-600",
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Not shared";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Not shared";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatBudget = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Estimate pending";
  }
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return currency.format(Number(value));
};

const formatTimelinePercentage = (status) => {
  const index = STATUS_STEPS.findIndex((step) => step === status);
  if (index < 0) return 0;
  const totalSegments = STATUS_STEPS.length - 1;
  if (totalSegments <= 0) return 0;
  return (index / totalSegments) * 100;
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { list, loading, error, initialized } = useSelector(
    (state) => state.customerOrders
  );
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchCustomerOrders());
    }
  }, [dispatch, initialized, loading]);

  const summary = useMemo(() => {
    const total = list.length;
    const completed = list.filter(
      (order) => order.status === "Completed"
    ).length;
    const active = list.filter(
      (order) => order.status !== "Completed" && order.status !== "Archived"
    ).length;
    return { total, completed, active };
  }, [list]);

  const filteredOrders = useMemo(() => {
    const cloned = [...list];
    const filtered = cloned.filter((order) => {
      if (statusFilter === "active") {
        return order.status !== "Completed" && order.status !== "Archived";
      }
      if (statusFilter === "completed") {
        return order.status === "Completed";
      }
      return true;
    });

    return filtered.sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      return sortOrder === "recent" ? bDate - aDate : aDate - bDate;
    });
  }, [list, sortOrder, statusFilter]);

  const nextDueOrder = useMemo(() => {
    return filteredOrders
      .filter((order) => order.dueDate)
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0];
  }, [filteredOrders]);

  const spotlightOrder = filteredOrders[0];
  const filters = [
    { key: "all", label: "All orders", count: summary.total },
    { key: "active", label: "In progress", count: summary.active },
    { key: "completed", label: "Completed", count: summary.completed },
  ];

  const handleRefresh = () => {
    if (!loading) {
      dispatch(fetchCustomerOrders());
    }
  };

  const renderOrders = () => {
    if (loading && !initialized) {
      return (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      );
    }

    if (error && !list.length) {
      return (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center text-rose-600">
          {error}
        </div>
      );
    }

    if (!list.length) {
      return (
        <div className="rounded-4xl border border-dashed border-white/15 bg-slate-900/60 p-10 text-center text-white/70 shadow-[0_25px_60px_rgba(15,23,42,0.45)]">
          <p className="text-lg font-semibold text-white">No orders yet</p>
          <p className="mt-2 text-sm">
            Once you place your first service request, the order timeline and
            delivery progress will appear here.
          </p>
          <Link
            to="/services"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40"
          >
            Explore services
          </Link>
        </div>
      );
    }

    if (!filteredOrders.length) {
      return (
        <div className="rounded-3xl border border-amber-200/30 bg-amber-50/20 p-6 text-center text-amber-100">
          <p className="text-base font-semibold text-white">
            No {statusFilter} orders to show
          </p>
          <p className="mt-1 text-sm text-white/70">
            Try switching filters or adjust the sort to explore other requests.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-2">
        {filteredOrders.map((order) => {
          const timelinePercent = formatTimelinePercentage(order.status);
          const priorityClass =
            PRIORITY_BADGE[order.priority] || PRIORITY_BADGE.Medium;
          return (
            <article
              key={order.id}
              className="rounded-4xl border border-white/15 bg-white/95 p-6 text-slate-900 shadow-xl shadow-slate-900/10"
            >
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
                    #{order.id?.slice(0, 8) || "ORDER"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    {order.projectName || "Custom service"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Ordered on {formatDate(order.createdAt)}, last updated{" "}
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${priorityClass}`}
                  >
                    {order.priority} priority
                  </span>
                  <span className="rounded-full bg-slate-900/90 px-4 py-1 text-xs font-semibold text-white">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                    <span>Progress</span>
                    <span>{order.status}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      style={{ width: `${timelinePercent}%` }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    {STATUS_STEPS.map((step) => (
                      <span
                        key={step}
                        className={`flex items-center gap-2 ${
                          STATUS_STEPS.indexOf(step) <=
                          STATUS_STEPS.indexOf(order.status)
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full border border-current" />
                        {step}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Service details
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Service:{" "}
                        </span>
                        {order.serviceLine || "Custom brief"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Channel:{" "}
                        </span>
                        {order.channel}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Quantity:{" "}
                        </span>
                        {order.quantity}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Estimated budget:{" "}
                        </span>
                        {formatBudget(order.budget)}
                      </p>
                      {order.dueDate && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Target delivery:{" "}
                          </span>
                          {formatDate(order.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Notes & updates
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {order.description ||
                        STATUS_SUBTEXT[order.status] ||
                        "We will keep you posted with every milestone."}
                    </p>
                    {order.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                      Need help?
                    </p>
                    <p>
                      Reach us at{" "}
                      <span className="font-semibold text-slate-900">
                        support@ccw.com
                      </span>{" "}
                      or call {"+91 6202377489"}
                    </p>
                  </div>
                  <Link
                    to={`/profile/support?orderId=${order.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow"
                  >
                    Raise a support ticket →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <main className="relative min-h-screen bg-slate-950 pb-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20">
        <Reveal
          as="section"
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl md:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-400/10 to-transparent" />
          <div className="relative space-y-10">
            <header className="border-b border-white/10 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Order history
              </p>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h1 className="text-4xl font-semibold text-white">
                    Hi {user?.name || "there"}, here is your delivery timeline.
                  </h1>
                  <p className="mt-2 text-sm text-white/70">
                    Track every brief, milestone, and delivery from a single
                    view. We will notify you instantly when a step needs your
                    input.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white"
                >
                  ← Back to profile overview
                </Link>
              </div>
            </header>

            <div className="grid gap-6 rounded-4xl border border-white/10 bg-white/5 p-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  Customer workspace
                </p>
                <h2 className="text-3xl font-semibold text-white">
                  Production for {user?.company || user?.name || "your brief"}
                </h2>
                <p className="text-sm text-white/70">
                  View milestones, due dates, approvals, and delivery notes in a
                  single canvas. Your account manager keeps this workspace
                  updated in real-time.
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  <span className="rounded-full border border-white/15 px-4 py-1">
                    {summary.active} active orders
                  </span>
                  <span className="rounded-full border border-white/15 px-4 py-1">
                    {summary.completed} delivered
                  </span>
                  <span className="rounded-full border border-white/15 px-4 py-1">
                    {summary.total} total briefed
                  </span>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-slate-950/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  Account support
                </p>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <p>
                    Dedicated AM:{" "}
                    <span className="font-semibold text-white">
                      CCW Support
                    </span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="font-semibold text-white">
                      support@ccw.com
                    </span>
                  </p>
                  <p>
                    Hotline:{" "}
                    <span className="font-semibold text-white">
                      +91 6202377489
                    </span>
                  </p>
                </div>
                <Link
                  to="/profile/support"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white"
                >
                  Open a new request →
                </Link>
              </div>
            </div>

            <dl className="grid gap-4 rounded-4xl border border-white/10 bg-white/5 p-4 text-white/80 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Total orders
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-white">
                  {summary.total}
                </dd>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Active
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-emerald-300">
                  {summary.active}
                </dd>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Completed
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-white">
                  {summary.completed}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-4 rounded-4xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setStatusFilter(option.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      statusFilter === option.key
                        ? "bg-white text-slate-900"
                        : "border border-white/20 text-white/70 hover:border-white/40"
                    }`}
                    aria-pressed={statusFilter === option.key}
                  >
                    <span>{option.label}</span>
                    <span className="rounded-full bg-white/10 px-2 text-[10px] uppercase tracking-[0.25em]">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-xs text-white/70 sm:flex-row sm:items-center">
                <div className="inline-flex rounded-full border border-white/20 p-1 text-[11px] font-semibold uppercase tracking-[0.3em]">
                  <button
                    type="button"
                    onClick={() => setSortOrder("recent")}
                    className={`rounded-full px-4 py-1 ${
                      sortOrder === "recent"
                        ? "bg-white text-slate-900"
                        : "text-white/70"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder("oldest")}
                    className={`rounded-full px-4 py-1 ${
                      sortOrder === "oldest"
                        ? "bg-white text-slate-900"
                        : "text-white/70"
                    }`}
                  >
                    Oldest
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-white/60 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  {loading ? "Refreshing" : "Refresh timeline"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 rounded-4xl border border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-teal-900/40 p-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
                  Latest activity
                </p>
                {spotlightOrder ? (
                  <div className="mt-3 space-y-1 text-sm text-white/80">
                    <p className="text-2xl font-semibold text-white">
                      #{spotlightOrder.id?.slice(0, 8) || "ORDER"} ·{" "}
                      {spotlightOrder.status}
                    </p>
                    <p>
                      Updated{" "}
                      {formatDate(
                        spotlightOrder.updatedAt || spotlightOrder.createdAt
                      )}{" "}
                      · {spotlightOrder.projectName || "Custom order"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {spotlightOrder.channel || "Channel TBD"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">
                    Once you place an order, the most recent activity will
                    appear here with live status.
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
                  Upcoming delivery
                </p>
                {nextDueOrder ? (
                  <div className="mt-3 space-y-2 text-sm text-white/80">
                    <p className="text-2xl font-semibold text-white">
                      Target {formatDate(nextDueOrder.dueDate)}
                    </p>
                    <p>
                      We will share hand-off details for{" "}
                      {nextDueOrder.projectName || "your project"} on the target
                      date above.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">
                    Set a due date while booking a service to keep this tracker
                    meaningful.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 rounded-4xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-900/10 md:p-8">
          {renderOrders()}
        </Reveal>
      </div>
    </main>
  );
};

export default OrderHistory;
