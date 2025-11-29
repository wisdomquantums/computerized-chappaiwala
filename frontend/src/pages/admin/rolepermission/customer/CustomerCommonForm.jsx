import RoleCommonForm from "../role/RoleCommonForm.jsx";

const CustomerCommonForm = (props) => (
  <div>
    <div className="rolepermission-form-headline">
      <p className="rolepermission-role-meta">Customer blueprint</p>
      <h3>Fine-grained access</h3>
      <p className="rolepermission-section-subtitle">
        Update naming, copy blocks, and permissions for the customer persona.
      </p>
    </div>
    <RoleCommonForm {...props} />
  </div>
);

export default CustomerCommonForm;
