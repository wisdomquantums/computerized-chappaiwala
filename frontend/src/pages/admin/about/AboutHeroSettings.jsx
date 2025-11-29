import { useCallback, useState } from "react";
import Loader from "../../../components/ui/Loader";
import AboutItemsIndex from "./Index";
import useAboutSectionPanel from "./IndexUse";

const sectionKey = "about-hero";

const heroFields = [
  {
    label: "Tagline",
    name: "tagline",
    placeholder: "About Computerized Chhappaiwala",
  },
  {
    label: "Title",
    name: "title",
    placeholder: "Trusted printing and design services in Sitamarhi",
  },
  {
    label: "Description",
    name: "description",
    placeholder: "Comprehensive print production...",
    type: "textarea",
  },
];

const heroItemDefaults = () => ({
  title: "",
  value: "",
  detail: "",
  sortOrder: 0,
});

const heroModalConfig = {
  itemDefaults: heroItemDefaults,
  fields: [
    {
      label: "Label",
      name: "title",
      placeholder: "Custom cards yearly",
      required: true,
    },
    { label: "Value", name: "value", placeholder: "500+", required: true },
    {
      label: "Detail",
      name: "detail",
      placeholder: "Hero stat detail",
      helper: "Optional supporting text",
    },
    {
      label: "Sort order",
      name: "sortOrder",
      type: "number",
      helper: "Lower numbers appear first",
    },
  ],
  addMeta: {
    title: "Add hero metric",
    subtitle: "Displayed as rounded chips under the hero text.",
    submitLabel: "Add metric",
  },
  editMeta: {
    title: "Edit hero metric",
    subtitle: "Update the stat content shown on the hero.",
    submitLabel: "Save metric",
  },
  mapItemToForm: (item) => ({
    title: item.title || "",
    value: item.value || "",
    detail: item.detail || "",
    sortOrder: item.sortOrder ?? 0,
  }),
  mapFormToPayload: (form) => ({
    title: form.title?.trim() || "",
    value: form.value?.trim() || "",
    detail: form.detail?.trim() || null,
    sortOrder: Number.isFinite(Number(form.sortOrder))
      ? Number(form.sortOrder)
      : 0,
  }),
  validateForm: (form) => {
    if (!form.title?.trim()) return "Label is required.";
    if (!form.value?.trim()) return "Value is required.";
    return null;
  },
  deleteMessage: "Delete this hero metric?",
};

const heroColumns = [
  { key: "index", header: "#", render: (_, index) => index + 1 },
  { key: "label", header: "Label", render: (item) => item.title || "--" },
  { key: "value", header: "Value", render: (item) => item.value || "--" },
  { key: "detail", header: "Detail", render: (item) => item.detail || "--" },
  { key: "sort", header: "Sort", render: (item) => item.sortOrder ?? 0 },
];

const AboutHeroSettings = () => {
  const {
    section,
    loading,
    saving,
    updateSection,
    sortedItems,
    openAddPanel,
    openEditPanel,
    handleDelete,
    modalState,
    modalMeta,
  } = useAboutSectionPanel(sectionKey, heroModalConfig);

  const createFormState = useCallback(
    () => ({
      tagline: section?.tagline || "",
      title: section?.title || "",
      description: section?.description || "",
    }),
    [section]
  );

  const [form, setForm] = useState(createFormState);
  const [editorOpen, setEditorOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleToggleEditor = () => {
    if (!editorOpen) {
      setForm(createFormState());
    }
    setEditorOpen((prev) => !prev);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHero = async (event) => {
    event.preventDefault();
    try {
      await updateSection(form);
      setStatusMessage("Hero content updated.");
      setEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to update hero content.");
    }
  };

  return (
    <div className="rolepermission-page">
      {statusMessage && (
        <div className="px-4 py-3 mb-4 text-sm border rounded-2xl border-emerald-300/40 bg-emerald-50 text-emerald-800">
          {statusMessage}
        </div>
      )}

      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">About page hero</p>
            <h1>Heading content</h1>
            <p className="rolepermission-section-subtitle">
              Manage tagline, headline, and supporting copy displayed on the
              About page hero.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={handleToggleEditor}
            >
              {editorOpen ? "Close editor" : "Edit hero"}
            </button>
          </div>
        </div>

        <div className="rolepermission-table-wrapper">
          {loading ? (
            <Loader />
          ) : section ? (
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>Tagline</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{section.tagline || "--"}</td>
                  <td>{section.title || "--"}</td>
                  <td className="max-w-xl text-sm text-slate-600">
                    {section.description || "--"}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="rolepermission-empty">
              No hero content configured.
            </div>
          )}
        </div>

        {editorOpen && (
          <form
            className="pt-6 mt-6 space-y-4 border-t border-slate-100"
            onSubmit={handleSaveHero}
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
                      value={form[field.name] || ""}
                      onChange={handleFieldChange}
                      placeholder={field.placeholder}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  ) : (
                    <input
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleFieldChange}
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
                onClick={() => setEditorOpen(false)}
                className="rolepermission-btn ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rolepermission-btn primary"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </section>

      <AboutItemsIndex
        metaLabel="Hero metrics"
        title="Business stats"
        description="Displayed as rounded chips under the hero text."
        addButtonLabel="Add hero metric"
        emptyMessage="No metrics configured."
        loading={loading}
        items={sortedItems}
        columns={heroColumns}
        onAdd={openAddPanel}
        onEdit={openEditPanel}
        onDelete={(item) => handleDelete(item.id)}
        modalState={modalState}
        modalMeta={modalMeta}
      />
    </div>
  );
};

export default AboutHeroSettings;
