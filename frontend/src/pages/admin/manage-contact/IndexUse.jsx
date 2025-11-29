import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactCards,
  fetchContactPage,
  createContactCard,
  updateContactCard,
  deleteContactCard,
  updateContactPage,
} from "../../../features/contact/contactSlice";

export const iconOptions = [
  { label: "Location", value: "location" },
  { label: "Phone", value: "phone" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
];

export const actionTypeOptions = [
  { label: "No action", value: "" },
  { label: "Open link", value: "link" },
  { label: "Phone call", value: "tel" },
  { label: "Mailto", value: "mailto" },
  { label: "WhatsApp", value: "whatsapp" },
];

export const MIN_LINES = 1;
export const MAX_LINES = 5;

const defaultCardForm = {
  title: "",
  eyebrow: "Contact",
  iconKey: iconOptions[0].value,
  actionType: "",
  actionLabel: "",
  actionHref: "",
  sortOrder: "",
};

const defaultPageForm = {
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",
  messageTitle: "",
  messageDescription: "",
  mapEmbedUrl: "",
  openingEyebrow: "",
  openingTitle: "",
  openingDescription: "",
  formWhatsappLabel: "",
  formWhatsappLink: "",
  ctaEyebrow: "",
  ctaTitle: "",
  ctaDescription: "",
  primaryCtaLabel: "",
  primaryCtaLink: "",
  secondaryCtaLabel: "",
  secondaryCtaLink: "",
};

const ensureLineFieldCount = (seed) => {
  const base = Array.isArray(seed) ? seed.slice(0, MAX_LINES) : [];
  const hydrated = base.length ? base : Array(MIN_LINES).fill("");
  while (hydrated.length < MIN_LINES) {
    hydrated.push("");
  }
  return hydrated;
};

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

export const headerFieldConfig = [
  {
    name: "heroEyebrow",
    label: "Hero eyebrow",
    placeholder: "Contact Us",
  },
  {
    name: "heroTitle",
    label: "Hero title",
    placeholder: "We’re here to help you with your printing needs",
  },
  {
    name: "heroDescription",
    label: "Hero description",
    type: "textarea",
    placeholder:
      "Reach out for wedding cards, commercial stationery, bulk flex printing...",
  },
];

export const detailFieldGroups = [
  {
    id: "message",
    title: "Message & map embeds",
    fields: [
      {
        name: "messageTitle",
        label: "Message section title",
        placeholder: "Send us a message",
      },
      {
        name: "messageDescription",
        label: "Message section description",
        type: "textarea",
        placeholder: "Share project details, delivery timelines...",
      },
      {
        name: "mapEmbedUrl",
        label: "Google Maps iframe URL",
        type: "textarea",
        placeholder: "https://www.google.com/maps/embed?...",
      },
    ],
  },
  {
    id: "hours",
    title: "Opening hours",
    fields: [
      {
        name: "openingEyebrow",
        label: "Eyebrow label",
        placeholder: "Opening Hours",
      },
      {
        name: "openingTitle",
        label: "Title",
        placeholder: "Mon–Sun: 9:00 AM – 9:00 PM",
      },
      {
        name: "openingDescription",
        label: "Description",
        type: "textarea",
        placeholder:
          "No holiday. Drop in anytime with your brief or call ahead.",
      },
    ],
  },
  {
    id: "form-cta",
    title: "Form WhatsApp CTA",
    fields: [
      {
        name: "formWhatsappLabel",
        label: "Button label",
        placeholder: "WhatsApp Direct Chat",
      },
      {
        name: "formWhatsappLink",
        label: "Button link",
        placeholder: "https://wa.me/91XXXXXXXXXX",
      },
    ],
  },
  {
    id: "banner",
    title: "Bottom CTA banner",
    fields: [
      {
        name: "ctaEyebrow",
        label: "CTA eyebrow",
        placeholder: "Need fast and reliable printing?",
      },
      {
        name: "ctaTitle",
        label: "CTA title",
        placeholder: "Need fast and reliable printing? Contact us today!",
      },
      {
        name: "ctaDescription",
        label: "CTA description",
        type: "textarea",
        placeholder:
          "Wedding suites, corporate stationery, flex banners, and more...",
      },
      {
        name: "primaryCtaLabel",
        label: "Primary CTA label",
        placeholder: "Call Now",
      },
      {
        name: "primaryCtaLink",
        label: "Primary CTA link",
        placeholder: "tel:+91XXXXXXXXXX",
      },
      {
        name: "secondaryCtaLabel",
        label: "Secondary CTA label",
        placeholder: "WhatsApp",
      },
      {
        name: "secondaryCtaLink",
        label: "Secondary CTA link",
        placeholder: "https://wa.me/91XXXXXXXXXX",
      },
    ],
  },
];

export const headerFieldKeys = headerFieldConfig.map((field) => field.name);
export const detailFieldKeys = detailFieldGroups.flatMap((group) =>
  group.fields.map((field) => field.name)
);

export const useManageContactCards = () => {
  const dispatch = useDispatch();
  const { cards, cardsLoading, cardsError } = useSelector(
    (state) => state.contact
  );

  const [form, setForm] = useState(defaultCardForm);
  const [lineFields, setLineFields] = useState(() => ensureLineFieldCount([]));
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContactCards());
  }, [dispatch]);

  const resetForm = () => {
    setForm(defaultCardForm);
    setLineFields(ensureLineFieldCount([]));
    setEditingId(null);
    setFormError(null);
  };

  const openAddPanel = () => {
    resetForm();
    setPanelMode("add");
    setPanelOpen(true);
  };

  const closePanel = () => {
    resetForm();
    setPanelOpen(false);
    setPanelMode("add");
    setSubmitting(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleLineChange = (index, value) => {
    setLineFields((prev) => {
      if (index < 0 || index >= MAX_LINES) return prev;
      const next = [...prev];
      while (next.length <= index && next.length < MAX_LINES) {
        next.push("");
      }
      next[index] = value;
      return next;
    });
    if (formError) setFormError(null);
  };

  const handleAddLineField = () => {
    setLineFields((prev) => {
      if (prev.length >= MAX_LINES) return prev;
      return [...prev, ""];
    });
  };

  const handleRemoveLineField = (index) => {
    setLineFields((prev) => {
      if (prev.length <= MIN_LINES) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const buildPayload = () => {
    const lines = lineFields.map(cleanString).filter(Boolean);
    const title = cleanString(form.title);
    if (!title) {
      setFormError("Title is required.");
      return null;
    }
    if (!lines.length) {
      setFormError("Add at least one detail line.");
      return null;
    }

    const payload = {
      title,
      eyebrow: cleanString(form.eyebrow) || "Contact",
      iconKey: form.iconKey || iconOptions[0].value,
      lines,
      actionType: form.actionType || null,
      actionLabel: cleanString(form.actionLabel) || null,
      actionHref: cleanString(form.actionHref) || null,
    };

    if (form.sortOrder !== "" && form.sortOrder !== null) {
      const parsed = Number(form.sortOrder);
      if (Number.isFinite(parsed)) {
        payload.sortOrder = parsed;
      }
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await dispatch(
          updateContactCard({ id: editingId, ...payload })
        ).unwrap();
      } else {
        await dispatch(createContactCard(payload)).unwrap();
      }
      closePanel();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to save contact card.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (card) => {
    if (!card?.id) return;
    setForm({
      title: card.title || "",
      eyebrow: card.eyebrow || "Contact",
      iconKey: card.iconKey || iconOptions[0].value,
      actionType: card.actionType || "",
      actionLabel: card.actionLabel || "",
      actionHref: card.actionHref || "",
      sortOrder:
        typeof card.sortOrder === "number" && Number.isFinite(card.sortOrder)
          ? String(card.sortOrder)
          : "",
    });
    setLineFields(
      ensureLineFieldCount(card.lines && card.lines.length ? card.lines : [""])
    );
    setPanelMode("edit");
    setPanelOpen(true);
    setEditingId(card.id);
    setFormError(null);
  };

  const handleDelete = async (card) => {
    if (!card?.id) return;
    const confirmed = window.confirm(
      `Delete "${card.title || "contact card"}"?`
    );
    if (!confirmed) return;
    try {
      await dispatch(deleteContactCard(card.id)).unwrap();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to delete contact card.";
      setFormError(message);
    }
  };

  return {
    cards,
    cardsLoading,
    cardsError,
    form,
    lineFields,
    panelOpen,
    panelMode,
    submitting,
    formError,
    openAddPanel,
    closePanel,
    handleChange,
    handleLineChange,
    handleAddLineField,
    handleRemoveLineField,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export const useContactPageCopy = () => {
  const dispatch = useDispatch();
  const { pageContent, pageLoading, pageError } = useSelector(
    (state) => state.contact
  );

  const [form, setForm] = useState(defaultPageForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContactPage());
  }, [dispatch]);

  useEffect(() => {
    setForm({ ...defaultPageForm, ...(pageContent || {}) });
  }, [pageContent]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status) setStatus(null);
  };

  const handleResetForm = () => {
    setForm({ ...defaultPageForm, ...(pageContent || {}) });
    setStatus(null);
  };

  const handleSaveFields = async (fields) => {
    const payload = fields.reduce((acc, field) => {
      acc[field] = form[field] ?? "";
      return acc;
    }, {});

    setSubmitting(true);
    setStatus(null);
    try {
      await dispatch(updateContactPage(payload)).unwrap();
      setStatus("Contact page copy saved.");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to save content.";
      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    pageLoading,
    pageError,
    status,
    submitting,
    handleFieldChange,
    handleResetForm,
    handleSaveFields,
  };
};
