import { useMemo, useState } from "react";
import Loader from "../../../components/ui/Loader";
import "../rolepermission/role/RolePermission.css";
import "./ManageOrders.css";
import { useManageOrders } from "./IndexUse";

const AssignOrders = () => {
  const {
    list,
    loading,
    error,
    stats,
    filters,
    formError,
    handleFilterChange,
    resetFilters,
    handleAssignmentUpdate,
  } = useManageOrders();

  const [assignmentDrafts, setAssignmentDrafts] = useState({});
  const [savingMap, setSavingMap] = useState({});
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(true);

  const visibleOrders = useMemo(() => {
    if (!showUnassignedOnly) return list;
    return list.filter((order) => !order.assignedTo);
  }, [list, showUnassignedOnly]);

  const getDraftValue = (order) =>
    assignmentDrafts[order.id] ?? order.assignedTo ?? "";

  const handleDraftChange = (orderId, value) => {
    setAssignmentDrafts((prev) => ({ ...prev, [orderId]: value }));
  };

  const persistAssignment = async (order) => {
    if (!order?.id) return;
    const assignee = getDraftValue(order);
    setSavingMap((prev) => ({ ...prev, [order.id]: true }));
    const success = await handleAssignmentUpdate(order, assignee);
    setSavingMap((prev) => ({ ...prev, [order.id]: false }));
    if (success) {
      setAssignmentDrafts((prev) => {
        const next = { ...prev };
        delete next[order.id];
        return next;
      });
    }
  };

  const renderEmpty = () => (
    <div className="rolepermission-empty">
      <p>
        {showUnassignedOnly
          ? "All orders have owners right now."
          : "No orders match the current filters."}
      </p>
    </div>
  );

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Assign orders</p>
            <h1>Work allocation</h1>
            <p className="rolepermission-section-subtitle">
              Route every incoming job to an accountable owner so production
              keeps moving.
            </p>
            <small>{`${visibleOrders.length} shown • ${stats.totalCount} total`}</small>
          </div>
          <div className="rolepermission-head-controls">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={showUnassignedOnly}
                onChange={(event) =>
                  setShowUnassignedOnly(event.target.checked)
                }
              />
              Show only unassigned
            </label>
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={resetFilters}
            >
              Clear filters
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

        {formError && (
          <p className="text-sm font-semibold text-rose-500">{formError}</p>
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rolepermission-empty">
            <p>Unable to load orders. {error}</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Assigned to</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order, index) => (
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
                        <small>{order.serviceLine || "Unspecified"}</small>
                      </div>
                    </td>
                    <td>
                      <input
                        className="rolepermission-input"
                        value={getDraftValue(order)}
                        onChange={(event) =>
                          handleDraftChange(order.id, event.target.value)
                        }
                        placeholder="Assign owner"
                      />
                    </td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        type="button"
                        className="rolepermission-btn primary"
                        onClick={() => persistAssignment(order)}
                        disabled={Boolean(savingMap[order.id])}
                      >
                        {savingMap[order.id] ? "Saving..." : "Save assignment"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AssignOrders;
