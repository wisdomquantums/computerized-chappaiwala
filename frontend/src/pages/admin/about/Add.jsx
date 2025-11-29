import React from "react";
import CommonFormAdd from "./CommonFormAdd";

const Add = ({
  title = "Add entry",
  subtitle,
  fields,
  submitLabel,
  onClose,
  onSubmit,
  ...formProps
}) => {
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <form className="rolepermission-form" onSubmit={onSubmit}>
          <div className="rolepermission-modal-head">
            <div>
              <p className="rolepermission-role-meta">About section</p>
              <h2>{title}</h2>
              {subtitle && (
                <p className="rolepermission-section-subtitle">{subtitle}</p>
              )}
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
            fields={fields}
            submitLabel={submitLabel}
            onClose={onClose}
            {...formProps}
          />
        </form>
      </div>
    </div>
  );
};

export default Add;
