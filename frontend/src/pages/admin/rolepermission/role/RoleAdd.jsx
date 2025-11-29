import { useMemo, useState } from "react";

const sanitizeSystemName = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

const RoleAdd = ({ onCreateRole, saving, onSuccess }) => {
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState(null);

  const readyToSubmit = useMemo(() => Boolean(nameInput.trim()), [nameInput]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const rawLabel = nameInput.trim();
    if (!rawLabel) {
      setError("Role name is required.");
      return;
    }
    const systemName = sanitizeSystemName(rawLabel) || rawLabel.toLowerCase();
    setError(null);
    const success = await onCreateRole({
      name: systemName,
      label: rawLabel,
      description: "",
      status: "active",
      permissions: [],
    });
    if (success) {
      setNameInput("");
      onSuccess?.();
    }
  };

  return (
    <form className="rolepermission-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="role-name-input">Role name</label>
        <input
          id="role-name-input"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          placeholder="e.g. Sales Manager"
        />
        <p className="text-xs text-slate-500 mt-1">
          We will generate a system identifier automatically from this name.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="rolepermission-actions">
        <button
          type="submit"
          className="primary"
          disabled={!readyToSubmit || saving}
        >
          {saving ? "Saving..." : "Create role"}
        </button>
      </div>
    </form>
  );
};

export default RoleAdd;
