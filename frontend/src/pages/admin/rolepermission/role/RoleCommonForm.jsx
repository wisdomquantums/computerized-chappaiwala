const RoleCommonForm = ({
  draft,
  onFieldChange,
  permissionOptions,
  selectedPermissions,
  onTogglePermission,
  disableStatus,
  highlightPermission,
}) => {
  return (
    <div className="rolepermission-form rolepermission-permissions">
      <div>
        <label htmlFor="role-label">Display label</label>
        <input
          id="role-label"
          value={draft.label}
          onChange={(event) => onFieldChange("label", event.target.value)}
          placeholder="e.g. Operations Manager"
        />
      </div>

      <div>
        <label htmlFor="role-description">Description</label>
        <textarea
          id="role-description"
          value={draft.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Short note for teammates"
        />
      </div>

      {!disableStatus && (
        <div>
          <label htmlFor="role-status">Status</label>
          <select
            id="role-status"
            value={draft.status}
            onChange={(event) => onFieldChange("status", event.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      <div>
        <label>Permissions</label>
        <div className="rolepermission-permission-list">
          {permissionOptions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No permissions found. Sync with the server to load them.
            </p>
          ) : (
            permissionOptions.map((permission) => (
              <label
                key={permission.key}
                className={`rolepermission-permission${
                  highlightPermission === permission.key
                    ? " rolepermission-permission--highlight"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.key)}
                  onChange={() => onTogglePermission(permission.key)}
                />
                <span>
                  <strong>{permission.label}</strong>
                  <br />
                  <small>{permission.description}</small>
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleCommonForm;
