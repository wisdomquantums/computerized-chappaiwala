import "./Modal.css";

const LogoutModal = ({ open, onCancel, onConfirm }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onCancel}
        >
          &times;
        </button>
        <div
          className="modal-icon"
          style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
        >
          !
        </div>
        <h2 className="modal-title">Ready to log out?</h2>
        <p className="modal-message">
          For security reasons we recommend logging out if you are done for the
          day. You can always log back in to continue where you left off.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-button is-ghost"
            onClick={onCancel}
          >
            Stay logged in
          </button>
          <button
            type="button"
            className="modal-button is-danger"
            onClick={onConfirm}
          >
            Logout now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
