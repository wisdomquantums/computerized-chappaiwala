import { useState } from "react";
import { createPortal } from "react-dom";
import Loader from "../../../../components/ui/Loader";
import Pagination from "../../../../components/ui/Pagination";
import RoleAdd from "./RoleAdd";
import RoleRow from "./RoleEdit";
import RoleEditModal from "./RoleEditModal";
import RoleDeleteModal from "./RoleDeleteModal";
import useRoleIndex from "./RoleIndexUse";
import "./RolePermission.css";

const RoleIndex = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const {
    loading,
    permissionsLoading,
    savingRole,
    deletingRole,
    query,
    setQuery,
    filteredRoles,
    paginatedRoles,
    pagination,
    permissionOptions,
    createRole,
    saveRole,
    deleteRole,
  } = useRoleIndex();

  const isBusy = loading || permissionsLoading;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteRole(deleteTarget.name);
    if (success) {
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (role) => {
    const nextStatus = role.status === "active" ? "inactive" : "active";
    await saveRole({ roleName: role.name, updates: { status: nextStatus } });
  };

  const hasResults = filteredRoles.length > 0;
  const firstItemIndex = hasResults
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0;

  return (
    <div className="rolepermission-page">
      <div className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <h1>Roles & Permissions</h1>
            <p>Define the guardrails for every teammate across the suite.</p>
          </div>
          <div className="rolepermission-head-controls">
            <div className="rolepermission-search">
              <input
                type="search"
                placeholder="Search by name, label, description"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={() => setShowAddModal(true)}
            >
              Add role
            </button>
          </div>
        </div>

        {isBusy ? (
          <Loader />
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>Serial number</th>
                  <th>Role name</th>
                  <th>Roles permission</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="rolepermission-empty">
                      No roles match your search. Try resetting the filter or
                      creating a new role.
                    </td>
                  </tr>
                ) : (
                  paginatedRoles.map((role, index) => (
                    <RoleRow
                      key={role.name}
                      role={role}
                      index={index + firstItemIndex - 1}
                      onEditClick={setEditingRole}
                      onDeleteClick={setDeleteTarget}
                      onToggleStatus={handleToggleStatus}
                      deletingRole={deletingRole}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isBusy && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            pageSizes={pagination.pageSizes}
            totalItems={filteredRoles.length}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        )}
      </div>

      {showAddModal &&
        createPortal(
          <div className="rolepermission-modal" role="dialog" aria-modal="true">
            <div className="rolepermission-modal-panel">
              <div className="rolepermission-modal-head">
                <div>
                  <p className="rolepermission-role-meta">Add role</p>
                  <h2>Create access</h2>
                </div>
                <button
                  type="button"
                  className="rolepermission-btn ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
              </div>

              <RoleAdd
                onCreateRole={createRole}
                saving={savingRole === "create"}
                onSuccess={() => setShowAddModal(false)}
              />
            </div>
          </div>,
          document.body
        )}

      {editingRole && (
        <RoleEditModal
          key={editingRole.name}
          role={editingRole}
          permissionOptions={permissionOptions}
          savingKey={savingRole}
          onSave={saveRole}
          onClose={() => setEditingRole(null)}
        />
      )}

      {deleteTarget && (
        <RoleDeleteModal
          role={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deletingRole === deleteTarget.name}
        />
      )}
    </div>
  );
};

export default RoleIndex;
