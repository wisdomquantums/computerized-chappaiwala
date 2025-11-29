import { useLocation } from "react-router-dom";

const DEFAULT_WHATSAPP_NUMBER = "+917488986015";
const DEFAULT_WHATSAPP_MESSAGE =
  "Hi! I want to know more about Computerized Chhappaiwala services.";

const buildWhatsappLink = (number, message) => {
  if (!number) return null;
  const sanitized = String(number).replace(/[^0-9]/g, "");
  if (!sanitized) return null;
  const base = `https://wa.me/${sanitized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

const FloatingWhatsAppButton = () => {
  const location = useLocation();
  if (location.pathname?.startsWith("/admin")) {
    return null;
  }
  const number =
    import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const message =
    import.meta.env.VITE_WHATSAPP_MESSAGE || DEFAULT_WHATSAPP_MESSAGE;
  const whatsappLink = buildWhatsappLink(number, message);

  if (!whatsappLink) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed z-50 inline-flex items-center justify-center text-white transition rounded-full shadow-2xl right-5 bottom-5 h-14 w-14 bg-emerald-500 shadow-emerald-400/40 hover:scale-105 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
      aria-label="Chat with us on WhatsApp"
    >
      <i className="text-2xl fab fa-whatsapp" aria-hidden="true" />
    </a>
  );
};

export default FloatingWhatsAppButton;
