import "./Modal.css";

const SuccessModal = ({
  open,
  title = "Action completed",
  message = "Everything went through as expected.",
  primaryLabel = "Continue",
  onPrimary,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div
          className="modal-icon"
          style={{ background: "rgba(16,185,129,0.15)", color: "#059669" }}
        >
          ✓
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-button is-primary"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
