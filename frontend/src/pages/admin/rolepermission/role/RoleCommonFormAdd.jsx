import RoleCommonForm from "./RoleCommonForm";

const RoleCommonFormAdd = ({
  draft,
  onFieldChange,
  permissionOptions,
  selectedPermissions,
  onTogglePermission,
  suggestions,
  onSuggestionSelect,
}) => {
  return (
    <div className="rolepermission-form">
      <div>
        <label htmlFor="role-name">System name</label>
        <input
          id="role-name"
          value={draft.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          placeholder="Lowercase identifier, e.g. sales_manager"
        />
      </div>

      {suggestions?.length > 0 && (
        <div>
          <label>Popular presets</label>
          <div className="rolepermission-suggestions">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.name}
                className="rolepermission-suggestion"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <RoleCommonForm
        draft={draft}
        onFieldChange={onFieldChange}
        permissionOptions={permissionOptions}
        selectedPermissions={selectedPermissions}
        onTogglePermission={onTogglePermission}
        disableStatus={false}
      />
    </div>
  );
};

export default RoleCommonFormAdd;
