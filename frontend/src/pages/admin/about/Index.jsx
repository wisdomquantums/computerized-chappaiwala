import React from "react";
import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import Add from "./Add";
import Edit from "./Edit";

const AboutItemsIndex = ({
  metaLabel,
  title,
  description,
  addButtonLabel,
  emptyMessage,
  loading,
  items = [],
  columns = [],
  onAdd,
  onEdit,
  onDelete,
  modalState,
  modalMeta,
}) => {
  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const modalContent =
    modalState?.panelOpen && modalMeta?.fields?.length ? (
      modalState.panelMode === "edit" ? (
        <Edit
          title={modalMeta.editMeta?.title}
          subtitle={modalMeta.editMeta?.subtitle}
          submitLabel={modalMeta.editMeta?.submitLabel}
          fields={modalMeta.fields}
          {...modalState}
        />
      ) : (
        <Add
          title={modalMeta.addMeta?.title}
          subtitle={modalMeta.addMeta?.subtitle}
          submitLabel={modalMeta.addMeta?.submitLabel}
          fields={modalMeta.fields}
          {...modalState}
        />
      )
    ) : null;

  return (
    <section className="rolepermission-card rolepermission-table-card">
      <div className="rolepermission-head">
        <div>
          <p className="rolepermission-role-meta">{metaLabel}</p>
          <h2>{title}</h2>
          {description && (
            <p className="rolepermission-section-subtitle">{description}</p>
          )}
        </div>
        <div className="rolepermission-head-controls">
          <button
            type="button"
            className="rolepermission-btn primary"
            onClick={onAdd}
          >
            {addButtonLabel}
          </button>
        </div>
      </div>

      <div className="rolepermission-table-wrapper">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="rolepermission-empty">{emptyMessage}</div>
        ) : (
          <table className="rolepermission-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key || column.header}>{column.header}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column) => (
                    <td key={column.key || column.header}>
                      {column.render
                        ? column.render(item, index)
                        : column.accessor
                        ? item[column.accessor] ?? "--"
                        : "--"}
                    </td>
                  ))}
                  <td>
                    <div className="rolepermission-actions rolepermission-table-actions">
                      <button
                        type="button"
                        className="rolepermission-btn ghost"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rolepermission-btn ghost danger"
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalRoot &&
        modalContent &&
        ReactDOM.createPortal(modalContent, modalRoot)}
    </section>
  );
};

export default AboutItemsIndex;
