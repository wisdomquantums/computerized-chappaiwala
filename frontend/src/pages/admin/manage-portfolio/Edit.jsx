import CommonForm from "./CommonForm";

const Edit = (props) => {
  const { onClose, onSubmit } = props;
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <form className="rolepermission-form" onSubmit={onSubmit}>
          <div className="rolepermission-modal-head">
            <div>
              <p className="rolepermission-role-meta">Portfolio project</p>
              <h2>Edit project</h2>
            </div>
            <button
              type="button"
              className="rolepermission-btn ghost"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <CommonForm panelMode="edit" {...props} />
        </form>
      </div>
    </div>
  );
};

export default Edit;
