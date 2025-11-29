import RoleCommonForm from "../role/RoleCommonForm.jsx";

const EmployeeCommonForm = (props) => (
  <div>
    <div className="rolepermission-form-headline">
      <p className="rolepermission-role-meta">Employee persona</p>
      <h3>Role DNA</h3>
      <p className="rolepermission-section-subtitle">
        Calibrate job labels, copy, and permission toggles for operators.
      </p>
    </div>
    <RoleCommonForm {...props} />
  </div>
);

export default EmployeeCommonForm;
