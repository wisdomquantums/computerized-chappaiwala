import PropTypes from "prop-types";
import ImageUploadField from "../about/components/ImageUploadField";
import { PORTFOLIO_GALLERY_LIMITS } from "./constants";

const { MIN: MIN_GALLERY_FIELDS, MAX: MAX_GALLERY_FIELDS } =
  PORTFOLIO_GALLERY_LIMITS;

const CommonForm = ({
  panelMode,
  form,
  galleryFields,
  formError,
  submitting,
  onClose,
  onChange,
  onGalleryChange,
  onAddGalleryField,
  onRemoveGalleryField,
}) => {
  const normalizedGallery =
    Array.isArray(galleryFields) && galleryFields.length ? galleryFields : [""];

  const emitFieldChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Project title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Wedding card suite"
            className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Category
          </label>
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="Wedding Cards"
            className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={4}
          placeholder="Explain what this project involved, finishing, materials, or client story."
          className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Cover image
        </label>
        <ImageUploadField
          value={form.image}
          onChange={(value) => emitFieldChange("image", value)}
          placeholder="https://..."
          helperText="Upload from this computer or paste a hosted URL (1200×900px recommended)."
        />
      </div>

      <div className="rounded-2xl border border-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Gallery images ({MIN_GALLERY_FIELDS}-{MAX_GALLERY_FIELDS})
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Upload locally or paste a URL. The first gallery image acts as
          fallback if the cover is missing.
        </p>
        <div className="mt-4 space-y-3">
          {normalizedGallery.map((url, index) => (
            <div
              key={`gallery-field-${index}`}
              className="rounded-2xl border border-slate-200 p-3"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="flex-1">
                  <ImageUploadField
                    value={url}
                    onChange={(value) => onGalleryChange(index, value)}
                    placeholder={`Image ${index + 1}`}
                    helperText="Supports upload + direct URLs."
                  />
                </div>
                {normalizedGallery.length > MIN_GALLERY_FIELDS && (
                  <button
                    type="button"
                    onClick={() => onRemoveGalleryField(index)}
                    className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold text-rose-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          {normalizedGallery.length < MAX_GALLERY_FIELDS && (
            <button
              type="button"
              onClick={onAddGalleryField}
              className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              + Add another image
            </button>
          )}
        </div>
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
            : "Add project"}
        </button>
      </div>
    </div>
  );
};

CommonForm.propTypes = {
  panelMode: PropTypes.oneOf(["add", "edit"]).isRequired,
  form: PropTypes.shape({
    title: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  galleryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onGalleryChange: PropTypes.func.isRequired,
  onAddGalleryField: PropTypes.func.isRequired,
  onRemoveGalleryField: PropTypes.func.isRequired,
};

CommonForm.defaultProps = {
  formError: null,
  submitting: false,
};

export default CommonForm;
