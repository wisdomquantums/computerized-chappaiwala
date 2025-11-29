import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../../features/services/servicesSlice";

export const serviceOptions = [
  { label: "Shaadi Card", value: "Shaadi Card", iconKey: "wedding" },
  { label: "Cash Memo", value: "Cash Memo", iconKey: "cash" },
  { label: "Letter Pad", value: "Letter Pad", iconKey: "letter" },
  { label: "Hand Bill", value: "Hand Bill", iconKey: "handbill" },
  { label: "Calendar", value: "Calendar", iconKey: "calendar" },
  { label: "Custom Design", value: "Custom Design", iconKey: "custom" },
];

export const MIN_GALLERY = 1;
export const MAX_GALLERY = 7;

const iconKeyByCategory = serviceOptions.reduce((acc, option) => {
  acc[option.value] = option.iconKey;
  return acc;
}, {});

export const defaultFormState = {
  category: serviceOptions[0].value,
  title: "",
  description: "",
  rating: "4.7",
  reviewCount: "138",
  paperChargeValue: "",
  paperChargeSuffix: "/ pad",
  printChargeValue: "",
  printChargeSuffix: "/ page",
  unitLabel: "/ pad",
  supportWindow: "24-72 hrs",
};

export const formatChargeLabel = (value, suffix) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  const cleanSuffix = suffix?.trim() || "";
  return `₹${numeric} ${cleanSuffix}`.trim();
};

export const formatPriceLabel = (value, unitLabel) => {
  if (!Number.isFinite(value) || value <= 0) return "--";
  const cleanUnit = unitLabel?.trim() || "";
  return `₹${value} ${cleanUnit}`.trim();
};

const createDefaultGalleryFields = () =>
  Array.from({ length: MIN_GALLERY }, () => "");

const parseSuffix = (label, fallback) => {
  if (!label) return fallback;
  const match = label.match(/₹?\s*[\d.,]+\s*(.*)/i);
  return match && match[1] ? match[1].trim() : fallback;
};

const parseNumericString = (explicitValue, label) => {
  if (typeof explicitValue === "number" && !Number.isNaN(explicitValue)) {
    return String(explicitValue);
  }
  const match = label?.match(/([\d.]+)/);
  return match ? match[1] : "";
};

const coerceGalleryArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const ensureGalleryFieldCount = (sourceInput = []) => {
  const base = coerceGalleryArray(sourceInput);
  const trimmed = base.slice(0, MAX_GALLERY);
  while (trimmed.length < MIN_GALLERY) {
    trimmed.push("");
  }
  return trimmed;
};

const getFinalPriceFromService = (service) => {
  if (
    typeof service?.basePrice === "number" &&
    !Number.isNaN(service.basePrice)
  ) {
    return service.basePrice;
  }
  const paper =
    typeof service?.paperChargeValue === "number" &&
    !Number.isNaN(service.paperChargeValue)
      ? service.paperChargeValue
      : 0;
  const print =
    typeof service?.printChargeValue === "number" &&
    !Number.isNaN(service.printChargeValue)
      ? service.printChargeValue
      : 0;
  const sum = paper + print;
  return sum > 0 ? sum : null;
};

export const useManageServices = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.services);

  const [form, setForm] = useState(defaultFormState);
  const [galleryFields, setGalleryFields] = useState(() =>
    createDefaultGalleryFields()
  );
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("add");

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const finalPriceValue = useMemo(() => {
    const paper = Number(form.paperChargeValue);
    const print = Number(form.printChargeValue);
    const safePaper = Number.isFinite(paper) ? paper : 0;
    const safePrint = Number.isFinite(print) ? print : 0;
    const sum = safePaper + safePrint;
    return sum > 0 ? sum : null;
  }, [form.paperChargeValue, form.printChargeValue]);

  const finalPriceLabel = useMemo(
    () => formatPriceLabel(finalPriceValue, form.unitLabel),
    [finalPriceValue, form.unitLabel]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleGalleryChange = (index, value) => {
    setGalleryFields((prev) => {
      if (index < 0 || index >= MAX_GALLERY) {
        return prev;
      }
      const next = [...prev];
      while (next.length <= index && next.length < MAX_GALLERY) {
        next.push("");
      }
      next[index] = value;
      return next;
    });
  };

  const handleAddGalleryField = () => {
    setGalleryFields((prev) => {
      if (prev.length >= MAX_GALLERY) return prev;
      return [...prev, ""];
    });
  };

  const handleRemoveGalleryField = (index) => {
    setGalleryFields((prev) => {
      if (prev.length <= MIN_GALLERY) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setGalleryFields(createDefaultGalleryFields());
    setEditingId(null);
    setFormError(null);
  };

  const closePanel = () => {
    resetForm();
    setPanelOpen(false);
    setPanelMode("add");
  };

  const openAddPanel = () => {
    resetForm();
    setPanelMode("add");
    setPanelOpen(true);
  };

  const validateAndBuildPayload = () => {
    const galleryUrls = galleryFields.map((url) => url.trim()).filter(Boolean);
    if (galleryUrls.length < MIN_GALLERY || galleryUrls.length > MAX_GALLERY) {
      setFormError(
        `Please provide between ${MIN_GALLERY} and ${MAX_GALLERY} image URLs.`
      );
      return null;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    if (!title || !description) {
      setFormError("Title and description are required.");
      return null;
    }

    const ratingValue = Number(form.rating);
    if (!Number.isFinite(ratingValue) || ratingValue <= 0 || ratingValue > 5) {
      setFormError("Rating must be between 0 and 5.");
      return null;
    }

    const reviewCountValue = Number(form.reviewCount);
    if (!Number.isFinite(reviewCountValue) || reviewCountValue < 0) {
      setFormError("Review count must be a positive number.");
      return null;
    }

    const paperChargeValueNum = Number(form.paperChargeValue);
    const printChargeValueNum = Number(form.printChargeValue);
    if (!Number.isFinite(paperChargeValueNum) || paperChargeValueNum <= 0) {
      setFormError("Paper charge amount must be greater than 0.");
      return null;
    }
    if (!Number.isFinite(printChargeValueNum) || printChargeValueNum <= 0) {
      setFormError("Print charge amount must be greater than 0.");
      return null;
    }

    const supportWindow = form.supportWindow.trim();
    if (!supportWindow) {
      setFormError("Support window is required.");
      return null;
    }

    const unitLabel = form.unitLabel.trim();

    const payload = {
      category: form.category,
      title,
      description,
      rating: Number(ratingValue.toFixed(1)),
      reviewCount: Math.round(reviewCountValue),
      paperChargeValue: paperChargeValueNum,
      printChargeValue: printChargeValueNum,
      paperCharge: formatChargeLabel(
        paperChargeValueNum,
        form.paperChargeSuffix
      ),
      printCharge: formatChargeLabel(
        printChargeValueNum,
        form.printChargeSuffix
      ),
      unitLabel,
      supportWindow,
      gallery: galleryUrls,
      image: galleryUrls[0],
      iconKey: iconKeyByCategory[form.category] || "default",
      basePrice: finalPriceValue,
      priceLabel: finalPriceLabel !== "--" ? finalPriceLabel : null,
    };

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = validateAndBuildPayload();
    if (!payload) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await dispatch(updateService({ id: editingId, ...payload })).unwrap();
      } else {
        await dispatch(createService(payload)).unwrap();
      }
      closePanel();
    } catch (submitError) {
      const message =
        typeof submitError === "string" ? submitError : submitError?.message;
      setFormError(message || "Unable to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    if (!service?.id) return;
    const gallerySeed = service.gallery?.length
      ? coerceGalleryArray(service.gallery)
      : service.image
      ? [service.image]
      : [];
    setGalleryFields(ensureGalleryFieldCount(gallerySeed));
    setForm({
      category: service.category || serviceOptions[0].value,
      title: service.title || service.name || "",
      description: service.description || "",
      rating:
        typeof service.rating === "number" && !Number.isNaN(service.rating)
          ? String(service.rating)
          : "",
      reviewCount:
        typeof service.reviewCount === "number" &&
        !Number.isNaN(service.reviewCount)
          ? String(service.reviewCount)
          : "",
      paperChargeValue: parseNumericString(
        service.paperChargeValue,
        service.paperCharge
      ),
      paperChargeSuffix:
        parseSuffix(service.paperCharge, defaultFormState.paperChargeSuffix) ||
        defaultFormState.paperChargeSuffix,
      printChargeValue: parseNumericString(
        service.printChargeValue,
        service.printCharge
      ),
      printChargeSuffix:
        parseSuffix(service.printCharge, defaultFormState.printChargeSuffix) ||
        defaultFormState.printChargeSuffix,
      unitLabel: service.unitLabel || defaultFormState.unitLabel,
      supportWindow: service.supportWindow || defaultFormState.supportWindow,
    });
    setEditingId(service.id);
    setPanelMode("edit");
    setPanelOpen(true);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this service?")) return;
    try {
      await dispatch(deleteService(id)).unwrap();
      if (editingId === id) {
        closePanel();
      }
    } catch (deleteError) {
      const message =
        typeof deleteError === "string" ? deleteError : deleteError?.message;
      setFormError(message || "Unable to delete service");
    }
  };

  return {
    list,
    loading,
    error,
    form,
    galleryFields,
    formError,
    submitting,
    panelOpen,
    panelMode,
    finalPriceLabel,
    openAddPanel,
    closePanel,
    handleChange,
    handleGalleryChange,
    handleAddGalleryField,
    handleRemoveGalleryField,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export { getFinalPriceFromService };
