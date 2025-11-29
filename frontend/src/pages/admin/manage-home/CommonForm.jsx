import PropTypes from "prop-types";
import ImageUploadField from "../about/components/ImageUploadField";

const renderField = (field, value, onChange) => {
  const inputProps = {
    name: field.name,
    value: value ?? "",
    onChange,
    placeholder: field.placeholder,
    className: "mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm",
  };

  if (field.type === "textarea") {
    return <textarea rows={4} {...inputProps} />;
  }

  if (field.type === "image") {
    return (
      <ImageUploadField
        value={value}
        onChange={(val) =>
          onChange({
            target: { name: field.name, value: val },
          })
        }
        placeholder={field.placeholder}
        helperText="Upload or paste a hosted URL."
      />
    );
  }

  return <input type={field.type || "text"} {...inputProps} />;
};

const CommonForm = ({
  panelMode,
  sectionConfig,
  form,
  formError,
  submitting,
  onClose,
  onSubmit,
  onChange,
}) => {
  if (!sectionConfig) {
    return null;
  }

  return (
    <form className="rolepermission-form" onSubmit={onSubmit}>
      <div className="mt-6 space-y-5">
        {sectionConfig.fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {field.label}
              {field.required && <span className="text-rose-500"> *</span>}
            </label>
            {renderField(field, form[field.name], onChange)}
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Sort order
          </label>
          <input
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={onChange}
            className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        {formError && (
          <p className="text-sm font-semibold text-rose-500">{formError}</p>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : panelMode === "edit"
              ? "Save changes"
              : "Add entry"}
          </button>
        </div>
      </div>
    </form>
  );
};

CommonForm.propTypes = {
  panelMode: PropTypes.oneOf(["add", "edit"]).isRequired,
  sectionConfig: PropTypes.shape({
    label: PropTypes.string,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
      })
    ),
  }).isRequired,
  form: PropTypes.object.isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

CommonForm.defaultProps = {
  formError: null,
  submitting: false,
};

export default CommonForm;
