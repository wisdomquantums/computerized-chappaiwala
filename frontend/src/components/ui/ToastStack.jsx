import { createPortal } from "react-dom";
import "./ToastStack.css";

const iconMap = {
  success: "✔",
  error: "✕",
  info: "ℹ",
  warning: "!",
};

const ToastStack = ({ toasts, onDismiss }) => {
  if (!toasts.length) {
    return null;
  }

  return createPortal(
    <div className="toast-stack" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const showMessage = toast.message && toast.message !== toast.title;
        return (
          <div key={toast.id} className={`toast-card ${toast.type}`}>
            <div className="toast-card-icon" aria-hidden="true">
              {iconMap[toast.type] || iconMap.info}
            </div>
            <div className="toast-card-body">
              {toast.title && <p className="toast-card-title">{toast.title}</p>}
              {showMessage && (
                <p className="toast-card-message">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              className="toast-card-dismiss"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default ToastStack;
