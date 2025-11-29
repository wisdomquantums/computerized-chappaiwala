import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPermissions,
    fetchRoles,
    updateRole,
    updateRolePermissions,
} from "../../../../features/roles/rolesSlice";
import { useToast } from "../../../../contexts/ToastContext.jsx";

const toPermissionKeys = (permissions = []) =>
    permissions.map((permission) => permission.key);

const usePersonaRole = (roleName) => {
    const dispatch = useDispatch();
    const rolesState = useSelector((state) => state.roles);
    const { showToast } = useToast();
    const [draft, setDraft] = useState({
        label: "",
        description: "",
        status: "active",
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const role = useMemo(
        () => rolesState.list.find((item) => item.name === roleName) || null,
        [rolesState.list, roleName]
    );

    useEffect(() => {
        if (!rolesState.list.length && !rolesState.loading) {
            dispatch(fetchRoles());
        }
    }, [dispatch, rolesState.list.length, rolesState.loading]);

    useEffect(() => {
        if (!rolesState.permissions.length && !rolesState.permissionsLoading) {
            dispatch(fetchPermissions());
        }
    }, [dispatch, rolesState.permissions.length, rolesState.permissionsLoading]);

    useEffect(() => {
        if (role) {
            setDraft({
                label: role.label || "",
                description: role.description || "",
                status: role.status || "active",
            });
            setSelectedPermissions(toPermissionKeys(role.permissions || []));
        }
    }, [role]);

    useEffect(() => {
        if (rolesState.error) {
            showToast({
                type: "error",
                title: "Roles",
                message: rolesState.error,
            });
        }
        if (rolesState.permissionError) {
            showToast({
                type: "error",
                title: "Permissions",
                message: rolesState.permissionError,
            });
        }
    }, [rolesState.error, rolesState.permissionError, showToast]);

    const permissionOptions = useMemo(
        () =>
            rolesState.permissions.map((permission) => ({
                key: permission.key,
                label: permission.label || permission.key,
                description: permission.description,
            })),
        [rolesState.permissions]
    );

    const originalPermissions = useMemo(
        () => toPermissionKeys(role?.permissions || []),
        [role?.permissions]
    );

    const hasPermissionChanges = useMemo(() => {
        if (selectedPermissions.length !== originalPermissions.length) {
            return true;
        }
        const current = new Set(selectedPermissions);
        return originalPermissions.some((key) => !current.has(key));
    }, [originalPermissions, selectedPermissions]);

    const hasDetailChanges = useMemo(() => {
        if (!role) return false;
        return (
            role.label !== draft.label ||
            (role.description || "") !== (draft.description || "") ||
            (role.status || "active") !== draft.status
        );
    }, [draft, role]);

    const isSavingDetails = rolesState.savingRole === roleName;
    const isSavingPermissions =
        rolesState.savingRole === `${roleName}:permissions`;

    const handleFieldChange = (field, value) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    const handleTogglePermission = (key) => {
        setSelectedPermissions((prev) =>
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key]
        );
    };

    const restoreDefaults = () => {
        if (!role) return;
        setDraft({
            label: role.label || "",
            description: role.description || "",
            status: role.status || "active",
        });
        setSelectedPermissions(toPermissionKeys(role.permissions || []));
    };

    const persistUpdates = async (overrides = {}) => {
        if (!role) return false;
        let ok = true;
        const nextDraft = { ...draft, ...overrides };
        const updates = {};
        if (role.label !== nextDraft.label) updates.label = nextDraft.label;
        if ((role.description || "") !== (nextDraft.description || "")) {
            updates.description = nextDraft.description;
        }
        if ((role.status || "active") !== nextDraft.status) {
            updates.status = nextDraft.status;
        }

        if (Object.keys(updates).length) {
            const result = await dispatch(updateRole({ roleName, updates }));
            if (!updateRole.fulfilled.match(result)) {
                ok = false;
                showToast({
                    type: "error",
                    title: "Update failed",
                    message: result.payload || "Unable to update persona details",
                });
            }
        }

        if (ok && hasPermissionChanges) {
            const result = await dispatch(
                updateRolePermissions({ roleName, permissions: selectedPermissions })
            );
            if (!updateRolePermissions.fulfilled.match(result)) {
                ok = false;
                showToast({
                    type: "error",
                    title: "Permissions failed",
                    message: result.payload || "Unable to update permissions",
                });
            }
        }

        if (ok && (Object.keys(updates).length || hasPermissionChanges)) {
            showToast({
                type: "success",
                title: "Persona updated",
                message: `${role.label || role.name} blueprint saved`,
            });
        }

        return ok;
    };

    const toggleStatus = async () => {
        if (!role) return;
        const nextStatus = draft.status === "active" ? "inactive" : "active";
        setDraft((prev) => ({ ...prev, status: nextStatus }));
        await persistUpdates({ status: nextStatus });
    };

    return {
        role,
        draft,
        permissionOptions,
        selectedPermissions,
        loading: rolesState.loading,
        permissionsLoading: rolesState.permissionsLoading,
        savingRole: rolesState.savingRole,
        hasDetailChanges,
        hasPermissionChanges,
        isSavingDetails,
        isSavingPermissions,
        canSave: hasDetailChanges || hasPermissionChanges,
        handleFieldChange,
        handleTogglePermission,
        restoreDefaults,
        persistUpdates,
        toggleStatus,
    };
};

export default usePersonaRole;
