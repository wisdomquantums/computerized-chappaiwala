import { useCallback, useState } from "react";
import Loader from "../../../components/ui/Loader";
import AboutItemsIndex from "./Index";
import useAboutSectionPanel from "./IndexUse";
import ImageUploadField from "./components/ImageUploadField";

const sectionKey = "about-founder";

const fieldConfig = [
  { label: "Tagline", name: "tagline" },
  { label: "Name / Title", name: "title" },
  {
    label: "Bio",
    name: "description",
    type: "textarea",
    placeholder: "Describe the founder's story...",
  },
  {
    label: "Portrait image",
    name: "primaryImage",
    render: ({ value, onChange }) => (
      <ImageUploadField
        value={value}
        onChange={onChange}
        placeholder="https://"
        helperText="Paste an image URL or upload a local portrait."
      />
    ),
  },
];

const highlightDefaults = () => ({
  description: "",
  sortOrder: 0,
});

const founderModalConfig = {
  itemDefaults: highlightDefaults,
  fields: [
    {
      label: "Highlight text",
      name: "description",
      type: "textarea",
      placeholder: "Describe the accomplishment",
      required: true,
      fullWidth: true,
    },
    {
      label: "Sort order",
      name: "sortOrder",
      type: "number",
      helper: "Lower numbers appear first",
    },
  ],
  addMeta: {
    title: "Add highlight",
    subtitle: "Displayed as bullet cards beside the portrait.",
    submitLabel: "Add highlight",
  },
  editMeta: {
    title: "Edit highlight",
    subtitle: "Update the founder accomplishment copy.",
    submitLabel: "Save highlight",
  },
  mapItemToForm: (item) => ({
    description: item.description || "",
    sortOrder: item.sortOrder ?? 0,
  }),
  mapFormToPayload: (form) => ({
    description: form.description?.trim() || "",
    sortOrder: Number.isFinite(Number(form.sortOrder))
      ? Number(form.sortOrder)
      : 0,
  }),
  validateForm: (form) => {
    if (!form.description?.trim()) return "Highlight text is required.";
    return null;
  },
  deleteMessage: "Delete this highlight?",
};

const founderColumns = [
  { key: "index", header: "#", render: (_, index) => index + 1 },
  {
    key: "highlight",
    header: "Highlight",
    render: (item) => (
      <span className="text-sm text-slate-600">{item.description || "--"}</span>
    ),
  },
  { key: "sort", header: "Sort", render: (item) => item.sortOrder ?? 0 },
];

const AboutFounderSettings = () => {
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
  } = useAboutSectionPanel(sectionKey, founderModalConfig);

  const createFormState = useCallback(
    () => ({
      tagline: section?.tagline || "",
      title: section?.title || "",
      description: section?.description || "",
      primaryImage: section?.primaryImage || "",
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

  const handleSaveSection = async (event) => {
    event.preventDefault();
    try {
      await updateSection(form);
      setStatusMessage("Founder section updated.");
      setEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to update founder section.");
    }
  };

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
            <p className="rolepermission-role-meta">About page section</p>
            <h1>Founder spotlight</h1>
            <p className="rolepermission-section-subtitle">
              Update the founder bio, tagline, and portrait used on the About
              page.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={handleToggleEditor}
            >
              {editorOpen ? "Close editor" : "Edit founder"}
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
                  <th>Name</th>
                  <th>Bio</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{section.tagline || "--"}</td>
                  <td>{section.title || "--"}</td>
                  <td className="max-w-xl text-sm text-slate-600">
                    {section.description || "--"}
                  </td>
                  <td>
                    {section.primaryImage ? (
                      <a href={section.primaryImage}>View image</a>
                    ) : (
                      "--"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="rolepermission-empty">
              No founder content found.
            </div>
          )}
        </div>

        {editorOpen && (
          <form
            className="mt-6 space-y-4 border-t border-slate-100 pt-6"
            onSubmit={handleSaveSection}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {fieldConfig.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {field.label}
                  </label>
                  {field.render ? (
                    field.render({
                      value: form[field.name] || "",
                      onChange: (nextValue) =>
                        setForm((prev) => ({
                          ...prev,
                          [field.name]: nextValue,
                        })),
                    })
                  ) : field.type === "textarea" ? (
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
        metaLabel="Highlights"
        title="Founder accomplishments"
        description="Displayed as bullet cards beside the portrait."
        addButtonLabel="Add highlight"
        emptyMessage="No highlights configured."
        loading={loading}
        items={sortedItems}
        columns={founderColumns}
        onAdd={openAddPanel}
        onEdit={openEditPanel}
        onDelete={(item) => handleDelete(item.id)}
        modalState={modalState}
        modalMeta={modalMeta}
      />
    </div>
  );
};

export default AboutFounderSettings;
