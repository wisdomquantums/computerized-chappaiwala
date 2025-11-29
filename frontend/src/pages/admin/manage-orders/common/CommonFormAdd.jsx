import PropTypes from "prop-types";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_PRIORITY_OPTIONS,
  ORDER_CHANNEL_OPTIONS,
} from "../../../../constants/orders";

const CommonFormAdd = ({
  panelMode,
  form,
  formError,
  submitting,
  onClose,
  onChange,
  onTagChange,
}) => (
  <div className="mt-6 space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Project name
        </label>
        <input
          name="projectName"
          value={form.projectName}
          onChange={onChange}
          placeholder="Wedding Campaign"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Service line
        </label>
        <input
          name="serviceLine"
          value={form.serviceLine}
          onChange={onChange}
          placeholder="Letterheads"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Client name
        </label>
        <input
          name="clientName"
          value={form.clientName}
          onChange={onChange}
          placeholder="Nova Health"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Client company
        </label>
        <input
          name="company"
          value={form.company}
          onChange={onChange}
          placeholder="Nova Health Pvt Ltd"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Assign to
        </label>
        <input
          name="assignedTo"
          value={form.assignedTo}
          onChange={onChange}
          placeholder="Ops lead / owner"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Email
        </label>
        <input
          name="clientEmail"
          value={form.clientEmail}
          onChange={onChange}
          placeholder="ops@novahealth.com"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Phone
        </label>
        <input
          name="clientPhone"
          value={form.clientPhone}
          onChange={onChange}
          placeholder="9876543210"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Channel
        </label>
        <select
          name="channel"
          value={form.channel}
          onChange={onChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        >
          {ORDER_CHANNEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          disabled={panelMode === "add"}
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Priority
        </label>
        <select
          name="priority"
          value={form.priority}
          onChange={onChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        >
          {ORDER_PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Due date
        </label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={onChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Budget (₹)
        </label>
        <input
          name="budget"
          type="number"
          value={form.budget}
          onChange={onChange}
          placeholder="15000"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Quantity
        </label>
        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={onChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Tags (comma separated)
        </label>
        <input
          name="tags"
          value={form.tagsInput}
          onChange={onTagChange}
          placeholder="rush, ncr, print"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
    </div>

    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Description
      </label>
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        rows={3}
        placeholder="Describe the order scope, substrate, finishing, delivery, etc."
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
      />
    </div>

    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Internal notes
      </label>
      <textarea
        name="internalNotes"
        value={form.internalNotes}
        onChange={onChange}
        rows={3}
        placeholder="Only admins and employees can read this block."
        className="mt-2 w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
      />
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
          : "Add order"}
      </button>
    </div>
  </div>
);

CommonFormAdd.propTypes = {
  panelMode: PropTypes.oneOf(["add", "edit"]).isRequired,
  form: PropTypes.object.isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onTagChange: PropTypes.func.isRequired,
};

export default CommonFormAdd;
