import { useMemo, useState } from "react";
import Loader from "../../../../components/ui/Loader.jsx";

const noop = () => {};

const PersonaPermissionTable = ({
  title,
  subtitle,
  rows = [],
  loading = false,
  onAddClick = noop,
  onEdit = noop,
  onDelete = noop,
  addLabel = "Add permission",
  searchPlaceholder = "Search permission by name or key",
  emptyLabel = "No permissions added yet. Use the add button to map access.",
}) => {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const needle = query.trim().toLowerCase();
    return rows.filter((row) =>
      [row.label, row.key, row.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(needle))
    );
  }, [rows, query]);

  return (
    <section className="rolepermission-card rolepermission-table-card">
      <div className="rolepermission-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="rolepermission-head-controls">
          <div className="rolepermission-search">
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="rolepermission-btn primary"
            onClick={onAddClick}
          >
            {addLabel}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rolepermission-table-loading">
          <Loader />
        </div>
      ) : (
        <div className="rolepermission-table-wrapper">
          <table className="rolepermission-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Permission</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="rolepermission-empty">
                    {rows.length === 0
                      ? emptyLabel
                      : "No permissions match your search."}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => (
                  <tr key={row.key}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="rolepermission-role-name">
                        <span className="rolepermission-role-label">
                          {row.label || row.key}
                        </span>
                        <small>{row.key}</small>
                      </div>
                    </td>
                    <td>{row.description || "—"}</td>
                    <td>
                      <span
                        className={`rolepermission-status ${
                          row.status || "active"
                        }`}
                      >
                        {row.statusLabel || row.status || "active"}
                      </span>
                    </td>
                    <td>
                      <div className="rolepermission-actions rolepermission-table-actions">
                        <button
                          type="button"
                          className="rolepermission-btn ghost"
                          onClick={() => onEdit(row.key)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rolepermission-btn ghost danger"
                          onClick={() => onDelete(row.key)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default PersonaPermissionTable;
