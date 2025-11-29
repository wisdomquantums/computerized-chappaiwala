import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Reveal from "../../../components/ui/Reveal";
import Loader from "../../../components/ui/Loader";
import {
  fetchCustomerTickets,
  createSupportTicket,
} from "../../../features/tickets/customerTicketsSlice";
import { fetchCustomerOrders } from "../../../features/orders/customerOrdersSlice";
import {
  TICKET_CATEGORY_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  ticketStatusTone,
} from "../../../features/tickets/ticketUtils";
import { useToast } from "../../../contexts/ToastContext";

const formatDateTime = (value) => {
  if (!value) return "Not logged";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not logged";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const statusToneToClass = {
  open: "bg-amber-50 text-amber-700",
  progress: "bg-cyan-50 text-cyan-700",
  waiting: "bg-indigo-50 text-indigo-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

const SupportTickets = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const ticketState = useSelector((state) => state.customerTickets);
  const ordersState = useSelector((state) => state.customerOrders);

  const initialOrderIdFromQuery = searchParams.get("orderId") || "";

  const [form, setForm] = useState({
    orderId: initialOrderIdFromQuery,
    subject: "",
    category: TICKET_CATEGORY_OPTIONS[0],
    priority: TICKET_PRIORITY_OPTIONS[1],
    description: "",
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!ticketState.initialized && !ticketState.loading) {
      dispatch(fetchCustomerTickets());
    }
  }, [dispatch, ticketState.initialized, ticketState.loading]);

  useEffect(() => {
    if (!ordersState.initialized && !ordersState.loading) {
      dispatch(fetchCustomerOrders());
    }
  }, [dispatch, ordersState.initialized, ordersState.loading]);

  const orderOptions = useMemo(() => {
    return ordersState.list.map((order) => ({
      id: order.id,
      label: `${order.projectName || "Custom brief"} · ${order.status}`,
    }));
  }, [ordersState.list]);

  const stats = useMemo(() => {
    const total = ticketState.list.length;
    const resolved = ticketState.list.filter((ticket) =>
      ["Resolved", "Closed"].includes(ticket.status)
    ).length;
    const open = total - resolved;
    return { total, resolved, open };
  }, [ticketState.list]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    const payload = {
      ...form,
      orderId: form.orderId || undefined,
    };
    try {
      await dispatch(createSupportTicket(payload)).unwrap();
      setForm({
        orderId: payload.orderId || "",
        subject: "",
        category: TICKET_CATEGORY_OPTIONS[0],
        priority: TICKET_PRIORITY_OPTIONS[1],
        description: "",
      });
      showToast({
        type: "success",
        message: "Ticket logged. Our support desk will contact you soon.",
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  const renderTickets = () => {
    if (ticketState.loading && !ticketState.initialized) {
      return (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      );
    }

    if (ticketState.error) {
      return (
        <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-6 text-sm font-semibold text-rose-600">
          {ticketState.error}
        </div>
      );
    }

    if (!ticketState.list.length) {
      return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-center text-slate-500">
          <p className="text-base font-semibold text-slate-900">
            No tickets yet
          </p>
          <p className="mt-2 text-sm">
            Raise your first ticket from the form above to start a conversation
            with our support desk.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ticketState.list.map((ticket) => {
          const tone =
            statusToneToClass[ticketStatusTone(ticket.status)] ||
            statusToneToClass.open;
          return (
            <article
              key={ticket.id}
              className="rounded-4xl border border-slate-100 bg-white/95 p-6 shadow"
            >
              <header className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
                    Ticket
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Logged {formatDateTime(ticket.createdAt)} · Updated{" "}
                    {formatDateTime(ticket.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className={`rounded-full px-4 py-1 ${tone}`}>
                    {ticket.status}
                  </span>
                  <span className="rounded-full bg-slate-900/5 px-4 py-1 text-slate-700">
                    {ticket.priority} priority
                  </span>
                </div>
              </header>

              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <p>{ticket.description}</p>
                <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {ticket.category}
                  </span>
                  {ticket.order?.projectName && (
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {ticket.order.projectName}
                    </span>
                  )}
                  {ticket.resolutionNotes && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                      {ticket.resolutionNotes}
                    </span>
                  )}
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

      <div className="relative mx-auto max-w-5xl px-6 pt-20">
        <Reveal
          as="section"
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl md:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-400/10 to-transparent" />
          <div className="relative space-y-8">
            <header className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Support desk
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Hi {user?.name || "there"}, tell us what needs attention.
              </h1>
              <p className="text-sm text-white/70">
                Every ticket goes straight to the Sitamarhi production desk.
                Reference an order for faster context and attach notes to help
                us debug quickly.
              </p>
            </header>

            <dl className="grid gap-4 text-sm text-white/80 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Open tickets
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-white">
                  {stats.open}
                </dd>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Resolved
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-emerald-300">
                  {stats.resolved}
                </dd>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Total raised
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-white">
                  {stats.total}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal className="mt-10 rounded-4xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-900/10 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                  Raise a ticket
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Summarize the issue
                </h2>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Linked order (optional)
                    </label>
                    <select
                      name="orderId"
                      value={form.orderId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      <option value="">Select an order</option>
                      {orderOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        {TICKET_CATEGORY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        {TICKET_PRIORITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder="Example: Need revised copy for brochure"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Describe the issue
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      rows={5}
                      placeholder="Share timelines, reference assets, or URLs that can speed up troubleshooting."
                      required
                    />
                  </div>

                  {formError && (
                    <p className="text-sm font-semibold text-rose-500">
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={ticketState.creating}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {ticketState.creating ? "Submitting" : "Submit ticket"}
                    </button>
                    <p className="text-xs text-slate-500">
                      You will receive email + WhatsApp updates for every status
                      change.
                    </p>
                  </div>
                </form>
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                  Ticket history
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Track each ticket below. The status updates live as soon as
                  our pod acknowledges or resolves the item.
                </p>
              </div>
              {renderTickets()}
            </section>
          </div>
        </Reveal>
      </div>
    </main>
  );
};

export default SupportTickets;
