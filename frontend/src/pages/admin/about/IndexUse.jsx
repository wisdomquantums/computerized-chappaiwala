import { useMemo, useState } from "react";
import useAboutSection from "../../../hooks/useAboutSection";

const toNumber = (value, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const defaultSort = (a = {}, b = {}) => {
  const orderA = toNumber(a.sortOrder);
  const orderB = toNumber(b.sortOrder);
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  const timeA = new Date(a.createdAt || 0).getTime();
  const timeB = new Date(b.createdAt || 0).getTime();
  return timeA - timeB;
};

const resolveDefaults = (defaults) => () =>
  typeof defaults === "function" ? defaults() : { ...(defaults || {}) };

const useAboutSectionPanel = (sectionKey, config = {}) => {
  const aboutHook = useAboutSection(sectionKey);
  const {
    itemDefaults = {},
    mapItemToForm,
    mapFormToPayload,
    validateForm,
    sortFn = defaultSort,
    deleteMessage,
    fields = [],
    addMeta = {},
    editMeta = {},
  } = config;

  const getDefaults = resolveDefaults(itemDefaults);
  const [form, setForm] = useState(getDefaults);
  const [panelMode, setPanelMode] = useState("add");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const sortedItems = useMemo(() => {
    const list = aboutHook.items || [];
    return [...list].sort(sortFn);
  }, [aboutHook.items, sortFn]);

  const closePanel = () => {
    setPanelOpen(false);
    setPanelMode("add");
    setActiveId(null);
    setForm(getDefaults());
    setFormError(null);
    setSubmitting(false);
  };

  const openAddPanel = () => {
    setForm(getDefaults());
    setPanelMode("add");
    setPanelOpen(true);
    setActiveId(null);
    setFormError(null);
  };

  const openEditPanel = (item) => {
    if (!item) return;
    const mapped = mapItemToForm ? mapItemToForm(item) : { ...item };
    setForm(mapped);
    setPanelMode("edit");
    setPanelOpen(true);
    setActiveId(item.id);
    setFormError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (validateForm) {
      const validationError = validateForm(form);
      if (validationError) {
        setFormError(validationError);
        return;
      }
    }

    const payload = mapFormToPayload ? mapFormToPayload(form) : form;
    setSubmitting(true);
    try {
      if (panelMode === "edit" && activeId) {
        await aboutHook.updateItem(activeId, payload);
      } else {
        await aboutHook.createItem(payload);
      }
      closePanel();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to save entry.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (
    id,
    message = deleteMessage || "Delete this entry?"
  ) => {
    if (!id) return;
    if (typeof window !== "undefined" && !window.confirm(message)) {
      return;
    }
    try {
      await aboutHook.deleteItem(id);
      if (activeId === id) {
        closePanel();
      }
    } catch (error) {
      const messageText =
        typeof error === "string"
          ? error
          : error?.message || "Unable to delete entry.";
      setFormError(messageText);
    }
  };

  return {
    ...aboutHook,
    sortedItems,
    openAddPanel,
    openEditPanel,
    handleDelete,
    modalState: {
      panelMode,
      panelOpen,
      form,
      formError,
      submitting,
      onClose: closePanel,
      onSubmit: handleSubmit,
      onChange: handleChange,
    },
    modalMeta: {
      fields,
      addMeta,
      editMeta,
    },
  };
};

export default useAboutSectionPanel;
