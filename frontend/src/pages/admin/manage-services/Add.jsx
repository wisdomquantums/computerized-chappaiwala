import React from "react";
import CommonFormAdd from "./CommonFormAdd";

const Add = ({
  form,
  galleryFields,
  formError,
  submitting,
  finalPriceLabel,
  onClose,
  onSubmit,
  onChange,
  onGalleryChange,
  onAddGalleryField,
  onRemoveGalleryField,
}) => {
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <form className="rolepermission-form" onSubmit={onSubmit}>
          <div className="rolepermission-modal-head">
            <div>
              <p className="rolepermission-role-meta">Create service</p>
              <h2>Add new catalog entry</h2>
            </div>
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <CommonFormAdd
            form={form}
            galleryFields={galleryFields}
            formError={formError}
            submitting={submitting}
            finalPriceLabel={finalPriceLabel}
            onClose={onClose}
            onSubmit={onSubmit}
            onChange={onChange}
            onGalleryChange={onGalleryChange}
            onAddGalleryField={onAddGalleryField}
            onRemoveGalleryField={onRemoveGalleryField}
          />
        </form>
      </div>
    </div>
  );
};

export default Add;
