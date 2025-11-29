import PropTypes from "prop-types";
import {
  actionTypeOptions,
  iconOptions,
  MIN_LINES,
  MAX_LINES,
} from "./IndexUse";

const CommonForm = ({
  panelMode,
  form,
  lineFields,
  formError,
  submitting,
  onClose,
  onChange,
  onLineChange,
  onAddLineField,
  onRemoveLineField,
}) => {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Card title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Visit our studio"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Eyebrow label
          </label>
          <input
            name="eyebrow"
            value={form.eyebrow}
            onChange={onChange}
            placeholder="Contact"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Icon
          </label>
          <select
            name="iconKey"
            value={form.iconKey}
            onChange={onChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Sort order
          </label>
          <input
            name="sortOrder"
            value={form.sortOrder}
            onChange={onChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="0"
          />
          <p className="mt-2 text-xs text-slate-500">
            Lower numbers appear first on the cards grid.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Detail lines (min {MIN_LINES}, max {MAX_LINES})
        </p>
        <div className="mt-4 space-y-3">
          {lineFields.map((value, index) => (
            <div key={`contact-line-${index}`} className="flex gap-3">
              <input
                value={value}
                onChange={(event) => onLineChange(index, event.target.value)}
                placeholder={`Line ${index + 1}`}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              {lineFields.length > MIN_LINES && (
                <button
                  type="button"
                  onClick={() => onRemoveLineField(index)}
                  className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold text-rose-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {lineFields.length < MAX_LINES && (
          <button
            type="button"
            onClick={onAddLineField}
            className="mt-4 rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            + Add another line
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Action type
          </label>
          <select
            name="actionType"
            value={form.actionType}
            onChange={onChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {actionTypeOptions.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Leave as "No action" to hide the button.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Action label
          </label>
          <input
            name="actionLabel"
            value={form.actionLabel}
            onChange={onChange}
            placeholder="Call"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Action link / target
          </label>
          <input
            name="actionHref"
            value={form.actionHref}
            onChange={onChange}
            placeholder="tel:+919801305451"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

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
            : panelMode === "edit"
            ? "Save changes"
            : "Add card"}
        </button>
      </div>
    </div>
  );
};

CommonForm.propTypes = {
  panelMode: PropTypes.oneOf(["add", "edit"]).isRequired,
  form: PropTypes.object.isRequired,
  lineFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLineChange: PropTypes.func.isRequired,
  onAddLineField: PropTypes.func.isRequired,
  onRemoveLineField: PropTypes.func.isRequired,
};

export default CommonForm;
