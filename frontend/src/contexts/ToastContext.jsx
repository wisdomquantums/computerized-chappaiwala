import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ToastStack from "../components/ui/ToastStack";

const ToastContext = createContext({
  showToast: () => undefined,
  hideToast: () => undefined,
});

const randomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      if (!message) {
        return null;
      }
      const id = randomId();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (duration) {
        timersRef.current[id] = setTimeout(() => hideToast(id), duration);
      }
      return id;
    },
    [hideToast]
  );

  useEffect(
    () => () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
