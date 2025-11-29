import RoleCommonForm from "../role/RoleCommonForm.jsx";

const OwnerCommonForm = (props) => (
  <div>
    <div className="rolepermission-form-headline">
      <p className="rolepermission-role-meta">Owner persona</p>
      <h3>Executive levers</h3>
      <p className="rolepermission-section-subtitle">
        Keep leadership names and permission stacks tidy from one panel.
      </p>
    </div>
    <RoleCommonForm {...props} />
  </div>
);

export default OwnerCommonForm;
