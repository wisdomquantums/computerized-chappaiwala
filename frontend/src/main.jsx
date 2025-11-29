import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import store from "./app/store";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ScrollToTop from "./components/ui/ScrollToTop.jsx";
import FloatingWhatsAppButton from "./components/ui/FloatingWhatsAppButton.jsx";
import InquiryForm from "./components/ui/InquiryForm.jsx";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <InquiryForm />
          <FloatingWhatsAppButton />
          <App />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  </StrictMode>
);
