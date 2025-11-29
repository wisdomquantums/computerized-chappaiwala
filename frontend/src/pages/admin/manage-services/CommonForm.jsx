import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  MIN_GALLERY,
  MAX_GALLERY,
  serviceOptions,
  formatChargeLabel,
} from "./IndexUse";
import { resolveAssetUrl } from "../../../utils/assetUrl";

const CommonForm = ({
  panelMode,
  form,
  galleryFields,
  formError,
  submitting,
  finalPriceLabel,
  onClose,
  onChange,
  onGalleryChange,
  onAddGalleryField,
  onRemoveGalleryField,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleLocalFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);

      const workingFields = [...galleryFields];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:4000/api"
          }/upload/image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          console.error("Upload failed", await response.text());
          continue;
        }

        const data = await response.json();
        const url = resolveAssetUrl(data.url || data.path);
        if (!url) continue;

        let targetIndex = workingFields.findIndex((value) => !value);
        if (targetIndex === -1) {
          if (workingFields.length >= MAX_GALLERY) {
            break;
          }
          workingFields.push("");
          onAddGalleryField();
          targetIndex = workingFields.length - 1;
        }

        workingFields[targetIndex] = url;
        onGalleryChange(targetIndex, url);
      }
    } catch (error) {
      console.error("Error uploading images", error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Service name
          </label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Title name
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Wedding Card Printing"
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
          rows={4}
          placeholder="Explain what the service includes, finishing, delivery, etc."
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Rating (stars)
          </label>
          <input
            name="rating"
            value={form.rating}
            onChange={onChange}
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Review count
          </label>
          <input
            name="reviewCount"
            value={form.reviewCount}
            onChange={onChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Support window
          </label>
          <input
            name="supportWindow"
            value={form.supportWindow}
            onChange={onChange}
            placeholder="24-72 hrs"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Images (upload or URL) — minimum {MIN_GALLERY}, maximum {MAX_GALLERY}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          You can paste direct image URLs or upload files from your computer.
          The first image acts as the cover on the Services page.
        </p>
        <div className="mt-3">
          <label className="inline-flex items-center gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
              Upload from computer
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleLocalFiles}
              disabled={galleryFields.filter(Boolean).length >= MAX_GALLERY}
              className="text-xs disabled:cursor-not-allowed disabled:opacity-60"
            />
            {uploading && <span>Uploading...</span>}
          </label>
        </div>
        <div className="mt-4 space-y-3">
          {galleryFields.map((url, index) => (
            <div key={`gallery-field-${index}`} className="flex gap-3">
              <input
                value={url}
                onChange={(event) => onGalleryChange(index, event.target.value)}
                placeholder={`Image URL ${index + 1}`}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              {galleryFields.length > MIN_GALLERY && (
                <button
                  type="button"
                  onClick={() => onRemoveGalleryField(index)}
                  className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold text-rose-500 disabled:opacity-40"
                  disabled={galleryFields.length <= MIN_GALLERY}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {galleryFields.length < MAX_GALLERY && (
            <button
              type="button"
              onClick={onAddGalleryField}
              className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              + Add another image
            </button>
          )}
          <p className="text-xs text-slate-500">
            Must include at least {MIN_GALLERY} images and no more than{" "}
            {MAX_GALLERY} before saving.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Paper charge (₹)
          </label>
          <input
            name="paperChargeValue"
            value={form.paperChargeValue}
            onChange={onChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <input
            name="paperChargeSuffix"
            value={form.paperChargeSuffix}
            onChange={onChange}
            placeholder="/ pad"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-xs"
          />
          <p className="mt-1 text-xs text-slate-500">
            Shown as “
            {formatChargeLabel(form.paperChargeValue, form.paperChargeSuffix)}
            ”.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Print charge (₹)
          </label>
          <input
            name="printChargeValue"
            value={form.printChargeValue}
            onChange={onChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <input
            name="printChargeSuffix"
            value={form.printChargeSuffix}
            onChange={onChange}
            placeholder="/ page"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-xs"
          />
          <p className="mt-1 text-xs text-slate-500">
            Shown as “
            {formatChargeLabel(form.printChargeValue, form.printChargeSuffix)}
            ”.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Final price unit
          </label>
          <input
            name="unitLabel"
            value={form.unitLabel}
            onChange={onChange}
            placeholder="/ pad"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            Final price preview: {finalPriceLabel}
          </div>
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
            : "Add service"}
        </button>
      </div>
    </div>
  );
};

CommonForm.propTypes = {
  panelMode: PropTypes.oneOf(["add", "edit"]).isRequired,
  form: PropTypes.object.isRequired,
  galleryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  finalPriceLabel: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onGalleryChange: PropTypes.func.isRequired,
  onAddGalleryField: PropTypes.func.isRequired,
  onRemoveGalleryField: PropTypes.func.isRequired,
};

export default CommonForm;
