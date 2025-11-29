import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  deleteRole,
  fetchPermissions,
  fetchRoles,
  updateRole,
  updateRolePermissions,
} from "../../../../features/roles/rolesSlice";
import { useToast } from "../../../../contexts/ToastContext.jsx";

const defaultSuggestions = [
  {
    name: "owner",
    label: "Owner",
    description: "Full administrative control and approvals.",
  },
  {
    name: "employee",
    label: "Employee",
    description: "Day-to-day operations and task execution.",
  },
  {
    name: "customer",
    label: "Customer",
    description: "Client portal access for project tracking and support.",
  },
];

const normalize = (value = "") => value.toLowerCase().trim();
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const useRoleIndex = () => {
  const dispatch = useDispatch();
  const rolesState = useSelector((state) => state.roles);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(PAGE_SIZE_OPTIONS[1]);
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (rolesState.error) {
      showToast({ type: "error", title: "Roles", message: rolesState.error });
    }
  }, [rolesState.error, showToast]);

  const permissionOptions = useMemo(
    () =>
      rolesState.permissions.map((permission) => ({
        key: permission.key,
        label: permission.label || permission.key,
        description: permission.description,
      })),
    [rolesState.permissions]
  );

  const filteredRoles = useMemo(() => {
    if (!query.trim()) {
      return rolesState.list;
    }
    const needle = normalize(query);
    return rolesState.list.filter((role) =>
      [role.name, role.label, role.description]
        .filter(Boolean)
        .some((field) => normalize(field).includes(needle))
    );
  }, [rolesState.list, query]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  const suggestions = useMemo(() => {
    const existingNames = new Set(rolesState.list.map((role) => role.name));
    return defaultSuggestions.filter(
      (suggestion) => !existingNames.has(suggestion.name)
    );
  }, [rolesState.list]);

  const handleCreateRole = async (payload) => {
    const result = await dispatch(createRole(payload));
    if (createRole.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Role created",
        message: "Role created successfully",
      });
      return true;
    }
    showToast({
      type: "error",
      title: "Create failed",
      message: result.payload || "Unable to create role",
    });
    return false;
  };

  const handleSaveRole = async ({ roleName, updates, permissions }) => {
    let ok = true;
    if (updates) {
      const updateResult = await dispatch(updateRole({ roleName, updates }));
      if (!updateRole.fulfilled.match(updateResult)) {
        showToast({
          type: "error",
          title: "Update failed",
          message: updateResult.payload || "Unable to update role details",
        });
        ok = false;
      }
    }
    if (ok && permissions) {
      const permResult = await dispatch(
        updateRolePermissions({ roleName, permissions })
      );
      if (!updateRolePermissions.fulfilled.match(permResult)) {
        showToast({
          type: "error",
          title: "Update failed",
          message: permResult.payload || "Unable to update role permissions",
        });
        ok = false;
      }
    }
    if (ok) {
      showToast({
        type: "success",
        title: "Role updated",
        message: "Role updated",
      });
    }
    return ok;
  };

  const handleDeleteRole = async (roleName) => {
    const result = await dispatch(deleteRole(roleName));
    if (deleteRole.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Role deleted",
        message: "Role removed",
      });
      return true;
    }
    showToast({
      type: "error",
      title: "Delete failed",
      message: result.payload || "Unable to delete role",
    });
    return false;
  };

  return {
    ...rolesState,
    query,
    setQuery,
    filteredRoles,
    paginatedRoles,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems: filteredRoles.length,
      pageSizes: PAGE_SIZE_OPTIONS,
      setPage,
      setPageSize: (size) => setPageSizeState(Number(size)),
    },
    permissionOptions,
    suggestions,
    createRole: handleCreateRole,
    saveRole: handleSaveRole,
    deleteRole: handleDeleteRole,
  };
};

export default useRoleIndex;
