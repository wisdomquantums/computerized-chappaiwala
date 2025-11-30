import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../../components/ui/Loader.jsx";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../features/users/usersSlice";
import { useToast } from "../../../contexts/ToastContext.jsx";
import "../rolepermission/role/RolePermission.css";

const roleMetaMap = {
  admins: {
    role: "admin",
    title: "Admin accounts",
    description: "System owners who can manage every workspace and permission.",
  },
  employees: {
    role: "employee",
    title: "Employee accounts",
    description: "Frontline teammates handling customer requests and services.",
  },
  owners: {
    role: "owner",
    title: "Owner accounts",
    description:
      "Business owners supervising employees and customer escalations.",
  },
  customers: {
    role: "customer",
    title: "Customer accounts",
    description: "External clients using the self-service portal.",
  },
};

const normalizeStatus = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "inactive" ? "inactive" : "active";
  }
  return value === false ? "inactive" : "active";
};

const normalizeRole = (value) => (value || "").toLowerCase();

const buildAddFormDefaults = (role = "customer") => ({
  name: "",
  username: "",
  email: "",
  password: "",
  address: "",
  role,
  status: "active",
});

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
  { value: "employee", label: "Employee" },
  { value: "customer", label: "Customer" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UserDirectory = () => {
  const { roleType } = useParams();
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users);
  const { showToast } = useToast();
  const meta = roleMetaMap[roleType?.toLowerCase()] || {
    role: null,
    title: "All users",
    description:
      "Search every account inside Computerized Chhappaiwala Control Center.",
  };
  const defaultRole = meta.role || "customer";

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({ type: null, user: null });
  const [addForm, setAddForm] = useState(() =>
    buildAddFormDefaults(defaultRole)
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUsers({ silent: true }));
    } finally {
      setRefreshing(false);
    }
  };
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    role: defaultRole,
    status: "active",
    address: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return usersState.list.filter((user) => {
      const matchesRole = meta.role
        ? normalizeRole(user.role) === meta.role
        : true;
      if (!matchesRole) return false;
      if (!needle) return true;
      return [user.name, user.username, user.email, user.role, user.status]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(needle));
    });
  }, [usersState.list, meta.role, query]);

  const busy = usersState.loading;
  const hasError = Boolean(usersState.error);
  const statusSummary = meta.role
    ? `${filteredUsers.length} ${meta.role} account${
        filteredUsers.length === 1 ? "" : "s"
      }`
    : `${filteredUsers.length} total account${
        filteredUsers.length === 1 ? "" : "s"
      }`;

  const openModal = (type, user = null) => {
    if (type === "add") {
      setAddForm(buildAddFormDefaults(defaultRole));
    }
    if (type === "edit" && user) {
      setEditForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role || defaultRole,
        status: normalizeStatus(user.status),
        address: user.addressText || "",
        password: "",
      });
    }
    setModal({ type, user });
  };

  const closeModal = () => {
    setModal({ type: null, user: null });
    setAddForm(buildAddFormDefaults(defaultRole));
    setEditForm({
      name: "",
      username: "",
      email: "",
      role: defaultRole,
      status: "active",
      address: "",
      password: "",
    });
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    if (
      !addForm.name.trim() ||
      !addForm.username.trim() ||
      !addForm.email.trim() ||
      !addForm.password
    ) {
      showToast({
        type: "error",
        message: "Name, username, email, and password are required.",
      });
      return;
    }

    const payload = {
      name: addForm.name.trim(),
      username: addForm.username.trim(),
      email: addForm.email.trim(),
      password: addForm.password,
      role: addForm.role,
      status: addForm.status,
      address: addForm.address.trim(),
    };

    const result = await dispatch(createUser(payload));
    if (createUser.fulfilled.match(result)) {
      showToast({ type: "success", message: "User added successfully." });
      closeModal();
      dispatch(fetchUsers({ silent: true }));
    } else {
      showToast({
        type: "error",
        message: result.payload || "Unable to add user right now.",
      });
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!modal.user) return;

    const trimmedName = editForm.name.trim();
    const trimmedUsername = editForm.username.trim();
    const trimmedEmail = editForm.email.trim();
    if (!trimmedName || !trimmedUsername || !trimmedEmail) {
      showToast({
        type: "error",
        message: "Name, username, and email are required.",
      });
      return;
    }

    const updates = {};
    if (trimmedName && trimmedName !== modal.user.name) {
      updates.name = trimmedName;
    }
    if (trimmedEmail && trimmedEmail !== modal.user.email) {
      updates.email = trimmedEmail;
    }
    if (trimmedUsername && trimmedUsername !== (modal.user.username || "")) {
      updates.username = trimmedUsername;
    }
    if (editForm.role && editForm.role !== modal.user.role) {
      updates.role = editForm.role;
    }
    const existingStatus = normalizeStatus(modal.user.status);
    if (editForm.status && existingStatus !== editForm.status) {
      updates.status = editForm.status;
    }

    const existingAddress = (modal.user.addressText || "").trim();
    const nextAddress = editForm.address.trim();
    if (existingAddress !== nextAddress) {
      updates.address = nextAddress;
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        showToast({
          type: "error",
          message: "Password must be at least 6 characters.",
        });
        return;
      }
      updates.password = editForm.password;
    }

    if (Object.keys(updates).length === 0) {
      showToast({ type: "info", message: "No changes to save." });
      return;
    }

    const result = await dispatch(
      updateUser({
        id: modal.user.id,
        updates,
      })
    );

    if (updateUser.fulfilled.match(result)) {
      showToast({ type: "success", message: "User updated." });
      closeModal();
      dispatch(fetchUsers({ silent: true }));
    } else {
      showToast({
        type: "error",
        message: result.payload || "Unable to update user.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.user) return;
    const result = await dispatch(deleteUser(modal.user.id));
    if (deleteUser.fulfilled.match(result)) {
      showToast({ type: "success", message: "User deleted." });
      closeModal();
      dispatch(fetchUsers({ silent: true }));
    } else {
      showToast({
        type: "error",
        message: result.payload || "Unable to delete user.",
      });
    }
  };

  const renderAddForm = () => (
    <form className="rolepermission-form" onSubmit={handleAddSubmit}>
      <div className="rolepermission-modal-head">
        <div>
          <p className="rolepermission-role-meta">Create account</p>
          <h2>Add new user</h2>
        </div>
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Close
        </button>
      </div>

      <label>
        Full name
        <input
          type="text"
          value={addForm.name}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, name: event.target.value }))
          }
          placeholder="e.g. Harshita Singh"
        />
      </label>

      <label>
        Username
        <input
          type="text"
          value={addForm.username}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, username: event.target.value }))
          }
          placeholder="unique.username"
        />
      </label>

      <label>
        Email address
        <input
          type="email"
          value={addForm.email}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, email: event.target.value }))
          }
          placeholder="name@company.com"
        />
      </label>

      <label>
        Temporary password
        <input
          type="password"
          value={addForm.password}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, password: event.target.value }))
          }
          placeholder="Minimum 8 characters"
        />
      </label>

      <label>
        Address
        <textarea
          rows={3}
          value={addForm.address}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, address: event.target.value }))
          }
          placeholder="Optional mailing address"
        />
      </label>

      <label>
        Role
        <select
          value={addForm.role}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, role: event.target.value }))
          }
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select
          value={addForm.status}
          onChange={(event) =>
            setAddForm((prev) => ({ ...prev, status: event.target.value }))
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="rolepermission-actions rolepermission-modal-footer">
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rolepermission-btn primary"
          disabled={usersState.creating}
        >
          {usersState.creating ? "Creating..." : "Create user"}
        </button>
      </div>
    </form>
  );

  const renderEditForm = (user) => (
    <form className="rolepermission-form" onSubmit={handleEditSubmit}>
      <div className="rolepermission-modal-head">
        <div>
          <p className="rolepermission-role-meta">Update account</p>
          <h2>{user.name}</h2>
        </div>
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Close
        </button>
      </div>

      <label>
        Full name
        <input
          type="text"
          value={editForm.name}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, name: event.target.value }))
          }
          placeholder="e.g. Harshita Singh"
        />
      </label>

      <label>
        Username
        <input
          type="text"
          value={editForm.username}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, username: event.target.value }))
          }
          placeholder="unique.username"
        />
      </label>

      <label>
        Email address
        <input
          type="email"
          value={editForm.email}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, email: event.target.value }))
          }
          placeholder="name@company.com"
        />
      </label>

      <label>
        Address
        <textarea
          rows={3}
          value={editForm.address}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, address: event.target.value }))
          }
          placeholder="Optional mailing address"
        />
      </label>

      <label>
        Reset password
        <input
          type="password"
          value={editForm.password}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, password: event.target.value }))
          }
          placeholder="Leave blank to keep current password"
        />
      </label>

      <label>
        Role
        <select
          value={editForm.role}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, role: event.target.value }))
          }
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select
          value={editForm.status}
          onChange={(event) =>
            setEditForm((prev) => ({ ...prev, status: event.target.value }))
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="rolepermission-actions rolepermission-modal-footer">
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rolepermission-btn primary"
          disabled={usersState.updatingId === user.id}
        >
          {usersState.updatingId === user.id ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );

  const renderDeletePrompt = (user) => (
    <div className="rolepermission-shell">
      <div className="rolepermission-modal-head">
        <div>
          <p className="rolepermission-role-meta">Danger zone</p>
          <h2>Delete {user.name}?</h2>
        </div>
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
      <p>
        This will permanently remove the account and revoke all access. The
        action cannot be undone.
      </p>
      <div className="rolepermission-actions rolepermission-modal-footer">
        <button
          type="button"
          className="rolepermission-btn ghost"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rolepermission-btn ghost danger"
          onClick={handleDeleteConfirm}
          disabled={usersState.deletingId === user.id}
        >
          {usersState.deletingId === user.id ? "Deleting..." : "Delete user"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">User management</p>
            <h1>{meta.title}</h1>
            <p className="rolepermission-section-subtitle">
              {meta.description}
            </p>
            <small>{statusSummary}</small>
          </div>
          <div className="rolepermission-head-controls">
            <div className="rolepermission-search">
              <input
                type="search"
                placeholder="Search by name, username, email, or status"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={() => openModal("add")}
            >
              Add user
            </button>
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {busy ? (
          <Loader />
        ) : hasError ? (
          <div className="rolepermission-empty">
            <p>Unable to load users. {usersState.error}</p>
          </div>
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="rolepermission-empty">
                      No users found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const status = normalizeStatus(user.status);
                    const label = user.roleMeta?.label || user.role;
                    return (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="rolepermission-role-name">
                            <span className="rolepermission-role-label">
                              {user.name}
                            </span>
                            <small>ID: {user.id}</small>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{label}</td>
                        <td>
                          <span className={`rolepermission-status ${status}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className="rolepermission-actions rolepermission-table-actions">
                            <button
                              type="button"
                              className="rolepermission-btn ghost"
                              onClick={() => openModal("edit", user)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rolepermission-btn ghost danger"
                              onClick={() => openModal("delete", user)}
                              disabled={usersState.deletingId === user.id}
                            >
                              {usersState.deletingId === user.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal.type && (
        <div className="rolepermission-modal" role="dialog" aria-modal="true">
          <div className="rolepermission-modal-panel small">
            {modal.type === "add" && renderAddForm()}
            {modal.type === "edit" && modal.user && renderEditForm(modal.user)}
            {modal.type === "delete" &&
              modal.user &&
              renderDeletePrompt(modal.user)}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;
