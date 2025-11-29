import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCustomerIndex from "./CustomerIndexUse.jsx";
import "../role/RolePermission.css";
import PersonaPermissionTable from "../shared/PersonaPermissionTable.jsx";

const CustomerIndex = () => {
  const {
    permissionOptions,
    selectedPermissions,
    loading,
    permissionsLoading,
  } = useCustomerIndex();

  const navigate = useNavigate();
  const busy = loading || permissionsLoading;

  const permissionTableRows = useMemo(() => {
    const selected = new Set(selectedPermissions);
    const rows = permissionOptions.map((permission) => ({
      key: permission.key,
      label: permission.label || permission.key,
      description: permission.description,
      status: selected.has(permission.key) ? "active" : "inactive",
      statusLabel: selected.has(permission.key) ? "Enabled" : "Hidden",
    }));

    selectedPermissions.forEach((key) => {
      if (rows.some((row) => row.key === key)) return;
      rows.push({
        key,
        label: key,
        description: "",
        status: "active",
        statusLabel: "Enabled",
      });
    });

    return rows;
  }, [permissionOptions, selectedPermissions]);

  const redirectToRoles = () => navigate("/admin/roles");

  return (
    <div className="rolepermission-page">
      <PersonaPermissionTable
        title="Customer permissions"
        subtitle="Employees execute customer actions, with owners and admins reviewing escalations."
        rows={permissionTableRows}
        loading={busy}
        onAddClick={redirectToRoles}
        onEdit={redirectToRoles}
        onDelete={redirectToRoles}
        addLabel="Add permission"
        emptyLabel="No permissions available."
      />
    </div>
  );
};

export default CustomerIndex;
