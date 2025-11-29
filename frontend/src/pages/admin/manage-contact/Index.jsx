import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import Add from "./Add";
import Edit from "./Edit";
import {
  useManageContactCards,
  useContactPageCopy,
  headerFieldConfig,
  headerFieldKeys,
  detailFieldGroups,
  detailFieldKeys,
} from "./IndexUse";
import "../rolepermission/role/RolePermission.css";

const ContactCardsPage = () => {
  const {
    cards,
    cardsLoading,
    cardsError,
    form,
    lineFields,
    panelOpen,
    panelMode,
    submitting,
    formError,
    openAddPanel,
    closePanel,
    handleChange,
    handleLineChange,
    handleAddLineField,
    handleRemoveLineField,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useManageContactCards();

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const modalContent =
    panelOpen &&
    (panelMode === "edit" ? (
      <Edit
        form={form}
        lineFields={lineFields}
        formError={formError}
        submitting={submitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onLineChange={handleLineChange}
        onAddLineField={handleAddLineField}
        onRemoveLineField={handleRemoveLineField}
      />
    ) : (
      <Add
        form={form}
        lineFields={lineFields}
        formError={formError}
        submitting={submitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onLineChange={handleLineChange}
        onAddLineField={handleAddLineField}
        onRemoveLineField={handleRemoveLineField}
      />
    ));

  const renderActionCell = (card) => {
    if (!card.actionLabel || !card.actionHref) {
      return <span className="text-xs text-slate-400">No action</span>;
    }
    return (
      <div className="rolepermission-role-name">
        <span className="rolepermission-role-label">{card.actionLabel}</span>
        <small>{card.actionHref}</small>
      </div>
    );
  };

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Contact page</p>
            <h1>Contact cards</h1>
            <p className="rolepermission-section-subtitle">
              Manage every tile that appears on the /contact page including
              phone numbers, WhatsApp links, and studio address.
            </p>
            <small>{`${cards.length} cards live`}</small>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={openAddPanel}
            >
              Add card
            </button>
          </div>
        </div>

        {cardsError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Unable to load contact cards. {cardsError}
          </div>
        )}

        {cardsLoading ? (
          <Loader />
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Icon</th>
                  <th>Lines</th>
                  <th>Action</th>
                  <th>Sort order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!cards.length ? (
                  <tr>
                    <td colSpan={7} className="rolepermission-empty">
                      No contact cards configured yet.
                    </td>
                  </tr>
                ) : (
                  cards.map((card, index) => (
                    <tr key={card.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="rolepermission-role-name">
                          <span className="rolepermission-role-label">
                            {card.title}
                          </span>
                          <small>{card.eyebrow || "Contact"}</small>
                        </div>
                      </td>
                      <td>
                        <span className="rolepermission-status neutral">
                          {card.iconKey}
                        </span>
                      </td>
                      <td>
                        <ul className="text-sm text-slate-600">
                          {(card.lines || []).map((line, lineIndex) => (
                            <li key={`${card.id}-${lineIndex}`}>{line}</li>
                          ))}
                        </ul>
                      </td>
                      <td>{renderActionCell(card)}</td>
                      <td>{card.sortOrder ?? 0}</td>
                      <td>
                        <div className="rolepermission-actions rolepermission-table-actions">
                          <button
                            type="button"
                            className="rolepermission-btn ghost"
                            onClick={() => handleEdit(card)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rolepermission-btn ghost danger"
                            onClick={() => handleDelete(card)}
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

      {modalRoot &&
        modalContent &&
        ReactDOM.createPortal(modalContent, modalRoot)}
    </div>
  );
};

const ContactHeaderPage = () => {
  const {
    form,
    pageLoading,
    pageError,
    status,
    submitting,
    handleFieldChange,
    handleResetForm,
    handleSaveFields,
  } = useContactPageCopy();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveFields(headerFieldKeys);
  };

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Contact hero</p>
            <h2>Header copy</h2>
            <p className="rolepermission-section-subtitle">
              Update the hero eyebrow, headline, and supporting description
              visible at the top of the /contact page.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={handleResetForm}
            >
              Reset changes
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {status}
          </div>
        )}

        {pageError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Could not fetch contact copy. {pageError}
          </div>
        )}

        {pageLoading && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Refreshing live copy…
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {headerFieldConfig.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleFieldChange}
                  placeholder={field.placeholder}
                  rows={4}
                  className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              ) : (
                <input
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleFieldChange}
                  placeholder={field.placeholder}
                  className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="submit"
              className="rolepermission-btn primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save header copy"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const ContactDetailsPage = () => {
  const {
    form,
    pageLoading,
    pageError,
    status,
    submitting,
    handleFieldChange,
    handleResetForm,
    handleSaveFields,
  } = useContactPageCopy();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveFields(detailFieldKeys);
  };

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Contact page</p>
            <h2>Visit, hours & CTA</h2>
            <p className="rolepermission-section-subtitle">
              Control the map embed, message block copy, WhatsApp CTA, opening
              hours, and the closing banner.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={handleResetForm}
            >
              Reset changes
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {status}
          </div>
        )}

        {pageError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Could not fetch contact copy. {pageError}
          </div>
        )}

        {pageLoading && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Refreshing live copy…
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {detailFieldGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-100 p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {group.title}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {group.fields.map((field) => {
                  const isWide = field.fullWidth || field.type === "textarea";
                  const fieldClasses = ["flex", "flex-col"];
                  if (isWide) fieldClasses.push("md:col-span-2");

                  return (
                    <div key={field.name} className={fieldClasses.join(" ")}>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          value={form[field.name] || ""}
                          onChange={handleFieldChange}
                          placeholder={field.placeholder}
                          rows={field.name === "mapEmbedUrl" ? 5 : 4}
                          className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        />
                      ) : (
                        <input
                          name={field.name}
                          value={form[field.name] || ""}
                          onChange={handleFieldChange}
                          placeholder={field.placeholder}
                          className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="submit"
              className="rolepermission-btn primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save contact details"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export { ContactHeaderPage, ContactDetailsPage };
export default ContactCardsPage;
