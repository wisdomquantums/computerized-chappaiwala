import React from "react";

const defaultLabelClass =
  "text-xs font-semibold uppercase tracking-[0.3em] text-slate-400";

const emitChange = (onChange, name, value) => {
  if (typeof onChange === "function") {
    onChange({ target: { name, value } });
  }
};

const renderInput = ({ field, value, onChange }) => {
  const sharedProps = {
    name: field.name,
    value,
    onChange,
    placeholder: field.placeholder,
    required: field.required,
    className:
      `mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm ${
        field.className || ""
      }`.trim(),
    ...field.inputProps,
  };

  if (field.render) {
    return field.render({
      value,
      formValue: value,
      onChange: (next) => emitChange(onChange, field.name, next),
    });
  }

  if (field.type === "textarea") {
    return (
      <textarea
        {...sharedProps}
        rows={field.rows || 4}
        className={`mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm ${
          field.className || ""
        }`.trim()}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select {...sharedProps}>
        {(field.options || []).map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  const inputType = field.type === "number" ? "number" : field.type || "text";
  return <input {...sharedProps} type={inputType} />;
};

const CommonForm = ({
  panelMode,
  fields = [],
  form = {},
  formError,
  submitting,
  onClose,
  onChange,
  submitLabel,
}) => {
  return (
    <div className="mt-6 space-y-6">
      {fields.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`flex flex-col ${
                field.fullWidth ? "md:col-span-2" : ""
              }`}
            >
              <label className={defaultLabelClass}>{field.label}</label>
              {renderInput({
                field,
                value: form[field.name] ?? "",
                onChange,
              })}
              {field.helper && (
                <p className="mt-1 text-xs text-slate-500">{field.helper}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No fields configured for this form.
        </p>
      )}

      {formError && (
        <p className="text-sm font-semibold text-rose-500">{formError}</p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600"
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
            : submitLabel ||
              (panelMode === "edit" ? "Save changes" : "Add entry")}
        </button>
      </div>
    </div>
  );
};

export default CommonForm;
