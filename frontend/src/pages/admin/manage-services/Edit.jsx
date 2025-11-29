import React from "react";
import CommonForm from "./CommonForm";

const Edit = ({
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
              <p className="rolepermission-role-meta">Edit service</p>
              <h2>Update catalog entry</h2>
            </div>
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <CommonForm
            panelMode="edit"
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

export default Edit;
