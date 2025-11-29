import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader";
import {
  fetchServicePage,
  updateServicePageContent,
  deleteServicePageContent,
  createServiceStat,
  updateServiceStat,
  deleteServiceStat,
} from "../../../features/servicePage/servicePageSlice";

const emptyStat = {
  label: "",
  value: "",
  detail: "",
  sortOrder: 0,
};

const ServicePageSettings = () => {
  const dispatch = useDispatch();
  const { content, stats, loading, saving } = useSelector(
    (state) => state.servicePage
  );
  const [contentForm, setContentForm] = useState(content);
  const [statForm, setStatForm] = useState(emptyStat);
  const [editingStatId, setEditingStatId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [contentEditorOpen, setContentEditorOpen] = useState(false);
  const [statEditorOpen, setStatEditorOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchServicePage());
  }, [dispatch]);

  useEffect(() => {
    setContentForm(content);
  }, [content]);

  const sortedStats = useMemo(() => {
    return [...(stats || [])].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
  }, [stats]);

  const handleContentChange = (event) => {
    const { name, value } = event.target;
    setContentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveContent = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateServicePageContent(contentForm)).unwrap();
      setStatusMessage("Hero content updated successfully.");
      setContentEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to update content.");
    }
  };

  const handleEditContent = () => {
    setContentEditorOpen(true);
    setStatusMessage(null);
  };

  const handleCancelContentEdit = () => {
    setContentEditorOpen(false);
    setContentForm(content);
  };

  const handleDeleteContent = async () => {
    if (!window.confirm("Remove hero heading details?")) return;
    try {
      await dispatch(deleteServicePageContent()).unwrap();
      await dispatch(fetchServicePage()).unwrap();
      setStatusMessage(
        "Hero content deleted. Default copy will appear until you add new text."
      );
      setContentEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to delete hero content.");
    }
  };

  const handleStatChange = (event) => {
    const { name, value } = event.target;
    setStatForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStatClick = () => {
    resetStatForm();
    setStatEditorOpen(true);
    setStatusMessage(null);
  };

  const handleEditStat = (stat) => {
    setEditingStatId(stat.id);
    setStatForm({
      label: stat.label || "",
      value: stat.value || "",
      detail: stat.detail || "",
      sortOrder: stat.sortOrder ?? 0,
    });
    setStatEditorOpen(true);
    setStatusMessage(null);
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm("Delete this metric?")) return;
    try {
      await dispatch(deleteServiceStat(id)).unwrap();
      if (editingStatId === id) {
        resetStatForm();
        setStatEditorOpen(false);
      }
      setStatusMessage("Metric deleted.");
    } catch (error) {
      setStatusMessage(error?.message || "Unable to delete metric.");
    }
  };

  const resetStatForm = () => {
    setEditingStatId(null);
    setStatForm(emptyStat);
  };

  const handleCancelStatEdit = () => {
    resetStatForm();
    setStatEditorOpen(false);
  };

  const handleSaveStat = async (event) => {
    event.preventDefault();
    try {
      if (editingStatId) {
        await dispatch(
          updateServiceStat({ id: editingStatId, ...statForm })
        ).unwrap();
        setStatusMessage("Metric updated.");
      } else {
        await dispatch(createServiceStat(statForm)).unwrap();
        setStatusMessage("Metric added.");
      }
      resetStatForm();
      setStatEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to save metric.");
    }
  };

  const heroFields = [
    {
      label: "Hero Tagline",
      name: "heroTagline",
      placeholder: "Premium print studio",
    },
    {
      label: "Hero Title",
      name: "heroTitle",
      placeholder: "Sitamarhi's modern printing desk",
    },
    {
      label: "Hero Description",
      name: "heroDescription",
      placeholder: "Short paragraph that appears below the heading.",
      type: "textarea",
    },
    {
      label: "Primary CTA Label",
      name: "primaryCtaText",
      placeholder: "Explore catalog",
    },
    {
      label: "Primary CTA Link",
      name: "primaryCtaLink",
      placeholder: "/services",
    },
    {
      label: "Secondary CTA Label",
      name: "secondaryCtaText",
      placeholder: "Download rate card",
    },
    {
      label: "Secondary CTA Link",
      name: "secondaryCtaLink",
      placeholder: "#services-grid",
    },
  ];

  return (
    <div className="rolepermission-page">
      {statusMessage && (
        <div className="mb-4 rounded-2xl border border-emerald-300/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      )}
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Services page hero</p>
            <h1>Services heading info</h1>
            <p className="rolepermission-section-subtitle">
              Review the published hero copy and CTA links exactly how your
              customers see them, then edit or reset when campaigns change.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={
                contentEditorOpen ? handleCancelContentEdit : handleEditContent
              }
            >
              {contentEditorOpen ? "Close editor" : "Add heading info"}
            </button>
          </div>
        </div>

        <div className="rolepermission-table-wrapper">
          {loading ? (
            <Loader />
          ) : (
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tagline</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Primary CTA</th>
                  <th>Secondary CTA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!content ? (
                  <tr>
                    <td colSpan={7} className="rolepermission-empty">
                      No heading content saved yet.
                    </td>
                  </tr>
                ) : (
                  <tr key={content.id || "default-heading"}>
                    <td>1</td>
                    <td>{content.heroTagline || "--"}</td>
                    <td>{content.heroTitle || "--"}</td>
                    <td>
                      <p className="max-w-xs text-sm text-slate-600">
                        {content.heroDescription || "--"}
                      </p>
                    </td>
                    <td>
                      <div className="rolepermission-role-name">
                        <span className="rolepermission-role-label">
                          {content.primaryCtaText || "--"}
                        </span>
                        <small>{content.primaryCtaLink || "--"}</small>
                      </div>
                    </td>
                    <td>
                      <div className="rolepermission-role-name">
                        <span className="rolepermission-role-label">
                          {content.secondaryCtaText || "--"}
                        </span>
                        <small>{content.secondaryCtaLink || "--"}</small>
                      </div>
                    </td>
                    <td>
                      <div className="rolepermission-actions rolepermission-table-actions">
                        <button
                          type="button"
                          className="rolepermission-btn ghost"
                          onClick={handleEditContent}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rolepermission-btn ghost danger"
                          onClick={handleDeleteContent}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {contentEditorOpen && (
          <form
            className="mt-6 space-y-4 border-t border-slate-100 pt-6"
            onSubmit={handleSaveContent}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {heroFields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={contentForm[field.name] || ""}
                      onChange={handleContentChange}
                      placeholder={field.placeholder}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  ) : (
                    <input
                      name={field.name}
                      value={contentForm[field.name] || ""}
                      onChange={handleContentChange}
                      placeholder={field.placeholder}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rolepermission-btn ghost"
                onClick={handleCancelContentEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rolepermission-btn primary"
              >
                {saving ? "Saving..." : "Save hero content"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Hero metrics</p>
            <h2>Stat blocks</h2>
            <p className="rolepermission-section-subtitle">
              Visitors see up to three cards. Add, edit, or reorder them to
              highlight what matters most.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={
                statEditorOpen ? handleCancelStatEdit : handleAddStatClick
              }
            >
              {statEditorOpen ? "Close metric form" : "Add hero metric"}
            </button>
          </div>
        </div>

        <div className="rolepermission-table-wrapper">
          {loading ? (
            <Loader />
          ) : (
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Label</th>
                  <th>Value</th>
                  <th>Detail</th>
                  <th>Sort order</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="rolepermission-empty">
                      No hero metrics configured yet.
                    </td>
                  </tr>
                ) : (
                  sortedStats.map((stat, index) => (
                    <tr key={stat.id}>
                      <td>{index + 1}</td>
                      <td>{stat.label}</td>
                      <td>{stat.value}</td>
                      <td>{stat.detail || "--"}</td>
                      <td>{stat.sortOrder ?? 0}</td>
                      <td>
                        <div className="rolepermission-actions rolepermission-table-actions">
                          <button
                            type="button"
                            className="rolepermission-btn ghost"
                            onClick={() => handleEditStat(stat)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rolepermission-btn ghost danger"
                            onClick={() => handleDeleteStat(stat.id)}
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
          )}
        </div>

        {statEditorOpen && (
          <form
            className="mt-6 space-y-4 border-t border-slate-100 pt-6"
            onSubmit={handleSaveStat}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Label
                </label>
                <input
                  name="label"
                  value={statForm.label}
                  onChange={handleStatChange}
                  placeholder="Curated services"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Value
                </label>
                <input
                  name="value"
                  value={statForm.value}
                  onChange={handleStatChange}
                  placeholder="1+"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Detail
                </label>
                <input
                  name="detail"
                  value={statForm.detail}
                  onChange={handleStatChange}
                  placeholder="Hand-vetted combos"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Sort order
                </label>
                <input
                  name="sortOrder"
                  value={statForm.sortOrder}
                  onChange={handleStatChange}
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelStatEdit}
                className="rolepermission-btn ghost"
              >
                Cancel
              </button>
              <button type="submit" className="rolepermission-btn primary">
                {editingStatId ? "Update metric" : "Add metric"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default ServicePageSettings;
