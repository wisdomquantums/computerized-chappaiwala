import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import "../rolepermission/role/RolePermission.css";
import "./ManageOrders.css";
import { useManageOrders } from "./IndexUse";
import Add from "./add/Add";
import Edit from "./edit/Edit";

const Index = () => {
  const {
    list,
    loading,
    error,
    panelOpen,
    panelMode,
    form,
    formError,
    submitting,
    filters,
    stats,
    openAddPanel,
    openEditPanel,
    closePanel,
    handleChange,
    handleTagChange,
    handleSubmit,
    handleStatusChange,
    handleDelete,
    handleFilterChange,
    resetFilters,
  } = useManageOrders();

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const hasFilters = Boolean(
    filters.status || filters.priority || filters.channel
  );

  const modalContent =
    panelOpen &&
    (panelMode === "edit" ? (
      <Edit
        form={form}
        formError={formError}
        submitting={submitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onTagChange={handleTagChange}
      />
    ) : (
      <Add
        form={form}
        formError={formError}
        submitting={submitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onTagChange={handleTagChange}
      />
    ));

  const renderEmpty = () => (
    <div className="rolepermission-empty">
      <p>
        {hasFilters
          ? "No orders match the selected filters."
          : "No orders yet. Customer orders will show up here as soon as they book."}
      </p>
      {!hasFilters && (
        <button
          type="button"
          className="mt-4 rolepermission-btn primary"
          onClick={openAddPanel}
        >
          Log manual order
        </button>
      )}
    </div>
  );

  const renderStatusSelect = (order) => (
    <select
      className="rolepermission-input"
      value={order.status}
      onChange={(event) => handleStatusChange(order.id, event.target.value)}
    >
      {stats.statusOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Orders management</p>
            <h1>Order operations</h1>
            <p className="rolepermission-section-subtitle">
              Monitor inflow, prioritize production, and keep every client
              informed from here.
            </p>
            <small>{`${stats.totalCount} total orders • ${stats.activeCount} active`}</small>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={resetFilters}
            >
              Clear filters
            </button>
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={openAddPanel}
            >
              Add order
            </button>
          </div>
        </div>

        <div className="rolepermission-filter-bar">
          <div>
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(event) =>
                handleFilterChange("status", event.target.value)
              }
            >
              <option value="">All</option>
              {stats.statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(event) =>
                handleFilterChange("priority", event.target.value)
              }
            >
              <option value="">All</option>
              {stats.priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Channel</label>
            <select
              value={filters.channel}
              onChange={(event) =>
                handleFilterChange("channel", event.target.value)
              }
            >
              <option value="">All</option>
              {stats.channelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rolepermission-empty">
            <p>Unable to load orders. {error}</p>
          </div>
        ) : list.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Channel</th>
                  <th>Budget</th>
                  <th>Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order, index) => {
                  const priorityLabel = order.priority || "Medium";
                  return (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="rolepermission-role-name">
                          <span className="rolepermission-role-label">
                            {order.clientName || order.customer?.name || "--"}
                          </span>
                          <small>
                            {order.clientEmail ||
                              order.customer?.email ||
                              "No email"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="rolepermission-role-name">
                          <span className="rolepermission-role-label">
                            {order.projectName || "--"}
                          </span>
                          <small>{order.serviceLine || "Unassigned"}</small>
                        </div>
                      </td>
                      <td>{renderStatusSelect(order)}</td>
                      <td>
                        <span
                          className={`order-priority-pill priority-${priorityLabel.toLowerCase()}`}
                        >
                          {priorityLabel}
                        </span>
                      </td>
                      <td>{order.channel || "--"}</td>
                      <td>
                        {order.budget
                          ? `₹${Number(order.budget).toLocaleString("en-IN")}`
                          : "--"}
                      </td>
                      <td>{order.dueDate || "--"}</td>
                      <td>
                        <div className="rolepermission-actions rolepermission-table-actions">
                          <button
                            type="button"
                            className="rolepermission-btn ghost"
                            onClick={() => openEditPanel(order)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rolepermission-btn ghost danger"
                            onClick={() => handleDelete(order.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalRoot && ReactDOM.createPortal(modalContent, modalRoot)}
    </div>
  );
};

export default Index;
