import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import RoleCommonForm from "./RoleCommonForm";

const RoleEditModal = ({
  role,
  permissionOptions,
  savingKey,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState(() => ({
    label: role.label || "",
    description: role.description || "",
    status: role.status || "active",
  }));
  const [permissions, setPermissions] = useState(
    () => role.permissions?.map((permission) => permission.key) || []
  );

  const originalPermissions = useMemo(
    () => role.permissions?.map((permission) => permission.key) || [],
    [role.permissions]
  );

  const hasPermissionChanges = useMemo(() => {
    if (permissions.length !== originalPermissions.length) {
      return true;
    }
    const currentSet = new Set(permissions);
    return originalPermissions.some((key) => !currentSet.has(key));
  }, [permissions, originalPermissions]);

  const isSavingDetails = savingKey === role.name;
  const isSavingPermissions = savingKey === `${role.name}:permissions`;

  const handleFieldChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleTogglePermission = (key) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSave({
      roleName: role.name,
      updates: {
        label: draft.label,
        description: draft.description,
        status: draft.status,
      },
      permissions: hasPermissionChanges ? permissions : null,
    });
    if (result) {
      onClose();
    }
  };

  return createPortal(
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <div className="rolepermission-modal-head">
          <div>
            <p className="rolepermission-role-meta">Edit role</p>
            <h2>{role.label || role.name}</h2>
          </div>
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="rolepermission-form" onSubmit={handleSubmit}>
          <RoleCommonForm
            draft={draft}
            onFieldChange={handleFieldChange}
            permissionOptions={permissionOptions}
            selectedPermissions={permissions}
            onTogglePermission={handleTogglePermission}
            disableStatus={false}
          />

          <div className="rolepermission-actions">
            <button
              type="submit"
              className="primary"
              disabled={isSavingDetails || isSavingPermissions}
            >
              {isSavingDetails || isSavingPermissions ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RoleEditModal;
