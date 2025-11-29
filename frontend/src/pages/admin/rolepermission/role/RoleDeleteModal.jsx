import { createPortal } from "react-dom";

const RoleDeleteModal = ({ role, onConfirm, onCancel, isDeleting }) => {
  return createPortal(
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel small">
        <div className="rolepermission-modal-head">
          <div>
            <p className="rolepermission-role-meta">Delete role</p>
            <h2>{role.label || role.name}</h2>
          </div>
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={onCancel}
          >
            Close
          </button>
        </div>

        <p className="text-sm text-slate-600">
          This role will be removed for everyone. Are you sure you want to
          continue?
        </p>

        <div className="rolepermission-actions rolepermission-modal-footer">
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rolepermission-btn ghost danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete role"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RoleDeleteModal;
