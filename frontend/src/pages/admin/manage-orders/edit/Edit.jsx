import PropTypes from "prop-types";
import CommonFormAdd from "../common/CommonFormAdd";

const Edit = ({
  form,
  formError,
  submitting,
  onClose,
  onSubmit,
  onChange,
  onTagChange,
}) => (
  <div className="rolepermission-modal" role="dialog" aria-modal="true">
    <div className="rolepermission-modal-panel">
      <form className="rolepermission-form" onSubmit={onSubmit}>
        <div className="rolepermission-modal-head">
          <div>
            <p className="rolepermission-role-meta">Update order</p>
            <h2>Edit order details</h2>
          </div>
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <CommonFormAdd
          panelMode="edit"
          form={form}
          formError={formError}
          submitting={submitting}
          onClose={onClose}
          onChange={onChange}
          onTagChange={onTagChange}
        />
      </form>
    </div>
  </div>
);

Edit.propTypes = {
  form: PropTypes.object.isRequired,
  formError: PropTypes.string,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onTagChange: PropTypes.func.isRequired,
};

export default Edit;
