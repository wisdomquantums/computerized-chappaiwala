import { useState } from "react";

const RoleRow = ({
  role,
  index,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
  deletingRole,
}) => {
  const isDeleting = deletingRole === role.name;
  const [showPermissions, setShowPermissions] = useState(false);
  const serialNumber = index + 1;

  const handleStatusClick = () => {
    onToggleStatus(role);
  };

  return (
    <tr className="rolepermission-row">
      <td>{serialNumber}</td>
      <td>
        <div className="rolepermission-role-name">
          <span className="rolepermission-role-label">
            {role.label || "Untitled"}
          </span>
          <small>{role.name}</small>
        </div>
      </td>
      <td>
        <div className="rolepermission-permission-cell">
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={() => setShowPermissions((prev) => !prev)}
          >
            {showPermissions ? "Hide" : "View"} ({role.permissions?.length || 0}
            )
          </button>
          {showPermissions && (
            <div className="rolepermission-permission-pop">
              {role.permissions?.length ? (
                role.permissions.map((permission) => (
                  <span key={permission.key}>
                    {permission.label || permission.key}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No permissions</span>
              )}
            </div>
          )}
        </div>
      </td>
      <td>
        <button
          type="button"
          className={`rolepermission-status-btn ${role.status || "inactive"}`}
          onClick={handleStatusClick}
        >
          {role.status === "active" ? "Active" : "Inactive"}
        </button>
      </td>
      <td>
        <div className="rolepermission-actions rolepermission-actions-inline rolepermission-actions-group">
          <button
            type="button"
            className="ghost"
            onClick={() => onEditClick(role)}
          >
            Edit
          </button>
          <button
            type="button"
            className="ghost danger"
            onClick={() => onDeleteClick(role)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RoleRow;
