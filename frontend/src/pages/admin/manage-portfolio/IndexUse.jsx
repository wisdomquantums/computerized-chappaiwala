import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PORTFOLIO_GALLERY_LIMITS, PORTFOLIO_SECTION_IDS } from "./constants";
import {
  addPortfolioItem,
  createPortfolioListItem,
  deletePortfolioItem,
  deletePortfolioListItem,
  fetchPortfolio,
  fetchPortfolioPage,
  updatePortfolioItem,
  updatePortfolioListItem,
  updatePortfolioPage,
} from "../../../features/portfolio/portfolioSlice";

export const LIST_TYPES = {
  TRUST: "trust",
  IDEAS: "ideas",
};

const defaultPageForm = {
  heroTagline: "",
  heroTitle: "",
  heroDescription: "",
  trustTitle: "",
  trustDescription: "",
  ideasTitle: "",
  ideasDescription: "",
  ctaEyebrow: "",
  ctaTitle: "",
  ctaDescription: "",
  primaryCtaLabel: "",
  primaryCtaLink: "",
  secondaryCtaLabel: "",
  secondaryCtaLink: "",
};

const emptyListForm = {
  title: "",
  description: "",
  sortOrder: 0,
};

export const listSectionCopy = {
  [LIST_TYPES.TRUST]: {
    meta: "Portfolio section",
    title: "Trust highlights",
    subtitle:
      "These appear as checkmark cards below the hero. Keep them short and benefit-focused.",
    empty: "No trust highlights saved yet.",
    sectionId: PORTFOLIO_SECTION_IDS.TRUST,
  },
  [LIST_TYPES.IDEAS]: {
    meta: "Portfolio section",
    title: "Content ideas",
    subtitle:
      "Ideas help your team refresh the gallery every month. Add as many as you like and order them.",
    empty: "No content ideas saved yet.",
    sectionId: PORTFOLIO_SECTION_IDS.IDEAS,
  },
};

const buildPageForm = (content) => ({
  ...defaultPageForm,
  ...(content || {}),
});

const getDefaultProjectForm = () => ({
  id: null,
  title: "",
  category: "",
  description: "",
  image: "",
  gallery: [""],
});

const makeListFormState = () => ({
  [LIST_TYPES.TRUST]: { ...emptyListForm },
  [LIST_TYPES.IDEAS]: { ...emptyListForm },
});

const trimValue = (value) =>
  typeof value === "string" ? value.trim() : value || "";

const normalizeGalleryForEdit = (project) => {
  if (Array.isArray(project?.gallery) && project.gallery.length) {
    return [...project.gallery];
  }
  if (project?.image) {
    return [project.image];
  }
  return [""];
};

export const pageFieldConfig = [
  {
    label: "Hero Tagline",
    name: "heroTagline",
    placeholder: "Our Work / Portfolio",
  },
  {
    label: "Hero Title",
    name: "heroTitle",
    placeholder: "See our latest printing and design work",
  },
  {
    label: "Hero Description",
    name: "heroDescription",
    placeholder: "Handpicked print samples across categories...",
    type: "textarea",
  },
  {
    label: "Trust Section Title",
    name: "trustTitle",
    placeholder: "Why you should view our work",
  },
  {
    label: "Trust Section Description",
    name: "trustDescription",
    placeholder: "Every sample is printed, finished...",
    type: "textarea",
  },
  {
    label: "Ideas Section Title",
    name: "ideasTitle",
    placeholder: "Content ideas to keep your portfolio fresh",
  },
  {
    label: "Ideas Section Description",
    name: "ideasDescription",
    placeholder: "Rotate these buckets each month...",
    type: "textarea",
  },
  {
    label: "CTA Eyebrow",
    name: "ctaEyebrow",
    placeholder: "Need similar designs?",
  },
  {
    label: "CTA Title",
    name: "ctaTitle",
    placeholder: "Want similar design for your business or event?",
  },
  {
    label: "CTA Description",
    name: "ctaDescription",
    placeholder: "Share your requirement...",
    type: "textarea",
  },
  {
    label: "Primary CTA Label",
    name: "primaryCtaLabel",
    placeholder: "Contact Us",
  },
  {
    label: "Primary CTA Link",
    name: "primaryCtaLink",
    placeholder: "/contact",
  },
  {
    label: "Secondary CTA Label",
    name: "secondaryCtaLabel",
    placeholder: "WhatsApp Now",
  },
  {
    label: "Secondary CTA Link",
    name: "secondaryCtaLink",
    placeholder: "https://wa.me/91XXXXXXXXXX",
  },
];

export const useManagePortfolio = () => {
  const dispatch = useDispatch();
  const {
    list,
    loading,
    error,
    pageContent,
    trustHighlights,
    contentIdeas,
    pageLoading,
    pageError,
  } = useSelector((state) => state.portfolio);

  const [projectForm, setProjectForm] = useState(() => getDefaultProjectForm());
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState("add");
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectFormError, setProjectFormError] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);

  const [pageForm, setPageForm] = useState(() => buildPageForm(null));
  const [pageSubmitting, setPageSubmitting] = useState(false);
  const [pageStatus, setPageStatus] = useState(null);

  const [listForms, setListForms] = useState(() => makeListFormState());
  const [editingListId, setEditingListId] = useState({
    [LIST_TYPES.TRUST]: null,
    [LIST_TYPES.IDEAS]: null,
  });
  const [listSubmitting, setListSubmitting] = useState({
    [LIST_TYPES.TRUST]: false,
    [LIST_TYPES.IDEAS]: false,
  });
  const [listStatus, setListStatus] = useState({
    [LIST_TYPES.TRUST]: null,
    [LIST_TYPES.IDEAS]: null,
  });

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioPage());
  }, [dispatch]);

  useEffect(() => {
    setPageForm(buildPageForm(pageContent));
  }, [pageContent]);

  const sortedTrustHighlights = useMemo(() => {
    return [...(trustHighlights || [])].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
  }, [trustHighlights]);

  const sortedContentIdeas = useMemo(() => {
    return [...(contentIdeas || [])].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
  }, [contentIdeas]);

  const resetProjectForm = () => {
    setProjectForm(getDefaultProjectForm());
    setProjectFormError(null);
  };

  const openAddPanel = () => {
    resetProjectForm();
    setProjectModalMode("add");
    setProjectModalOpen(true);
  };

  const handleEditProject = (project) => {
    if (!project) return;
    setProjectForm({
      id: project.id,
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      image: project.image || "",
      gallery: normalizeGalleryForEdit(project),
    });
    setProjectModalMode("edit");
    setProjectModalOpen(true);
    setProjectFormError(null);
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setProjectModalMode("add");
    resetProjectForm();
  };

  const handleProjectFieldChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
    if (projectFormError) setProjectFormError(null);
  };

  const handleGalleryChange = (index, value) => {
    setProjectForm((prev) => {
      const gallery = Array.isArray(prev.gallery) ? [...prev.gallery] : [""];
      gallery[index] = value;
      return { ...prev, gallery };
    });
  };

  const handleAddGalleryField = () => {
    setProjectForm((prev) => {
      const current = Array.isArray(prev.gallery) ? prev.gallery : [""];
      if (current.length >= PORTFOLIO_GALLERY_LIMITS.MAX) {
        return prev;
      }
      return {
        ...prev,
        gallery: [...current, ""],
      };
    });
  };

  const handleRemoveGalleryField = (index) => {
    setProjectForm((prev) => {
      const gallery = Array.isArray(prev.gallery) ? [...prev.gallery] : [""];
      if (gallery.length <= 1) return prev;
      gallery.splice(index, 1);
      return { ...prev, gallery };
    });
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setProjectSubmitting(true);
    setProjectFormError(null);
    setProjectStatus(null);

    const payload = {
      title: trimValue(projectForm.title),
      category: trimValue(projectForm.category),
      description: trimValue(projectForm.description),
      image: trimValue(projectForm.image),
      gallery: (projectForm.gallery || [])
        .map((url) => trimValue(url))
        .filter(Boolean),
    };

    if (!payload.title || !payload.category) {
      setProjectFormError("Title and category are required.");
      setProjectSubmitting(false);
      return;
    }

    if (!payload.gallery.length) {
      setProjectFormError(
        `Add at least ${PORTFOLIO_GALLERY_LIMITS.MIN} gallery image.`
      );
      setProjectSubmitting(false);
      return;
    }

    if (payload.gallery.length > PORTFOLIO_GALLERY_LIMITS.MAX) {
      setProjectFormError(
        `You can upload a maximum of ${PORTFOLIO_GALLERY_LIMITS.MAX} gallery images.`
      );
      setProjectSubmitting(false);
      return;
    }

    const isEditing = projectModalMode === "edit" && projectForm.id;

    try {
      if (isEditing) {
        await dispatch(
          updatePortfolioItem({ id: projectForm.id, ...payload })
        ).unwrap();
        setProjectStatus("Project updated successfully.");
      } else {
        await dispatch(addPortfolioItem(payload)).unwrap();
        setProjectStatus("Project added to portfolio.");
      }
      closeProjectModal();
    } catch (submitError) {
      setProjectFormError(
        submitError?.message || "Unable to save this project right now."
      );
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!project?.id) return;
    const confirmed = window.confirm(
      `Delete “${project.title || "portfolio project"}”?`
    );
    if (!confirmed) return;
    try {
      await dispatch(deletePortfolioItem(project.id)).unwrap();
      setProjectStatus("Project removed.");
    } catch (deleteError) {
      setProjectStatus(
        deleteError?.message || "Unable to delete this project."
      );
    }
  };

  const handlePageFieldChange = (event) => {
    const { name, value } = event.target;
    setPageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPageForm = () => {
    setPageForm(buildPageForm(pageContent));
    setPageStatus(null);
  };

  const handleSavePageForm = async (event) => {
    event.preventDefault();
    setPageSubmitting(true);
    setPageStatus(null);
    try {
      await dispatch(updatePortfolioPage(pageForm)).unwrap();
      setPageStatus("Portfolio page copy saved.");
    } catch (pageSaveError) {
      setPageStatus(
        pageSaveError?.message || "Unable to save portfolio page content."
      );
    } finally {
      setPageSubmitting(false);
    }
  };

  const resetListForm = (type) => {
    setListForms((prev) => ({
      ...prev,
      [type]: { ...emptyListForm },
    }));
    setEditingListId((prev) => ({ ...prev, [type]: null }));
  };

  const handleListFieldChange = (type, event) => {
    const { name, value } = event.target;
    setListForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], [name]: value },
    }));
  };

  const handleListSubmit = async (event, type) => {
    event.preventDefault();
    const form = listForms[type];
    setListSubmitting((prev) => ({ ...prev, [type]: true }));
    setListStatus((prev) => ({ ...prev, [type]: null }));

    const payload = {
      title: trimValue(form.title),
      description: trimValue(form.description),
      sortOrder: Number(form.sortOrder) || 0,
    };

    if (!payload.title) {
      setListStatus((prev) => ({
        ...prev,
        [type]: "Title is required.",
      }));
      setListSubmitting((prev) => ({ ...prev, [type]: false }));
      return;
    }

    const isEditing = Boolean(editingListId[type]);

    try {
      if (isEditing) {
        await dispatch(
          updatePortfolioListItem({
            listType: type,
            id: editingListId[type],
            payload,
          })
        ).unwrap();
        setListStatus((prev) => ({
          ...prev,
          [type]: "List item updated.",
        }));
      } else {
        await dispatch(
          createPortfolioListItem({ listType: type, payload })
        ).unwrap();
        setListStatus((prev) => ({
          ...prev,
          [type]: "List item added.",
        }));
      }
      resetListForm(type);
    } catch (listError) {
      setListStatus((prev) => ({
        ...prev,
        [type]: listError?.message || "Unable to save list item.",
      }));
    } finally {
      setListSubmitting((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleListEdit = (type, item) => {
    setListForms((prev) => ({
      ...prev,
      [type]: {
        title: item.title || "",
        description: item.description || "",
        sortOrder: item.sortOrder ?? 0,
      },
    }));
    setEditingListId((prev) => ({ ...prev, [type]: item.id }));
    setListStatus((prev) => ({ ...prev, [type]: null }));
  };

  const handleListDelete = async (type, item) => {
    const confirmed = window.confirm(`Delete “${item.title || "list item"}”?`);
    if (!confirmed) return;
    try {
      await dispatch(
        deletePortfolioListItem({ listType: type, id: item.id })
      ).unwrap();
      setListStatus((prev) => ({ ...prev, [type]: "List item removed." }));
      if (editingListId[type] === item.id) {
        resetListForm(type);
      }
    } catch (deleteError) {
      setListStatus((prev) => ({
        ...prev,
        [type]: deleteError?.message || "Unable to delete this item.",
      }));
    }
  };

  const handleListCancel = (type) => {
    resetListForm(type);
    setListStatus((prev) => ({ ...prev, [type]: null }));
  };

  return {
    list,
    loading,
    error,
    pageLoading,
    pageError,
    projectForm,
    projectModalOpen,
    projectModalMode,
    projectSubmitting,
    projectFormError,
    projectStatus,
    pageForm,
    pageSubmitting,
    pageStatus,
    listForms,
    editingListId,
    listSubmitting,
    listStatus,
    sortedTrustHighlights,
    sortedContentIdeas,
    openAddPanel,
    handleEditProject,
    closeProjectModal,
    handleProjectFieldChange,
    handleGalleryChange,
    handleAddGalleryField,
    handleRemoveGalleryField,
    handleProjectSubmit,
    handleDeleteProject,
    handlePageFieldChange,
    handleResetPageForm,
    handleSavePageForm,
    handleListFieldChange,
    handleListSubmit,
    handleListEdit,
    handleListDelete,
    handleListCancel,
  };
};
