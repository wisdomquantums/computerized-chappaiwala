import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../../features/orders/ordersSlice";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_PRIORITY_OPTIONS,
  ORDER_CHANNEL_OPTIONS,
} from "../../../constants/orders";

const BACKOFFICE_DEFAULT_CHANNEL = ORDER_CHANNEL_OPTIONS.includes("Backoffice")
  ? "Backoffice"
  : ORDER_CHANNEL_OPTIONS[0];

const defaultFormState = {
  projectName: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  company: "",
  serviceLine: "",
  channel: BACKOFFICE_DEFAULT_CHANNEL,
  status: ORDER_STATUS_OPTIONS[0],
  priority: ORDER_PRIORITY_OPTIONS[1],
  dueDate: "",
  budget: "",
  description: "",
  internalNotes: "",
  quantity: "1",
  assignedTo: "",
  tags: [],
  tagsInput: "",
};

const defaultFilters = {
  status: "",
  priority: "",
  channel: "",
};

const normalizeForm = (order = {}) => ({
  projectName: order.projectName || "",
  clientName: order.clientName || order.customer?.name || "",
  clientEmail: order.clientEmail || order.customer?.email || "",
  clientPhone: order.clientPhone || order.customer?.mobileNumber || "",
  company: order.company || order.customer?.company || "",
  serviceLine: order.serviceLine || "",
  channel: order.channel || BACKOFFICE_DEFAULT_CHANNEL,
  status: order.status || ORDER_STATUS_OPTIONS[0],
  priority: order.priority || ORDER_PRIORITY_OPTIONS[1],
  dueDate: order.dueDate || "",
  budget: order.budget ? String(order.budget) : "",
  description: order.description || "",
  internalNotes: order.internalNotes || "",
  quantity: order.quantity ? String(order.quantity) : "1",
  assignedTo: order.assignedTo || "",
  tags: Array.isArray(order.tags) ? order.tags : [],
  tagsInput: Array.isArray(order.tags) ? order.tags.join(", ") : "",
});

const composeOrderPayload = (source, overrides = {}) => {
  const normalized = normalizeForm({ ...source, ...overrides });
  const { tagsInput: _TAGS_INPUT, ...rest } = normalized;
  const payload = {
    ...rest,
    budget: normalized.budget ? Number(normalized.budget) : null,
    quantity: normalized.quantity ? Number(normalized.quantity) : 1,
    tags: normalized.tags,
  };
  payload.assignedTo = payload.assignedTo?.trim() || null;
  return payload;
};

const useManageOrders = () => {
  const dispatch = useDispatch();
  const {
    list: orderCollection,
    loading,
    error,
  } = useSelector((state) => state.orders);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("add");
  const [form, setForm] = useState(() => ({ ...defaultFormState }));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = useMemo(() => {
    const activeStatuses = new Set([
      "Pending",
      "In progress",
      "Waiting on client",
      "QA",
    ]);
    const activeCount = orderCollection.filter((order) =>
      activeStatuses.has(order.status)
    ).length;
    const statusOptions = ORDER_STATUS_OPTIONS;
    const priorityOptions = ORDER_PRIORITY_OPTIONS;
    const channelOptions = ORDER_CHANNEL_OPTIONS;
    return {
      activeCount,
      statusOptions,
      priorityOptions,
      channelOptions,
      totalCount: orderCollection.length,
    };
  }, [orderCollection]);

  const filteredList = useMemo(() => {
    return orderCollection.filter((order) => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.priority && order.priority !== filters.priority) return false;
      if (filters.channel && order.channel !== filters.channel) return false;
      return true;
    });
  }, [orderCollection, filters]);

  const resetForm = () => {
    setForm({ ...defaultFormState });
    setSelectedOrder(null);
    setFormError(null);
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
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

  const openEditPanel = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setForm(normalizeForm(order));
    setPanelMode("edit");
    setPanelOpen(true);
    setFormError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, tags, tagsInput: value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const extractMessage = (input) => {
    if (typeof input === "string") return input;
    if (input?.message) return input.message;
    return "Something went wrong.";
  };

  const handleStatusChange = async (id, status) => {
    if (!id) return;
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
    } catch (statusError) {
      setFormError(extractMessage(statusError) || "Unable to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this order?")) return;
    try {
      await dispatch(deleteOrder(id)).unwrap();
      if (selectedOrder?.id === id) {
        closePanel();
      }
    } catch (deleteError) {
      setFormError(extractMessage(deleteError) || "Unable to delete order.");
    }
  };

  const validateForm = () => {
    if (!form.projectName.trim()) {
      setFormError("Project name is required.");
      return false;
    }
    if (!form.clientName.trim()) {
      setFormError("Client name is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = composeOrderPayload(form);

    setSubmitting(true);
    try {
      if (panelMode === "edit" && selectedOrder) {
        await dispatch(
          updateOrder({ id: selectedOrder.id, ...payload })
        ).unwrap();
      } else {
        await dispatch(createOrder(payload)).unwrap();
      }
      closePanel();
    } catch (submitError) {
      setFormError(extractMessage(submitError) || "Unable to save order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignmentUpdate = async (order, assignee) => {
    if (!order?.id) return false;
    setFormError(null);
    try {
      await dispatch(
        updateOrder({
          id: order.id,
          ...composeOrderPayload(order, { assignedTo: assignee }),
        })
      ).unwrap();
      return true;
    } catch (assignError) {
      setFormError(extractMessage(assignError) || "Unable to assign order.");
      return false;
    }
  };

  return {
    list: filteredList,
    rawList: orderCollection,
    loading,
    error,
    panelOpen,
    panelMode,
    form,
    formError,
    submitting,
    filters,
    stats,
    selectedOrder,
    openAddPanel,
    openEditPanel,
    closePanel,
    handleChange,
    handleTagChange,
    handleSubmit,
    handleStatusChange,
    handleDelete,
    handleFilterChange,
    resetFilters,
    handleAssignmentUpdate,
  };
};

export { useManageOrders, defaultFormState };
