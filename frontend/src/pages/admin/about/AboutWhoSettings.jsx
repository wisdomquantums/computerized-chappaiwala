import { useCallback, useState } from "react";
import Loader from "../../../components/ui/Loader";
import AboutItemsIndex from "./Index";
import useAboutSectionPanel from "./IndexUse";
import ImageUploadField from "./components/ImageUploadField";

const sectionKey = "about-who";

const fieldConfig = [
  { label: "Tagline", name: "tagline" },
  { label: "Title", name: "title" },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    placeholder: "Describe who you are...",
  },
  {
    label: "Hero image",
    name: "primaryImage",
    render: ({ value, onChange }) => (
      <ImageUploadField
        value={value}
        onChange={onChange}
        placeholder="https://"
        helperText="Paste a URL or upload a studio photo from your computer."
      />
    ),
  },
];

const highlightDefaults = () => ({
  title: "",
  description: "",
  sortOrder: 0,
});

const whoModalConfig = {
  itemDefaults: highlightDefaults,
  fields: [
    {
      label: "Title",
      name: "title",
      placeholder: "End-to-end printing",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder: "Explain the differentiator",
      required: true,
      fullWidth: true,
    },
    {
      label: "Sort order",
      name: "sortOrder",
      type: "number",
      helper: "Lower numbers surface first",
    },
  ],
  addMeta: {
    title: "Add highlight",
    subtitle: "Displayed as cards beside the studio photo.",
    submitLabel: "Add highlight",
  },
  editMeta: {
    title: "Edit highlight",
    subtitle: "Update the differentiator copy.",
    submitLabel: "Save highlight",
  },
  mapItemToForm: (item) => ({
    title: item.title || "",
    description: item.description || "",
    sortOrder: item.sortOrder ?? 0,
  }),
  mapFormToPayload: (form) => ({
    title: form.title?.trim() || "",
    description: form.description?.trim() || "",
    sortOrder: Number.isFinite(Number(form.sortOrder))
      ? Number(form.sortOrder)
      : 0,
  }),
  validateForm: (form) => {
    if (!form.title?.trim()) return "Title is required.";
    if (!form.description?.trim()) return "Description is required.";
    return null;
  },
  deleteMessage: "Delete this highlight?",
};

const whoColumns = [
  { key: "index", header: "#", render: (_, index) => index + 1 },
  { key: "title", header: "Title", render: (item) => item.title || "--" },
  {
    key: "description",
    header: "Description",
    render: (item) => (
      <span className="block max-w-xl text-sm text-slate-600">
        {item.description || "--"}
      </span>
    ),
  },
  { key: "sort", header: "Sort", render: (item) => item.sortOrder ?? 0 },
];

const AboutWhoSettings = () => {
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
  } = useAboutSectionPanel(sectionKey, whoModalConfig);

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
      setStatusMessage("Section updated.");
      setEditorOpen(false);
    } catch (error) {
      setStatusMessage(error?.message || "Unable to update section.");
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
            <p className="rolepermission-role-meta">About page section</p>
            <h1>Who We Are</h1>
            <p className="rolepermission-section-subtitle">
              Control the text and imagery that describe your studio overview.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={handleToggleEditor}
            >
              {editorOpen ? "Close editor" : "Edit section"}
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
              No section content found.
            </div>
          )}
        </div>

        {editorOpen && (
          <form
            className="pt-6 mt-6 space-y-4 border-t border-slate-100"
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
                      className="w-full px-4 py-3 mt-2 text-sm border rounded-2xl border-slate-200"
                    />
                  ) : (
                    <input
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleFieldChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 mt-2 text-sm border rounded-2xl border-slate-200"
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
        title="Key differentiators"
        description="Displayed as cards beside the studio photo."
        addButtonLabel="Add highlight"
        emptyMessage="No highlights configured."
        loading={loading}
        items={sortedItems}
        columns={whoColumns}
        onAdd={openAddPanel}
        onEdit={openEditPanel}
        onDelete={(item) => handleDelete(item.id)}
        modalState={modalState}
        modalMeta={modalMeta}
      />
    </div>
  );
};

export default AboutWhoSettings;
