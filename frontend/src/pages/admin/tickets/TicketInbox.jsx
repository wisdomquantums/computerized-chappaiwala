import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader";
import {
  fetchAdminTickets,
  createAdminTicket,
  updateAdminTicket,
  deleteAdminTicket,
} from "../../../features/tickets/adminTicketsSlice";
import {
  TICKET_CATEGORY_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_OPTIONS,
} from "../../../features/tickets/ticketUtils";
import "../rolepermission/role/RolePermission.css";
import "../inquiries/InquiryInbox.css";
import "./TicketInbox.css";

const formatDateTime = (value) => {
  if (!value) return "Not logged";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not logged";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const TicketInbox = () => {
  const dispatch = useDispatch();
  const { list, loading, error, saving, deletingId } = useSelector(
    (state) => state.adminTickets
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: TICKET_CATEGORY_OPTIONS[0],
    priority: TICKET_PRIORITY_OPTIONS[1],
    orderId: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    dispatch(fetchAdminTickets());
  }, [dispatch]);

  const grouped = useMemo(() => list || [], [list]);

  const toggleComposer = () => setComposerOpen((prev) => !prev);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError(null);
    try {
      await dispatch(createAdminTicket(form)).unwrap();
      setForm({
        subject: "",
        description: "",
        category: TICKET_CATEGORY_OPTIONS[0],
        priority: TICKET_PRIORITY_OPTIONS[1],
        orderId: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
      });
      setComposerOpen(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleStatusUpdate = (ticketId, status) => {
    dispatch(updateAdminTicket({ id: ticketId, updates: { status } }));
  };

  const handlePriorityUpdate = (ticketId, priority) => {
    dispatch(updateAdminTicket({ id: ticketId, updates: { priority } }));
  };

  const handleDelete = (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    dispatch(deleteAdminTicket(ticketId));
  };

  return (
    <div className="rolepermission-page">
      <div className="rolepermission-card rolepermission-table-card inquiry-card">
        <div className="rolepermission-head">
          <div>
            <h1>Support Tickets</h1>
            <p>Track escalations raised from customer profiles.</p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              onClick={() => dispatch(fetchAdminTickets())}
              className="rolepermission-btn ghost"
              disabled={loading}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={toggleComposer}
              className="rolepermission-btn primary"
            >
              {composerOpen ? "Close composer" : "Log ticket"}
            </button>
          </div>
        </div>

        {composerOpen && (
          <div className="rolepermission-form rolepermission-form--inline">
            <form onSubmit={handleCreate} className="ticket-composer">
              <div className="ticket-composer-grid">
                <label>
                  <span>Subject</span>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  <span>Category</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    {TICKET_CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Priority</span>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  >
                    {TICKET_PRIORITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Order ID (optional)</span>
                  <input
                    type="text"
                    name="orderId"
                    value={form.orderId}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  <span>Contact name</span>
                  <input
                    type="text"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  <span>Contact email</span>
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  <span>Contact phone</span>
                  <input
                    type="text"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleFormChange}
                  />
                </label>
              </div>
              <label>
                <span>Description</span>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />
              </label>
              {formError && <p className="rolepermission-error">{formError}</p>}
              <div className="rolepermission-form-actions">
                <button
                  type="submit"
                  className="rolepermission-btn primary"
                  disabled={saving}
                >
                  {saving ? "Saving" : "Create ticket"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="rolepermission-table-loading">
            <Loader />
          </div>
        ) : error ? (
          <div className="rolepermission-empty">{error}</div>
        ) : !grouped.length ? (
          <div className="rolepermission-empty">
            No tickets logged yet. Customers can raise tickets from their order
            history page.
          </div>
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table inquiry-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Subject</th>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map((ticket) => (
                  <tr key={ticket.id} className="rolepermission-row">
                    <td>
                      <div className="inquiry-meta">
                        <span>{formatDateTime(ticket.createdAt)}</span>
                        <small>
                          Updated {formatDateTime(ticket.updatedAt)}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="rolepermission-role-name">
                        <span className="rolepermission-role-label">
                          {ticket.subject}
                        </span>
                        <small>{ticket.category}</small>
                      </div>
                    </td>
                    <td>
                      <div className="inquiry-contact">
                        <strong>{ticket.contactName || "Unknown"}</strong>
                        <span>{ticket.contactEmail || "No email"}</span>
                        {ticket.contactPhone && (
                          <span>{ticket.contactPhone}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {ticket.order?.projectName ? (
                        <span className="inquiry-service-pill">
                          {ticket.order.projectName}
                        </span>
                      ) : (
                        <span className="inquiry-meta-tag">Unlinked</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={ticket.status}
                        onChange={(event) =>
                          handleStatusUpdate(ticket.id, event.target.value)
                        }
                      >
                        {TICKET_STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={ticket.priority}
                        onChange={(event) =>
                          handlePriorityUpdate(ticket.id, event.target.value)
                        }
                      >
                        {TICKET_PRIORITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="rolepermission-btn ghost"
                        onClick={() => handleDelete(ticket.id)}
                        disabled={deletingId === ticket.id}
                      >
                        {deletingId === ticket.id ? "Deleting" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketInbox;
