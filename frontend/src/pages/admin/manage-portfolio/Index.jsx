import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import Add from "./Add";
import Edit from "./Edit";
import {
  useManagePortfolio,
  LIST_TYPES,
  listSectionCopy,
  pageFieldConfig,
} from "./IndexUse";
import "../rolepermission/role/RolePermission.css";
import "./ManagePortfolio.css";

const ProjectsPage = () => {
  const {
    list,
    loading,
    error,
    projectForm,
    projectModalOpen,
    projectModalMode,
    projectSubmitting,
    projectFormError,
    projectStatus,
    openAddPanel,
    handleEditProject,
    closeProjectModal,
    handleProjectFieldChange,
    handleGalleryChange,
    handleAddGalleryField,
    handleRemoveGalleryField,
    handleProjectSubmit,
    handleDeleteProject,
  } = useManagePortfolio();

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const renderProjectTable = () => {
    if (loading) {
      return <Loader />;
    }

    return (
      <div className="rolepermission-table-wrapper">
        <table className="rolepermission-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Project</th>
              <th>Category</th>
              <th>Description</th>
              <th>Gallery</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!list?.length ? (
              <tr>
                <td colSpan={6} className="rolepermission-empty">
                  No portfolio projects saved yet.
                </td>
              </tr>
            ) : (
              list.map((project, index) => (
                <tr key={project.id || `project-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-14 w-14 rounded-xl object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="rolepermission-role-name">
                        <span className="rolepermission-role-label">
                          {project.title || "Untitled project"}
                        </span>
                        <small>ID: {project.id || "draft"}</small>
                      </div>
                    </div>
                  </td>
                  <td>{project.category || "--"}</td>
                  <td>
                    <p className="max-w-sm text-sm text-slate-600">
                      {project.description || "--"}
                    </p>
                  </td>
                  <td>
                    <div className="rolepermission-role-name">
                      <span className="rolepermission-role-label">
                        {project.gallery?.length || 0} gallery
                      </span>
                      <small>
                        {project.image ? "Cover image set" : "No cover image"}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="rolepermission-actions rolepermission-table-actions">
                      <button
                        type="button"
                        className="rolepermission-btn ghost"
                        onClick={() => handleEditProject(project)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rolepermission-btn ghost danger"
                        onClick={() => handleDeleteProject(project)}
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
    );
  };

  const modalContent =
    projectModalOpen &&
    (projectModalMode === "edit" ? (
      <Edit
        form={projectForm}
        galleryFields={projectForm.gallery}
        formError={projectFormError}
        submitting={projectSubmitting}
        onClose={closeProjectModal}
        onSubmit={handleProjectSubmit}
        onChange={handleProjectFieldChange}
        onGalleryChange={handleGalleryChange}
        onAddGalleryField={handleAddGalleryField}
        onRemoveGalleryField={handleRemoveGalleryField}
      />
    ) : (
      <Add
        form={projectForm}
        galleryFields={projectForm.gallery}
        formError={projectFormError}
        submitting={projectSubmitting}
        onClose={closeProjectModal}
        onSubmit={handleProjectSubmit}
        onChange={handleProjectFieldChange}
        onGalleryChange={handleGalleryChange}
        onAddGalleryField={handleAddGalleryField}
        onRemoveGalleryField={handleRemoveGalleryField}
      />
    ));

  return (
    <div className="rolepermission-page manage-portfolio-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Portfolio management</p>
            <h1>Project gallery</h1>
            <p className="rolepermission-section-subtitle">
              Curate every portfolio tile that the public page displays. Upload
              cover images, gallery URLs, and quick descriptions.
            </p>
            <small>{`${list?.length || 0} projects live`}</small>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={openAddPanel}
            >
              Add project
            </button>
          </div>
        </div>

        {projectStatus && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {projectStatus}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Unable to load projects. {error}
          </div>
        )}

        {renderProjectTable()}
      </section>

      {modalRoot &&
        modalContent &&
        ReactDOM.createPortal(modalContent, modalRoot)}
    </div>
  );
};

const PageCopyPage = () => {
  const {
    pageForm,
    pageSubmitting,
    pageStatus,
    pageLoading,
    pageError,
    handlePageFieldChange,
    handleResetPageForm,
    handleSavePageForm,
  } = useManagePortfolio();

  return (
    <div className="rolepermission-page manage-portfolio-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Portfolio hero</p>
            <h2>Page copy & CTA links</h2>
            <p className="rolepermission-section-subtitle">
              Update the hero text, trust section copy, idea intro, and CTA
              labels that appear on the public /portfolio page.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={handleResetPageForm}
            >
              Reset changes
            </button>
          </div>
        </div>

        {pageStatus && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {pageStatus}
          </div>
        )}

        {pageError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Could not fetch existing copy. {pageError}
          </div>
        )}

        {pageLoading && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Refreshing live copy…
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSavePageForm}>
          <div className="grid gap-4 md:grid-cols-2">
            {pageFieldConfig.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={4}
                    value={pageForm[field.name] || ""}
                    onChange={handlePageFieldChange}
                    placeholder={field.placeholder}
                    className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                ) : (
                  <input
                    name={field.name}
                    value={pageForm[field.name] || ""}
                    onChange={handlePageFieldChange}
                    placeholder={field.placeholder}
                    className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="submit"
              className="rolepermission-btn primary"
              disabled={pageSubmitting}
            >
              {pageSubmitting ? "Saving..." : "Save page copy"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const PortfolioListPage = ({ type }) => {
  const {
    pageLoading,
    listForms,
    editingListId,
    listSubmitting,
    listStatus,
    sortedTrustHighlights,
    sortedContentIdeas,
    handleListFieldChange,
    handleListSubmit,
    handleListEdit,
    handleListDelete,
    handleListCancel,
  } = useManagePortfolio();

  const config = listSectionCopy[type];
  const status = listStatus[type];
  const submitting = listSubmitting[type];
  const editingIdForType = editingListId[type];
  const form = listForms[type];
  const items =
    type === LIST_TYPES.TRUST ? sortedTrustHighlights : sortedContentIdeas;

  return (
    <div className="rolepermission-page manage-portfolio-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">{config.meta}</p>
            <h2>{config.title}</h2>
            <p className="rolepermission-section-subtitle">{config.subtitle}</p>
          </div>
        </div>

        {status && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {status}
          </div>
        )}

        {pageLoading && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Loading latest entries…
          </p>
        )}

        <div className="rolepermission-table-wrapper">
          <table className="rolepermission-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Sort order</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!items.length ? (
                <tr>
                  <td colSpan={5} className="rolepermission-empty">
                    {config.empty}
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id || `${type}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description || "--"}</td>
                    <td>{item.sortOrder ?? 0}</td>
                    <td>
                      <div className="rolepermission-actions rolepermission-table-actions">
                        <button
                          type="button"
                          className="rolepermission-btn ghost"
                          onClick={() => handleListEdit(type, item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rolepermission-btn ghost danger"
                          onClick={() => handleListDelete(type, item)}
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

        <form
          className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4"
          onSubmit={(event) => handleListSubmit(event, type)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={(event) => handleListFieldChange(type, event)}
                placeholder="High-quality print samples"
                className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Sort order
              </label>
              <input
                name="sortOrder"
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(event) => handleListFieldChange(type, event)}
                className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Description (optional)
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={(event) => handleListFieldChange(type, event)}
              placeholder="Short supporting line"
              className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {editingIdForType && (
              <button
                type="button"
                className="rolepermission-btn ghost"
                onClick={() => handleListCancel(type)}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rolepermission-btn primary"
            >
              {submitting
                ? "Saving..."
                : editingIdForType
                ? "Save changes"
                : "Add item"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const TrustHighlightsPage = () => <PortfolioListPage type={LIST_TYPES.TRUST} />;

const ContentIdeasPage = () => <PortfolioListPage type={LIST_TYPES.IDEAS} />;

export { PageCopyPage, TrustHighlightsPage, ContentIdeasPage };

export default ProjectsPage;
