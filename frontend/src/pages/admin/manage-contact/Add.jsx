import CommonFormAdd from "./CommonFormAdd";

const Add = ({
  form,
  lineFields,
  formError,
  submitting,
  onClose,
  onSubmit,
  onChange,
  onLineChange,
  onAddLineField,
  onRemoveLineField,
}) => {
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <form className="rolepermission-form" onSubmit={onSubmit}>
          <div className="rolepermission-modal-head">
            <div>
              <p className="rolepermission-role-meta">Contact cards</p>
              <h2>Add new card</h2>
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
            form={form}
            lineFields={lineFields}
            formError={formError}
            submitting={submitting}
            onClose={onClose}
            onChange={onChange}
            onLineChange={onLineChange}
            onAddLineField={onAddLineField}
            onRemoveLineField={onRemoveLineField}
          />
        </form>
      </div>
    </div>
  );
};

export default Add;
