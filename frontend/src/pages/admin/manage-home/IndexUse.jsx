import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createHomeSectionItem,
  deleteHomeSectionItem,
  fetchHomeSections,
  updateHomeSectionItem,
} from "../../../features/home/homeSlice";
import {
  HOME_SECTION_KEYS,
  HOME_SECTION_ORDER,
  sectionCopy,
} from "./constants";
import { HOME_CONTENT_REFRESH_EVENT } from "../../../constants/home";

const emptyForm = (section) => ({
  id: null,
  section,
  title: "",
  subtitle: "",
  description: "",
  badge: "",
  value: "",
  detail: "",
  price: "",
  image: "",
  linkLabel: "",
  linkUrl: "",
  secondaryLabel: "",
  secondaryUrl: "",
  sortOrder: 0,
  status: "active",
});

const trimValue = (value) =>
  typeof value === "string" ? value.trim() : value ?? "";

const normalizeFormFromRecord = (record) => ({
  id: record?.id ?? null,
  section: record?.section ?? HOME_SECTION_KEYS.HERO,
  title: record?.title ?? "",
  subtitle: record?.subtitle ?? "",
  description: record?.description ?? "",
  badge: record?.badge ?? "",
  value: record?.value ?? "",
  detail: record?.detail ?? "",
  price: record?.price ?? "",
  image: record?.image ?? "",
  linkLabel: record?.linkLabel ?? "",
  linkUrl: record?.linkUrl ?? "",
  secondaryLabel: record?.secondaryLabel ?? "",
  secondaryUrl: record?.secondaryUrl ?? "",
  sortOrder: record?.sortOrder ?? 0,
  status: record?.status ?? "active",
});

const buildPayload = (form) => ({
  section: form.section,
  title: trimValue(form.title),
  subtitle: trimValue(form.subtitle),
  description: trimValue(form.description),
  badge: trimValue(form.badge),
  value: trimValue(form.value),
  detail: trimValue(form.detail),
  price: trimValue(form.price),
  image: trimValue(form.image),
  linkLabel: trimValue(form.linkLabel),
  linkUrl: trimValue(form.linkUrl),
  secondaryLabel: trimValue(form.secondaryLabel),
  secondaryUrl: trimValue(form.secondaryUrl),
  sortOrder: Number(form.sortOrder) || 0,
  status: trimValue(form.status) || "active",
});

const broadcastHomeRefresh = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HOME_CONTENT_REFRESH_EVENT));
};

export const useManageHome = () => {
  const dispatch = useDispatch();
  const { records, loading, error, deletingId } = useSelector(
    (state) => state.home
  );

  const [activeSection, setActiveSection] = useState(HOME_SECTION_KEYS.HERO);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [form, setForm] = useState(() => emptyForm(HOME_SECTION_KEYS.HERO));
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const tabs = HOME_SECTION_ORDER.map((key) => ({
    key,
    ...sectionCopy[key],
  }));

  const currentConfig = sectionCopy[activeSection];

  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);

  useEffect(() => {
    setForm(() => ({
      ...emptyForm(activeSection),
      section: activeSection,
    }));
    setFormError(null);
  }, [activeSection]);

  const sectionItems = useMemo(() => {
    return records
      .filter((item) => item.section === activeSection)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [records, activeSection]);

  const handleTabChange = (key) => {
    setActiveSection(key);
    setModalOpen(false);
    setModalMode("add");
    setStatusMessage(null);
  };

  const openAddModal = () => {
    setForm(emptyForm(activeSection));
    setModalMode("add");
    setFormError(null);
    setModalOpen(true);
  };

  const handleEditEntry = (entry) => {
    setForm(normalizeFormFromRecord(entry));
    setModalMode("edit");
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    if (!currentConfig) return true;
    const missingField = currentConfig.fields.find(
      (field) => field.required && !trimValue(form[field.name])
    );
    if (missingField) {
      setFormError(`${missingField.label} is required.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setFormError(null);
    setStatusMessage(null);

    const payload = buildPayload({ ...form, section: activeSection });
    const isEditing = modalMode === "edit" && form.id;
    try {
      if (isEditing) {
        await dispatch(
          updateHomeSectionItem({ id: form.id, ...payload })
        ).unwrap();
        setStatusMessage("Entry updated.");
        broadcastHomeRefresh();
      } else {
        await dispatch(createHomeSectionItem(payload)).unwrap();
        setStatusMessage("Entry added to homepage.");
        broadcastHomeRefresh();
      }
      setModalOpen(false);
    } catch (submitError) {
      setFormError(submitError?.message || "Unable to save entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entry) => {
    if (!entry?.id) return;
    const confirmDelete = window.confirm(
      `Delete "${entry.title || "entry"}" from ${currentConfig?.label}?`
    );
    if (!confirmDelete) return;
    try {
      await dispatch(deleteHomeSectionItem(entry.id)).unwrap();
      setStatusMessage("Entry removed.");
      broadcastHomeRefresh();
    } catch (deleteError) {
      setStatusMessage(
        deleteError?.message || "Unable to delete this entry right now."
      );
    }
  };

  const refresh = () => {
    dispatch(fetchHomeSections());
  };

  return {
    tabs,
    activeSection,
    setActiveSection: handleTabChange,
    currentConfig,
    items: sectionItems,
    loading,
    error,
    statusMessage,
    modalOpen,
    modalMode,
    form,
    formError,
    submitting,
    deletingId,
    actions: {
      openAddModal,
      handleEditEntry,
      closeModal,
      handleFieldChange,
      handleSubmit,
      handleDeleteEntry,
      refresh,
    },
  };
};
