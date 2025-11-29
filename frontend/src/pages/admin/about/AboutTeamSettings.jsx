import { useCallback, useState } from "react";
import Loader from "../../../components/ui/Loader";
import AboutItemsIndex from "./Index";
import useAboutSectionPanel from "./IndexUse";
import ImageUploadField from "./components/ImageUploadField";

const sectionKey = "about-team";

const fieldConfig = [
  { label: "Section label", name: "tagline" },
  { label: "Title", name: "title" },
  { label: "Subtitle", name: "subtitle" },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    placeholder: "Describe how your team operates...",
  },
];

const memberDefaults = () => ({
  title: "",
  subtitle: "",
  description: "",
  detail: "",
  value: "",
  mediaUrl: "",
  metaQuote: "",
  sortOrder: 0,
});

const teamModalConfig = {
  itemDefaults: memberDefaults,
  fields: [
    {
      label: "Name",
      name: "title",
      placeholder: "Priya Singh",
      required: true,
    },
    {
      label: "Role",
      name: "subtitle",
      placeholder: "Production head",
      required: true,
    },
    {
      label: "Short bio",
      name: "description",
      type: "textarea",
      placeholder: "Summarize the member's background",
      required: true,
      fullWidth: true,
    },
    {
      label: "Badge / Detail",
      name: "detail",
      placeholder: "Specialty or badge label",
    },
    {
      label: "Contact or CTA",
      name: "value",
      placeholder: "Email, phone, or CTA copy",
    },
    {
      label: "Portrait image",
      name: "mediaUrl",
      render: ({ value, onChange }) => (
        <ImageUploadField
          value={value}
          onChange={onChange}
          placeholder="https://"
          helperText="Upload a member portrait or paste an external URL."
        />
      ),
    },
    {
      label: "Quote",
      name: "metaQuote",
      placeholder: "Optional pull quote",
    },
    {
      label: "Sort order",
      name: "sortOrder",
      type: "number",
      helper: "Lower numbers appear first",
    },
  ],
  addMeta: {
    title: "Add team member",
    subtitle: "Appears as portrait cards on the About page.",
    submitLabel: "Add member",
  },
  editMeta: {
    title: "Edit team member",
    subtitle: "Update the roster entry.",
    submitLabel: "Save member",
  },
  mapItemToForm: (item) => ({
    title: item.title || "",
    subtitle: item.subtitle || "",
    description: item.description || "",
    detail: item.detail || "",
    value: item.value || "",
    mediaUrl: item.mediaUrl || "",
    metaQuote: item.meta?.quote || "",
    sortOrder: item.sortOrder ?? 0,
  }),
  mapFormToPayload: (form) => {
    const metaQuote = form.metaQuote?.trim();
    return {
      title: form.title?.trim() || "",
      subtitle: form.subtitle?.trim() || "",
      description: form.description?.trim() || "",
      detail: form.detail?.trim() || "",
      value: form.value?.trim() || "",
      mediaUrl: form.mediaUrl?.trim() || "",
      sortOrder: Number.isFinite(Number(form.sortOrder))
        ? Number(form.sortOrder)
        : 0,
      meta: metaQuote ? { quote: metaQuote } : null,
    };
  },
  validateForm: (form) => {
    if (!form.title?.trim()) return "Name is required.";
    if (!form.subtitle?.trim()) return "Role is required.";
    if (!form.description?.trim()) return "Bio is required.";
    return null;
  },
  deleteMessage: "Remove this team member?",
};

const teamColumns = [
  { key: "index", header: "#", render: (_, index) => index + 1 },
  {
    key: "name",
    header: "Name",
    render: (member) => (
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{member.title || "--"}</span>
        <span className="text-slate-500">
          {member.detail || member.meta?.quote || ""}
        </span>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (member) => member.subtitle || "--",
  },
  {
    key: "contact",
    header: "Contact / CTA",
    render: (member) => member.value || "--",
  },
  {
    key: "sort",
    header: "Sort",
    render: (member) => member.sortOrder ?? 0,
  },
];

const AboutTeamSettings = () => {
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
  } = useAboutSectionPanel(sectionKey, teamModalConfig);

  const createFormState = useCallback(
    () => ({
      tagline: section?.tagline || "",
      title: section?.title || "",
      subtitle: section?.subtitle || "",
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

  const handleSaveSection = async (event) => {
    event.preventDefault();
    try {
      await updateSection(form);
      setStatusMessage("Team section updated.");
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
            <h1>Team & leadership</h1>
            <p className="rolepermission-section-subtitle">
              Manage the intro copy and roster that display on the About page.
            </p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={handleToggleEditor}
            >
              {editorOpen ? "Close editor" : "Edit intro"}
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
                  <th>Label</th>
                  <th>Title</th>
                  <th>Subtitle</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{section.tagline || "--"}</td>
                  <td>{section.title || "--"}</td>
                  <td>{section.subtitle || "--"}</td>
                  <td className="max-w-xl text-sm text-slate-600">
                    {section.description || "--"}
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
                  {field.type === "textarea" ? (
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
        metaLabel="Team roster"
        title="Leadership & coordinators"
        description="Members appear as portrait cards beneath the section."
        addButtonLabel="Add member"
        emptyMessage="No team members configured."
        loading={loading}
        items={sortedItems}
        columns={teamColumns}
        onAdd={openAddPanel}
        onEdit={openEditPanel}
        onDelete={(item) => handleDelete(item.id)}
        modalState={modalState}
        modalMeta={modalMeta}
      />
    </div>
  );
};

export default AboutTeamSettings;
