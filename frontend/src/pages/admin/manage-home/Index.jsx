import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import { useManageHome } from "./IndexUse";
import Add from "./Add";
import Edit from "./Edit";
import "../rolepermission/role/RolePermission.css";
import "./ManageHome.css";

const ManageHome = () => {
  const {
    tabs,
    activeSection,
    setActiveSection,
    currentConfig,
    items,
    loading,
    error,
    statusMessage,
    modalOpen,
    modalMode,
    form,
    formError,
    submitting,
    deletingId,
    actions,
  } = useManageHome();

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const columns = currentConfig?.tableColumns || [];

  const renderCellValue = (column, entry) => {
    const value = entry[column.key];
    if (column.type === "image") {
      return value ? (
        <img
          src={value}
          alt={entry.title || column.label}
          className="h-14 w-14 rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-xs text-slate-400">No image</span>
      );
    }
    if (column.truncate) {
      return <p className="max-w-sm text-sm text-slate-600">{value || "—"}</p>;
    }
    return value || "—";
  };

  const renderTable = () => {
    if (loading) {
      return <Loader />;
    }
    return (
      <div className="rolepermission-table-wrapper">
        <table className="rolepermission-table">
          <thead>
            <tr>
              <th>#</th>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Sort order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!items.length ? (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="rolepermission-empty"
                >
                  {currentConfig?.empty || "No entries yet."}
                </td>
              </tr>
            ) : (
              items.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  {columns.map((column) => (
                    <td key={`${entry.id}-${column.key}`}>
                      {renderCellValue(column, entry)}
                    </td>
                  ))}
                  <td>{entry.sortOrder ?? 0}</td>
                  <td>
                    <div className="rolepermission-actions rolepermission-table-actions">
                      <button
                        type="button"
                        className="rolepermission-btn ghost"
                        onClick={() => actions.handleEditEntry(entry)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rolepermission-btn ghost danger"
                        onClick={() => actions.handleDeleteEntry(entry)}
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const modalContent =
    modalOpen &&
    (modalMode === "edit" ? (
      <Edit
        sectionConfig={currentConfig}
        form={form}
        formError={formError}
        submitting={submitting}
        onClose={actions.closeModal}
        onSubmit={actions.handleSubmit}
        onChange={actions.handleFieldChange}
      />
    ) : (
      <Add
        sectionConfig={currentConfig}
        form={form}
        formError={formError}
        submitting={submitting}
        onClose={actions.closeModal}
        onSubmit={actions.handleSubmit}
        onChange={actions.handleFieldChange}
      />
    ));

  return (
    <div className="rolepermission-page manage-home-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Homepage master</p>
            <h1>Manage Home Content</h1>
            <p className="rolepermission-section-subtitle">
              {currentConfig?.description ||
                "Switch between sections to edit hero slides, stats, services, and contact tiles."}
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={actions.refresh}
            >
              Refresh
            </button>
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={actions.openAddModal}
            >
              Add entry
            </button>
          </div>
        </div>

        <div className="manage-home-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={[
                "manage-home-tab",
                activeSection === tab.key ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActiveSection(tab.key)}
            >
              <span className="manage-home-tab-label">{tab.label}</span>
              <span className="manage-home-tab-meta">{tab.meta}</span>
            </button>
          ))}
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Unable to load entries. {error}
          </div>
        )}

        {renderTable()}
      </section>

      {modalRoot &&
        modalContent &&
        ReactDOM.createPortal(modalContent, modalRoot)}
    </div>
  );
};

export default ManageHome;
